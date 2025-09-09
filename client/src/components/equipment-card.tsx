import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Equipment } from "@shared/schema";

interface EquipmentCardProps {
  equipment: Equipment;
  userCredits: number;
  onPurchase: () => void;
  isPurchasing: boolean;
}

const categoryIcons = {
  irrigation: (
    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd"/>
    </svg>
  ),
  lighting: (
    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd"/>
    </svg>
  ),
  tools: (
    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
    </svg>
  ),
  sensors: (
    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8 3a1 1 0 00-.707 1.707L8 5.414v3.758a1 1 0 01-.293.707l-4 4C1.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V5.414l.707-.707A1 1 0 0013 3H8zm2 6.172V4h2v5.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 9.172z" clipRule="evenodd"/>
    </svg>
  ),
  seeds: (
    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
    </svg>
  ),
};

const categoryColors = {
  irrigation: "from-blue-400 to-cyan-600",
  lighting: "from-yellow-400 to-orange-500",
  tools: "from-purple-400 to-indigo-600",
  sensors: "from-green-400 to-emerald-600",
  seeds: "from-pink-400 to-rose-600",
};

export default function EquipmentCard({ equipment, userCredits, onPurchase, isPurchasing }: EquipmentCardProps) {
  const canAfford = userCredits >= equipment.creditsRequired;
  const colorClass = categoryColors[equipment.category as keyof typeof categoryColors] || categoryColors.tools;
  const icon = categoryIcons[equipment.category as keyof typeof categoryIcons] || categoryIcons.tools;

  return (
    <Card className="overflow-hidden card-hover" data-testid={`equipment-card-${equipment.id}`}>
      <div className={`h-48 bg-gradient-to-br ${colorClass} relative overflow-hidden flex items-center justify-center`}>
        {icon}
        {equipment.discountPercentage > 0 && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 text-white">
              {equipment.discountPercentage}% OFF
            </Badge>
          </div>
        )}
        {!equipment.inStock && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gray-500 text-white">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">{equipment.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{equipment.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-foreground">
              ₹{Number(equipment.price).toLocaleString()}
            </span>
            {equipment.originalPrice && Number(equipment.originalPrice) > Number(equipment.price) && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ₹{Number(equipment.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Credits Required</p>
            <p className="font-semibold text-accent" data-testid={`credits-required-${equipment.id}`}>
              {equipment.creditsRequired.toLocaleString()} Credits
            </p>
          </div>
        </div>
        
        {!canAfford && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700">
              Insufficient credits. Need {(equipment.creditsRequired - userCredits).toLocaleString()} more credits.
            </p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1" 
            disabled={!canAfford || !equipment.inStock || isPurchasing}
            onClick={onPurchase}
            data-testid={`button-purchase-${equipment.id}`}
          >
            {!equipment.inStock ? "Out of Stock" : 
             !canAfford ? "Insufficient Credits" : 
             isPurchasing ? "Processing..." : "Redeem Now"}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            data-testid={`button-wishlist-${equipment.id}`}
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
