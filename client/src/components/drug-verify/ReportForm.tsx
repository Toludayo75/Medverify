import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";

const reportSchema = z.object({
  nafdacNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  productName: z.string().min(1, "Product name is required"),
  purchaseLocation: z.string().min(1, "Purchase location is required"),
  reason: z.string().min(1, "Reason is required"),
  details: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileList | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch, getValues } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      isAnonymous: false,
      reason: "",
    }
  });

  const reportMutation = useMutation({
    mutationFn: async (data: ReportFormValues) => {
      console.log("Sending data to server:", data);
      
      // Make sure reason is not empty
      if (!data.reason) {
        throw new Error("Please select a reason for your report");
      }
      
      const response = await apiRequest("POST", "/api/reports", data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. NAFDAC will investigate this matter.",
      });
      reset();
      setFiles(null);
    },
    onError: (error: Error) => {
      console.error("Report submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    console.log("Form values on submit:", data);
    console.log("Current form values:", getValues());
    reportMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="product-name">Product Name</Label>
        <div className="mt-1">
          <Input
            id="product-name"
            placeholder="e.g. Paracetamol Tablets"
            {...register("productName")}
          />
          {errors.productName && (
            <p className="text-sm text-red-500 mt-1">{errors.productName.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="nafdac-number-report">NAFDAC Number (if available)</Label>
        <div className="mt-1">
          <Input
            id="nafdac-number-report"
            placeholder="e.g. A1-1234"
            {...register("nafdacNumber")}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="batch-number-report">Batch Number (if available)</Label>
        <div className="mt-1">
          <Input
            id="batch-number-report"
            placeholder="e.g. BN12345"
            {...register("batchNumber")}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="purchase-location">Purchase Location</Label>
        <div className="mt-1">
          <Input
            id="purchase-location"
            placeholder="e.g. Pharmacy Name, Street, City"
            {...register("purchaseLocation")}
          />
          {errors.purchaseLocation && (
            <p className="text-sm text-red-500 mt-1">{errors.purchaseLocation.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="report-reason">Reason for Suspicion</Label>
        <div className="mt-1">
          <Select 
            onValueChange={(value) => setValue("reason", value)} 
            defaultValue=""
            name="reason"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unusual-appearance">Unusual Appearance</SelectItem>
              <SelectItem value="adverse-reaction">Adverse Reaction</SelectItem>
              <SelectItem value="failed-verification">Failed Verification</SelectItem>
              <SelectItem value="packaging-concerns">Packaging Concerns</SelectItem>
              <SelectItem value="other">Other (please specify)</SelectItem>
            </SelectContent>
          </Select>
          {errors.reason && (
            <p className="text-sm text-red-500 mt-1">{errors.reason.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="report-details">Additional Details</Label>
        <div className="mt-1">
          <Textarea
            id="report-details"
            rows={4}
            placeholder="Please provide any additional information that might help with the investigation."
            {...register("details")}
          />
        </div>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-neutral-700">Upload Images (optional)</Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="flex text-sm text-neutral-600">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-neutral-500">
              PNG, JPG, GIF up to 10MB
            </p>
            {files && files.length > 0 && (
              <p className="text-sm text-primary">
                {files.length} file(s) selected
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <Checkbox
              id="anonymous-report"
              checked={watch("isAnonymous")}
              onCheckedChange={(checked) => 
                setValue("isAnonymous", checked as boolean)
              }
            />
          </div>
          <div className="ml-3 text-sm">
            <Label
              htmlFor="anonymous-report"
              className="font-medium text-neutral-700"
            >
              Submit anonymously
            </Label>
            <p className="text-neutral-500">
              Your personal information will not be shared with the manufacturer.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={reportMutation.isPending}
        >
          {reportMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Report"
          )}
        </Button>
      </div>
    </form>
  );
}
