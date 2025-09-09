import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import FarmPlot from "@/components/farm-plot";
import { apiRequest } from "@/lib/queryClient";
import type { FarmPlot as FarmPlotType } from "@shared/schema";

const cropTypes = [
  { value: "tomatoes", label: "Tomatoes", duration: 14, yield: 50 },
  { value: "spinach", label: "Spinach", duration: 7, yield: 30 },
  { value: "lettuce", label: "Lettuce", duration: 10, yield: 25 },
  { value: "carrots", label: "Carrots", duration: 21, yield: 40 },
  { value: "peppers", label: "Peppers", duration: 18, yield: 60 },
];

export default function Farm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>("");

  const { data: farmPlots, isLoading } = useQuery<FarmPlotType[]>({
    queryKey: ["/api/farm/plots"],
  });

  const plantCropMutation = useMutation({
    mutationFn: async ({ plotIndex, cropType }: { plotIndex: number; cropType: string }) => {
      return apiRequest("POST", "/api/farm/plant", { plotIndex, cropType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farm/plots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/current"] });
      toast({
        title: "Crop Planted!",
        description: "Your crop has been planted successfully.",
      });
      setSelectedPlot(null);
      setSelectedCrop("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to plant crop",
        variant: "destructive",
      });
    },
  });

  const harvestCropMutation = useMutation({
    mutationFn: async (plotIndex: number) => {
      return apiRequest("POST", "/api/farm/harvest", { plotIndex });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farm/plots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/current"] });
      toast({
        title: "Crop Harvested!",
        description: "You've earned credits and experience!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to harvest crop",
        variant: "destructive",
      });
    },
  });

  const waterCropsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/farm/water", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farm/plots"] });
      toast({
        title: "Crops Watered!",
        description: "All your crops have been watered.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to water crops",
        variant: "destructive",
      });
    },
  });

  const handlePlotClick = (plotIndex: number) => {
    const plot = farmPlots?.find(p => p.plotIndex === plotIndex);
    
    if (!plot || !plot.cropType) {
      setSelectedPlot(plotIndex);
    } else if (plot.growthStage === "ready") {
      harvestCropMutation.mutate(plotIndex);
    }
  };

  const handlePlantCrop = () => {
    if (selectedPlot !== null && selectedCrop) {
      plantCropMutation.mutate({ plotIndex: selectedPlot, cropType: selectedCrop });
    }
  };

  const activeCrops = farmPlots?.filter(plot => plot.cropType !== null)?.length || 0;
  const readyCrops = farmPlots?.filter(plot => plot.growthStage === "ready")?.length || 0;

  if (isLoading) {
    return (
      <div className="farming-pattern min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your farm...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="farming-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Virtual Farm</h1>
          <p className="text-muted-foreground">
            Manage your crops, plan your planting schedule, and harvest for maximum profit.
          </p>
        </div>

        {/* Farm Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Plots</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-active-plots">
                    {activeCrops}/9
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Harvest</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="text-ready-crops">
                    {readyCrops}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Farm Efficiency</p>
                  <p className="text-2xl font-bold text-foreground">92%</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Farm Layout</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 9 }, (_, i) => {
                const plot = farmPlots?.find(p => p.plotIndex === i);
                return (
                  <FarmPlot
                    key={i}
                    plot={plot}
                    plotIndex={i}
                    onClick={() => handlePlotClick(i)}
                    data-testid={`farm-plot-${i}`}
                  />
                );
              })}
            </div>

            <div className="flex space-x-3">
              <Button 
                className="flex-1" 
                disabled={readyCrops === 0 || harvestCropMutation.isPending}
                onClick={() => {
                  farmPlots
                    ?.filter(plot => plot.growthStage === "ready")
                    .forEach(plot => harvestCropMutation.mutate(plot.plotIndex));
                }}
                data-testid="button-harvest-all"
              >
                🌾 Harvest All Ready ({readyCrops})
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                disabled={activeCrops === 0 || waterCropsMutation.isPending}
                onClick={() => waterCropsMutation.mutate()}
                data-testid="button-water-crops"
              >
                💧 Water All Crops
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plant Crop Dialog */}
        <Dialog open={selectedPlot !== null} onOpenChange={() => setSelectedPlot(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Plant New Crop</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose a crop to plant in plot {selectedPlot !== null ? selectedPlot + 1 : 0}:
              </p>
              
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((crop) => (
                    <SelectItem key={crop.value} value={crop.value}>
                      {crop.label} ({crop.duration} days, ₹{crop.yield} yield)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1" 
                  onClick={handlePlantCrop}
                  disabled={!selectedCrop || plantCropMutation.isPending}
                  data-testid="button-plant-crop"
                >
                  Plant Crop
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPlot(null)}
                  data-testid="button-cancel-plant"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
