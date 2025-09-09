import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { FarmPlot } from "@shared/schema";

interface FarmPlotProps {
  plot?: FarmPlot;
  plotIndex: number;
  onClick?: () => void;
}

const cropConfigs = {
  tomatoes: { color: "from-red-100 to-red-200", borderColor: "border-red-300", badgeColor: "bg-red-500" },
  spinach: { color: "from-emerald-200 to-emerald-300", borderColor: "border-emerald-400", badgeColor: "bg-emerald-500" },
  lettuce: { color: "from-lime-200 to-lime-300", borderColor: "border-lime-400", badgeColor: "bg-lime-500" },
  carrots: { color: "from-orange-50 to-orange-100", borderColor: "border-orange-200", badgeColor: "bg-orange-400" },
  peppers: { color: "from-red-100 to-red-200", borderColor: "border-red-300", badgeColor: "bg-red-500" },
};

const stageConfigs = {
  empty: { label: "Empty", color: "bg-gray-400" },
  seedling: { label: "Seedling", color: "bg-blue-500" },
  growing: { label: "Growing", color: "bg-green-500" },
  ready: { label: "Ready", color: "bg-amber-500" },
};

export default function FarmPlot({ plot, plotIndex, onClick }: FarmPlotProps) {
  if (!plot || !plot.cropType) {
    // Empty plot
    return (
      <Card 
        className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden cursor-pointer group hover:scale-105 hover:border-primary transition-all"
        onClick={onClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            <p className="text-xs text-gray-500 group-hover:text-primary transition-colors">Plant Crop</p>
          </div>
        </div>
      </Card>
    );
  }

  const cropConfig = cropConfigs[plot.cropType as keyof typeof cropConfigs] || cropConfigs.tomatoes;
  const stageConfig = stageConfigs[plot.growthStage as keyof typeof stageConfigs] || stageConfigs.growing;
  const isReady = plot.growthStage === "ready";

  return (
    <Card 
      className={`aspect-square bg-gradient-to-br ${cropConfig.color} border-2 ${cropConfig.borderColor} rounded-lg relative overflow-hidden cursor-pointer group hover:scale-105 transition-transform ${isReady ? 'pulse-glow' : ''}`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 ${cropConfig.badgeColor}/20`}></div>
      
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-white/90 rounded p-1">
          <p className="text-xs font-medium capitalize">
            {plot.cropType}
          </p>
          <Progress 
            value={plot.growthProgress || 0} 
            className="h-1 mt-1"
          />
          <p className="text-xs mt-1">
            {isReady ? (
              <span className="font-bold text-amber-600">Ready to harvest!</span>
            ) : (
              `${Math.max(1, Math.ceil(((100 - (plot.growthProgress || 0)) / 100) * 14))} days left`
            )}
          </p>
        </div>
      </div>
      
      <div className="absolute top-2 right-2">
        <Badge className={`${stageConfig.color} text-white text-xs`}>
          {stageConfig.label}
        </Badge>
      </div>
    </Card>
  );
}
