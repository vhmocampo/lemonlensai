import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { VehicleMake, VehicleModel, VehicleYear } from "@shared/schema";

export function useVehicleData() {
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const { 
    data: makes = [], 
    isLoading: isLoadingMakes 
  } = useQuery<VehicleMake[]>({
    queryKey: ["/api/vehicles/makes"],
  });

  const { 
    data: models = [],
    isLoading: isLoadingModels
  } = useQuery<VehicleModel[]>({
    queryKey: ["/api/vehicles/models", selectedMakeId],
    enabled: !!selectedMakeId,
  });

  const { 
    data: years = [],
    isLoading: isLoadingYears
  } = useQuery<VehicleYear[]>({
    queryKey: ["/api/vehicles/years", selectedModelId],
    enabled: !!selectedModelId,
  });

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
