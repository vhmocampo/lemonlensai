import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface VehicleMake {
  id: number;
  name: string;
}

interface VehicleModel {
  id: number;
  makeId: number;
  name: string;
}

interface VehicleYear {
  id: number;
  modelId: number;
  year: number;
}

export function useVehicleData() {
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const { 
    data: makesResponse, 
    isLoading: isLoadingMakes 
  } = useQuery<{makes: string[]}>({
    queryKey: ["/vehicle/makes"],
  });
  
  // Transform the makes array into the format our app expects
  const makes: VehicleMake[] = (makesResponse?.makes || []).map((name: string, index: number) => ({
    id: index + 1,
    name
  }));

  const { 
    data: modelsResponse,
    isLoading: isLoadingModels
  } = useQuery<{models: string[]}>({
    queryKey: ["/vehicle/models", { make: makes.find(m => m.id === selectedMakeId)?.name }],
    enabled: !!selectedMakeId && makes.length > 0,
  });
  
  // Transform the models array into the format our app expects
  const models: VehicleModel[] = (modelsResponse?.models || []).map((name: string, index: number) => ({
    id: index + 1,
    makeId: selectedMakeId || 0,
    name
  }));

  const { 
    data: yearsResponse,
    isLoading: isLoadingYears
  } = useQuery<{years: string[]}>({
    queryKey: ["/vehicle/years", { 
      model: models.find(m => m.id === selectedModelId)?.name,
      make: makes.find(m => m.id === selectedMakeId)?.name 
    }],
    enabled: !!selectedModelId && models.length > 0 && !!selectedMakeId && makes.length > 0,
  });
  
  // Transform the years array into the format our app expects - but keep year as string
  const years: any[] = (yearsResponse?.years || []).map((yearStr: string, index: number) => ({
    id: index + 1,
    modelId: selectedModelId || 0,
    year: yearStr // Keep as string to match form expectations
  }));

  const fetchModels = (makeId: number) => {
    setSelectedMakeId(makeId);
  };

  const fetchYears = (modelId: number) => {
    setSelectedModelId(modelId);
  };

  return {
    makes,
    models,
    years,
    isLoadingMakes,
    isLoadingModels,
    isLoadingYears,
    fetchModels,
    fetchYears,
  };
}
