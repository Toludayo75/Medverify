import type { Express } from "express";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertDrugSchema, insertBatchSchema, insertReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/", (_req, res) => {
    res.send("Medverify API is running");
  });

  // API route to handle PDF download
  app.get("/api/downloads/safety-guidelines", (req, res) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=MedVerify-Drug-Safety-Guidelines.pdf');

    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog
   /Pages 2 0 R
>>
endobj

2 0 obj
<< /Type /Pages
   /Kids [3 0 R]
   /Count 1
>>
endobj

3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /Resources << /Font << /F1 4 0 R >>
                 /ProcSet [/PDF /Text] >>
   /MediaBox [0 0 612 792]
   /Contents 5 0 R
>>
endobj

4 0 obj
<< /Type /Font
   /Subtype /Type1
   /BaseFont /Helvetica
>>
endobj

5 0 obj
<< /Length 323 >>
stream
BT
/F1 24 Tf
50 700 Td
(MedVerify Drug Safety Guidelines) Tj
/F1 16 Tf
0 -50 Td
(How to Ensure Your Medications Are Safe) Tj
/F1 12 Tf
0 -40 Td
(1. Always verify NAFDAC numbers using MedVerify) Tj
0 -20 Td
(2. Purchase medications only from licensed pharmacies) Tj
0 -20 Td
(3. Inspect packaging for signs of tampering) Tj
0 -20 Td
(4. Report suspicious medications immediately) Tj
0 -40 Td
(Visit www.medverify.ng for more information) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000059 00000 n
0000000118 00000 n
0000000275 00000 n
0000000353 00000 n
trailer
<< /Size 6
   /Root 1 0 R
>>
startxref
728
%%EOF`;

    res.send(pdfContent);
  });

  setupAuth(app);

  app.get("/api/drugs/:nafdacNumber", async (req, res) => {
    try {
      const nafdacNumber = req.params.nafdacNumber;
      const drug = await storage.getDrugByNafdacNumber(nafdacNumber);

      if (!drug) {
        return res.status(404).json({ message: "Drug not found" });
      }

      const verification = await storage.createVerification({
        drugId: drug.id,
        status: drug.status,
        userId: req.user?.id,
        ipAddress: req.ip,
      });

      res.json({ drug, verification });
    } catch (error) {
      res.status(500).json({ message: "Server error during verification" });
    }
  });

  app.post("/api/verify", async (req, res) => {
    try {
      const { nafdacNumber, batchNumber } = req.body;

      let drug = await storage.getDrugByNafdacNumber(nafdacNumber);

      if (!drug) {
        try {
          const dummyDrug = await storage.createDrug({
            nafdacNumber,
            productName: "Unregistered Drug",
            manufacturer: "Unknown",
            dosageForm: "Unknown",
            strength: "",
            status: "counterfeit",
            isBlacklisted: true
          });

          const verification = await storage.createVerification({
            drugId: dummyDrug.id,
            status: 'counterfeit',
            userId: req.user?.id || null,
            ipAddress: req.ip || "",
            location: req.body.location || "",
          });

          return res.json({
            counterfeit: true,
            nafdacNumber,
            drug: dummyDrug,
            verification,
            message: "This drug is not registered in our database and may be counterfeit"
          });
        } catch {
          return res.json({
            counterfeit: true,
            nafdacNumber,
            verification: {
              id: Date.now(),
              status: 'counterfeit',
              createdAt: new Date().toISOString()
            },
            message: "This drug is not registered in our database and may be counterfeit"
          });
        }
      }

      let batch;
      if (batchNumber) {
        batch = await storage.getBatchByDrugAndBatchNumber(drug.id, batchNumber);
        if (!batch && drug.status === 'genuine') {
          await storage.updateDrug(drug.id, { status: 'flagged' });
          drug = await storage.getDrugByNafdacNumber(nafdacNumber) as typeof drug;
        }
      }

      const verification = await storage.createVerification({
        drugId: drug.id,
        batchId: batch?.id || undefined,
        status: drug.status,
        userId: req.user?.id || null,
        ipAddress: req.ip || "",
        location: req.body.location || "",
      });

      res.json({
        drug,
        batch,
        verification,
        message: drug.isBlacklisted ? "This product has been blacklisted and should not be used" : undefined
      });
    } catch (error) {
      res.status(500).json({ message: "Server error during verification" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const mappedData = {
        ...req.body,
        suspectedIssue: req.body.reason || "other",
        description: req.body.details || "No additional details provided",
        purchaseLocation: req.body.purchaseLocation,
        reason: undefined,
        details: undefined
      };

      const reportData = insertReportSchema.parse(mappedData);

      if (req.isAuthenticated()) {
        reportData.reporterId = req.user.id;
      }

      if (reportData.nafdacNumber) {
        const drug = await storage.getDrugByNafdacNumber(reportData.nafdacNumber);
        if (drug) {
          reportData.drugId = drug.id;
        }
      }

      const report = await storage.createReport(reportData);

      res.status(201).json(report);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: `Invalid report data: ${error.message}` });
      } else {
        res.status(400).json({ message: "Invalid report data" });
      }
    }
  });

  app.get("/api/verifications/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verifications = await storage.getVerificationsByUser(req.user.id);
    res.json(verifications);
  });

  app.get("/api/reports/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const reports = await storage.getReportsByUser(req.user.id);
    res.json(reports);
  });

  app.get("/api/admin/verifications", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const verifications = await storage.getVerifications(limit);
    res.json(verifications);
  });

  app.get("/api/admin/reports", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const status = req.query.status as string | undefined;
    const reports = await storage.getReports(status);
    res.json(reports);
  });

  app.patch("/api/admin/reports/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const reportId = parseInt(req.params.id);
    const { flagDrug, ...reportUpdate } = req.body;

    const currentReport = await storage.getReportById(reportId);
    if (!currentReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    const report = await storage.updateReport(reportId, reportUpdate);

    if (flagDrug === true && currentReport.drugId) {
      const drug = await storage.getDrug(currentReport.drugId);
      if (drug) {
        await storage.updateDrug(drug.id, { status: 'flagged' });

        try {
          const userId = req.user?.id || null;
          if (userId) {
            await storage.createVerification({
              drugId: drug.id,
              status: 'flagged',
              userId: userId as number,
              ipAddress: req.ip || '',
              location: '',
            });
          }
        } catch {
          // ignore errors here
        }
      }
    }

    res.json(report);
  });

  app.post("/api/admin/drugs", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const drugData = insertDrugSchema.parse(req.body);

      const existingDrug = await storage.getDrugByNafdacNumber(drugData.nafdacNumber);
      if (existingDrug) {
        return res.status(400).json({ message: "Drug with this NAFDAC number already exists" });
      }

      const drug = await storage.createDrug(drugData);
      res.status(201).json(drug);
    } catch {
      res.status(400).json({ message: "Invalid drug data" });
    }
  });

  app.post("/api/admin/batches", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const batchData = insertBatchSchema.parse(req.body);

      const drug = await storage.getDrug(batchData.drugId);
      if (!drug) {
        return res.status(404).json({ message: "Drug not found" });
      }

      const existingBatch = await storage.getBatchByDrugAndBatchNumber(batchData.drugId, batchData.batchNumber);
      if (existingBatch) {
        return res.status(400).json({ message: "Batch already exists for this drug" });
      }

      const batch = await storage.createBatch(batchData);
      res.status(201).json(batch);
    } catch {
      res.status(400).json({ message: "Invalid batch data" });
    }
  });

  app.get("/api/admin/drugs", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const drugs = await storage.getAllDrugs();
    res.json(drugs);
  });
}
