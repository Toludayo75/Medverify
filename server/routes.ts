import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertDrugSchema, insertBatchSchema, insertReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to handle PDF download
  app.get("/api/downloads/safety-guidelines", (req, res) => {
    // Generate a simple PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=MedVerify-Drug-Safety-Guidelines.pdf');
    
    // A minimal valid PDF file structure
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
  // Set up authentication routes
  setupAuth(app);

  // Drug verification routes
  app.get("/api/drugs/:nafdacNumber", async (req, res) => {
    try {
      const nafdacNumber = req.params.nafdacNumber;
      const drug = await storage.getDrugByNafdacNumber(nafdacNumber);
      
      if (!drug) {
        return res.status(404).json({ message: "Drug not found" });
      }
      
      // Create verification log
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
      
      console.log("Verifying drug with NAFDAC number:", nafdacNumber);
      
      // Find drug
      let drug = await storage.getDrugByNafdacNumber(nafdacNumber);
      
      if (!drug) {
        console.log("Drug not found:", nafdacNumber);
        
        // For drugs not in our database, create an actual drug entry 
        // with counterfeit status so it can be tracked and counted
        try {
          // Create the drug with counterfeit status
          const dummyDrug = await storage.createDrug({
            nafdacNumber,
            productName: "Unregistered Drug", 
            manufacturer: "Unknown",
            dosageForm: "Unknown",
            strength: "",
            status: "counterfeit",
            isBlacklisted: true
          });
          
          console.log("Created dummy drug for unregistered NAFDAC:", dummyDrug);
          
          // Now create a verification for it
          const verification = await storage.createVerification({
            drugId: dummyDrug.id,
            status: 'counterfeit',
            userId: req.user?.id || null,
            ipAddress: req.ip || "",
            location: req.body.location || "",
          });
          
          console.log("Created counterfeit verification:", verification);
          
          return res.json({
            counterfeit: true,
            nafdacNumber,
            drug: dummyDrug,
            verification,
            message: "This drug is not registered in our database and may be counterfeit"
          });
        } catch (err) {
          console.error("Error creating counterfeit drug record:", err);
          
          // Fall back to the dummy response if database operation fails
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
      
      console.log("Drug found:", drug);
      
      // If batch number is provided, check batch
      let batch;
      if (batchNumber) {
        batch = await storage.getBatchByDrugAndBatchNumber(drug.id, batchNumber);
        if (!batch) {
          console.log("Batch not found:", batchNumber);
          // Batch doesn't exist but drug does - consider flagging
          if (drug.status === 'genuine') {
            await storage.updateDrug(drug.id, { status: 'flagged' });
            drug = await storage.getDrugByNafdacNumber(nafdacNumber) as typeof drug;
          }
        } else {
          console.log("Batch found:", batch);
        }
      }
      
      // Create verification log (user may be anonymous)
      const verification = await storage.createVerification({
        drugId: drug.id,
        batchId: batch?.id || undefined,
        status: drug.status,
        userId: req.user?.id || null,
        ipAddress: req.ip || "",
        location: req.body.location || "",
      });
      
      console.log("Verification created:", verification);
      
      res.json({ 
        drug,
        batch,
        verification,
        message: drug.isBlacklisted 
          ? "This product has been blacklisted and should not be used" 
          : undefined
      });
    } catch (error) {
      console.error("Error during verification:", error);
      res.status(500).json({ message: "Server error during verification" });
    }
  });
  
  // Drug reporting routes
  app.post("/api/reports", async (req, res) => {
  try {
    console.log("Received report data:", req.body);
    
    // Map frontend form fields to backend schema fields
    const mappedData = {
      ...req.body,
      suspectedIssue: req.body.reason || "other",
      description: req.body.details || "No additional details provided",
      purchaseLocation: req.body.purchaseLocation, // Add this line
      reason: undefined,
      details: undefined
    };
    
    // Parse the report data
    const reportData = insertReportSchema.parse(mappedData);
    
    // Add reporter ID if user is authenticated
    if (req.isAuthenticated()) {
      reportData.reporterId = req.user.id;
    }
    
    // Check if the drug exists by NAFDAC number
    if (reportData.nafdacNumber) {
      const drug = await storage.getDrugByNafdacNumber(reportData.nafdacNumber);
      if (drug) {
        reportData.drugId = drug.id;
        console.log("Found drug for report:", drug);
      } else {
        console.log("Drug not found for NAFDAC number:", reportData.nafdacNumber);
      }
    }
    
    // Create the report
    console.log("Creating report with data:", reportData);
    const report = await storage.createReport(reportData);
    console.log("Report created:", report);
    
    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    if (error instanceof Error) {
      res.status(400).json({ message: `Invalid report data: ${error.message}` });
    } else {
      res.status(400).json({ message: "Invalid report data" });
    }
  }
});
  
  // User verification and report routes
  app.get("/api/verifications/user", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const verifications = await storage.getVerificationsByUser(req.user.id);
      res.json(verifications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/reports/user", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const reports = await storage.getReportsByUser(req.user.id);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin routes (protected by role middleware in frontend)
  app.get("/api/admin/verifications", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const verifications = await storage.getVerifications(limit);
      res.json(verifications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/admin/reports", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const status = req.query.status as string | undefined;
      const reports = await storage.getReports(status);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/admin/reports/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const reportId = parseInt(req.params.id);
      const { flagDrug, ...reportUpdate } = req.body;
      
      // Get current report to access its drug
      const currentReport = await storage.getReportById(reportId);
      if (!currentReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Update the report status
      const report = await storage.updateReport(reportId, reportUpdate);
      
      // If flagging is requested and report has an associated drug, flag the drug
      if (flagDrug === true && currentReport.drugId) {
        // Get the drug
        const drug = await storage.getDrug(currentReport.drugId);
        if (drug) {
          console.log("Flagging drug:", drug.productName);
          
          // Update the drug's status to flagged
          const updatedDrug = await storage.updateDrug(drug.id, { status: 'flagged' });
          console.log("Drug flagged:", updatedDrug);
          
          try {
            // Create a verification entry to track this flag action
            const userId = req.user?.id || null;
            if (userId) {
              const verification = await storage.createVerification({
                drugId: drug.id,
                status: 'flagged',
                userId: userId as number,
                ipAddress: req.ip || '',
                location: '',
              });
              console.log("Flag verification created:", verification);
            }
          } catch (err) {
            console.error("Error creating verification:", err);
            // Continue even if verification creation fails
          }
        }
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/admin/drugs", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const drugData = insertDrugSchema.parse(req.body);
      
      // Check if drug already exists
      const existingDrug = await storage.getDrugByNafdacNumber(drugData.nafdacNumber);
      if (existingDrug) {
        return res.status(400).json({ message: "Drug with this NAFDAC number already exists" });
      }
      
      const drug = await storage.createDrug(drugData);
      res.status(201).json(drug);
    } catch (error) {
      res.status(400).json({ message: "Invalid drug data" });
    }
  });
  
  app.post("/api/admin/batches", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const batchData = insertBatchSchema.parse(req.body);
      
      // Check if the drug exists
      const drug = await storage.getDrug(batchData.drugId);
      if (!drug) {
        return res.status(404).json({ message: "Drug not found" });
      }
      
      // Check if batch already exists
      const existingBatch = await storage.getBatchByDrugAndBatchNumber(
        batchData.drugId,
        batchData.batchNumber
      );
      
      if (existingBatch) {
        return res.status(400).json({ message: "Batch already exists for this drug" });
      }
      
      const batch = await storage.createBatch(batchData);
      res.status(201).json(batch);
    } catch (error) {
      res.status(400).json({ message: "Invalid batch data" });
    }
  });

  // Get all drugs for admin
  app.get("/api/admin/drugs", async (req, res) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const drugs = await storage.getAllDrugs();
      res.json(drugs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected admin clients
  const adminClients: WebSocket[] = [];
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Add message handling
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle admin authentication
        if (data.type === 'auth' && data.role === 'admin') {
          console.log('Admin connected to WebSocket');
          adminClients.push(ws);
          
          // Send confirmation
          ws.send(JSON.stringify({
            type: 'auth_success',
            message: 'Admin authentication successful'
          }));
          
          // Send recent notifications immediately (simulate some activity)
          // This helps admins see notifications immediately after connecting
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'verification',
                title: 'Recent Drug Verification',
                message: 'A user verified Paracetamol with NAFDAC Number A11-0591',
                timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                status: 'genuine',
                nafdacNumber: 'A11-0591',
                productName: 'Paracetamol'
              }));
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      const index = adminClients.indexOf(ws);
      if (index !== -1) {
        adminClients.splice(index, 1);
        console.log('Admin client disconnected');
      }
    });
  });
  
  // Helper function to broadcast notifications to admin clients
  const notifyAdmins = (notification: any) => {
    const message = JSON.stringify(notification);
    
    adminClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };
  
  // Modify the routes to send WebSocket notifications
  
  // Intercept verification creation to send notification
  const originalCreateVerification = storage.createVerification;
  storage.createVerification = async (verification) => {
    const result = await originalCreateVerification(verification);
    
    // Get drug details
    const drug = await storage.getDrug(verification.drugId);
    
    // Notify admins about the verification
    if (drug) {
      notifyAdmins({
        type: 'verification',
        title: 'New Drug Verification',
        message: `NAFDAC #${drug.nafdacNumber} (${drug.productName}) was verified`,
        timestamp: new Date().toISOString(),
        status: verification.status,
        nafdacNumber: drug.nafdacNumber,
        productName: drug.productName
      });
    }
    
    return result;
  };
  
  // Intercept report creation to send notification
  const originalCreateReport = storage.createReport;
  storage.createReport = async (report) => {
    const result = await originalCreateReport(report);
    
    // Get drug details if available
    let drugDetails = '';
    if (report.drugId) {
      try {
        const drug = await storage.getDrug(report.drugId);
        if (drug) {
          drugDetails = ` for ${drug.productName} (NAFDAC #${drug.nafdacNumber})`;
        }
      } catch (error) {
        console.error('Error getting drug details for report notification:', error);
      }
    }
    
    // Build a more informative message
    const reportDetails = report.productName ? ` (${report.productName})` : '';
    
    // Notify admins about the report
    notifyAdmins({
      type: 'report',
      title: 'New Drug Report Submitted',
      message: `A user reported suspicious activity${drugDetails}${reportDetails}`,
      timestamp: new Date().toISOString(),
      nafdacNumber: report.nafdacNumber,
      productName: report.productName,
      status: 'pending'
    });
    
    return result;
  };
  
  // Intercept report update to send notification when status changes
  const originalUpdateReport = storage.updateReport;
  storage.updateReport = async (id, reportUpdate) => {
    // Get the original report before updating
    const originalReport = await storage.getReportById(id);
    const result = await originalUpdateReport(id, reportUpdate);
    
    // If status was updated, send a notification
    if (originalReport && reportUpdate.status && originalReport.status !== reportUpdate.status) {
      notifyAdmins({
        type: 'report',
        title: 'Report Status Updated',
        message: `Report #${id} status changed from "${originalReport.status}" to "${reportUpdate.status}"`,
        timestamp: new Date().toISOString(),
        nafdacNumber: originalReport.nafdacNumber,
        productName: originalReport.productName,
        status: reportUpdate.status
      });
    }
    
    return result;
  };
  
  return httpServer;
}
