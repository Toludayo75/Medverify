import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

// Define the form schema using zod
const drugFormSchema = z.object({
  nafdacNumber: z.string().min(1, "NAFDAC number is required"),
  productName: z.string().min(1, "Product name is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  dosageForm: z.string().min(1, "Dosage form is required"),
  strength: z.string().min(1, "Strength is required"),
  status: z.enum(["genuine", "counterfeit", "flagged"]),
  isBlacklisted: z.boolean().default(false),
});

type DrugFormValues = z.infer<typeof drugFormSchema>;

type AddDrugFormProps = {
  onSuccess?: () => void;
};

export default function AddDrugForm({ onSuccess }: AddDrugFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the form using react-hook-form with zod validation
  const form = useForm<DrugFormValues>({
    resolver: zodResolver(drugFormSchema),
    defaultValues: {
      nafdacNumber: "",
      productName: "",
      manufacturer: "",
      dosageForm: "",
      strength: "",
      status: "genuine",
      isBlacklisted: false,
    },
  });

  // Mutation for adding a new drug
  const addDrug = useMutation({
    mutationFn: async (data: DrugFormValues) => {
      const res = await apiRequest("POST", "/api/admin/drugs", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Drug added successfully",
        description: "The drug has been added to the database",
      });
      form.reset();
      if (onSuccess) onSuccess();
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add drug",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Handle form submission
  const onSubmit = (data: DrugFormValues) => {
    setIsSubmitting(true);
    addDrug.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-h-[60vh] md:max-h-full">
        <FormField
          control={form.control}
          name="nafdacNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NAFDAC Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="A4-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Drug name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="Manufacturer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosageForm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage Form</FormLabel>
                <FormControl>
                  <Input placeholder="Tablet, Capsule, Syrup, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="strength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strength</FormLabel>
                <FormControl>
                  <Input placeholder="500mg, 5ml, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="genuine">Genuine</SelectItem>
                  <SelectItem value="counterfeit">Counterfeit</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isBlacklisted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Blacklist this drug</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Blacklisted drugs will be flagged as potentially harmful when verified.
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end pb-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Drug"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}