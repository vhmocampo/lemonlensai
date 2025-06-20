import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useVehicleData } from "@/hooks/useVehicleData";
import { useReports } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import CheckoutButton from "@/components/CheckoutButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface VehicleReportFormProps {
  onReportCreated: () => void;
}

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  zipCode: z.string().optional().refine(
    val => !val || val.length >= 5,
    { message: "Zip code must be at least 5 characters" }
  ),
  mileage: z.string().refine(
    val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 1000000,
    { message: "Mileage must be a number between 1 and 1,000,000" }
  ),
  listingLink: z.string().optional().refine(
    val => !val || /^https?:\/\/.+\..+/.test(val),
    { message: "Please enter a valid URL (starting with http:// or https://)" }
  ),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function VehicleReportForm({ onReportCreated }: VehicleReportFormProps) {
  const { 
    makes, 
    models, 
    years, 
    isLoadingMakes,
    isLoadingModels,
    isLoadingYears,
    fetchModels, 
    fetchYears 
  } = useVehicleData();
  
  const { createReport, isCreating } = useReports();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPremiumMode, setIsPremiumMode] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      zipCode: "",
      mileage: "",
      listingLink: "",
      additionalInfo: "",
    },
  });

  const handleMakeChange = (value: string) => {
    form.setValue("make", value);
    form.setValue("model", "");
    form.setValue("year", "");
    
    // Find the make object to get its ID
    const selectedMake = makes.find(make => make.name === value);
    if (selectedMake) {
      fetchModels(selectedMake.id);
    }
  };

  const handleModelChange = (value: string) => {
    form.setValue("model", value);
    form.setValue("year", "");
    
    // Find the model object to get its ID
    const selectedModel = models.find(model => model.name === value);
    if (selectedModel) {
      fetchYears(selectedModel.id);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await createReport({
        make: data.make,
        model: data.model,
        year: data.year,
        zipCode: data.zipCode,
        mileage: parseInt(data.mileage),
        listingLink: data.listingLink || undefined,
        additionalInfo: data.additionalInfo || undefined,
        isPremium: isPremiumMode,
      });
      
      toast({
        title: "Report Created",
        description: "Your vehicle health report is being generated.",
      });
      
      form.reset();
      onReportCreated();
    } catch (error: any) {
      // looks like 402: {"error":"Insufficient credits","required_credits":1,"current_credits":156}
      const [code, jsonPart] = error?.message?.split(': ', 2);
      const err = JSON.parse(jsonPart);
      const isInsufficientFunds = code === 402 || err?.error === "Insufficient credits";

      toast({
        title: "Error",
        description: isInsufficientFunds
          ? "You do not have enough credits to generate this report. Please purchase more credits."
          : "An unexpected error occurred while generating the report.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vehicle Report Generator</h2>
        
        {/* Report Type Toggle */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Report Type</h3>
              <p className="text-sm text-gray-600">
                {isPremiumMode ? "Premium reports include more accurate information and enhanced analysis" : "Standard reports provide basic vehicle health information"}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${!isPremiumMode ? 'text-gray-900' : 'text-gray-500'}`}>
                Standard
              </span>
              <Switch
                checked={isPremiumMode}
                onCheckedChange={setIsPremiumMode}
                disabled={!user || user.credits === 0}
              />
              <span className={`text-sm font-medium ${isPremiumMode ? 'text-gray-900' : 'text-gray-500'}`}>
                Premium
              </span>
            </div>
          </div>
          {(!user || user.credits === 0) && (
            <p className="text-sm text-amber-600 mt-2">
              {!user ? "Sign up to access premium features" : "Purchase credits to access premium features"}
            </p>
          )}
        </div>

        { user && (
            <div className="mb-6 mt-4">
                <p className="mb-4 text-sm text-gray-600">
                You have <span className="font-bold">{user.credits}</span> credits available.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <CheckoutButton bestValue={true} label="$19.99 - Purchase 30 Credits" priceId="price_1RXOgAJBQdS2MAfi3kw5yS8V" />
                  <CheckoutButton label="$5.00 -  Purchase 1 Credit" priceId="price_1RXOfdJBQdS2MAfiNXdWoLGf" />
                </div>
            </div>
        )}
        
        <p className="mb-6 text-gray-600">
          {isPremiumMode 
            ? "Premium reports provide detailed analysis with more accurate repair costs and enhanced insights."
            : "Standard reports provide basic vehicle health information including common issues and recalls."
          }
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Make</FormLabel>
                    <Select
                      disabled={isLoadingMakes}
                      onValueChange={handleMakeChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Make" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {makes.map((make) => (
                          <SelectItem key={make.id} value={make.name}>
                            {make.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Model</FormLabel>
                    <Select
                      disabled={isLoadingModels || !form.watch("make")}
                      onValueChange={handleModelChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.name}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Year</FormLabel>
                    <Select
                      disabled={isLoadingYears || !form.watch("model")}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.id} value={year.year.toString()}>
                            {year.year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Premium Fields */}
              {isPremiumMode && (
                <>
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="flex items-center">
                          Zip Code
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-1 h-3 w-3 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Get location-specific repair cost estimates</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 90210" 
                            disabled={!user || user.credits === 0}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem className={isPremiumMode ? "sm:col-span-4" : "sm:col-span-6"}>
                    <FormLabel>Current Mileage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 45000" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isPremiumMode && (
                <>
                  <FormField
                    control={form.control}
                    name="listingLink"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-6">
                        <FormLabel className="flex items-center">
                          Paste Car Listing URL (Optional)
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="ml-1 h-3 w-3 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Provide a link to the vehicle listing for enhanced analysis</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="url"
                            placeholder="Paste the single car URL from CarFax, Autotrader, CarGurus, or any dealer site. We'll use it to extract more details automatically for a better report." 
                            disabled={!user || user.credits === 0}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {isPremiumMode && (
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Any additional information from the dealer
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-1 h-3 w-3 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Get personalized analysis based on your specific concerns</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional details about the vehicle, or responses from the dealer to your questions"
                        className="min-h-[100px]"
                        disabled={!user || user.credits === 0}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button 
              type="submit" 
              className="w-full py-3 px-4 text-base font-medium text-gray-900 bg-lemon-500 hover:bg-lemon-600"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Generate ${isPremiumMode ? 'Premium' : 'Standard'} Report`
              )}
            </Button>
          </form>
        </Form>
      </div>
    </TooltipProvider>
  );
}
