import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EquipmentCard from "@/components/equipment-card";
import type { Equipment, User } from "@shared/schema";

export default function Marketplace() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/marketplace/equipment"],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (equipmentId: string) => {
      return apiRequest("POST", "/api/marketplace/purchase", { equipmentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/equipment"] });
      toast({
        title: "Purchase Successful!",
        description: "Equipment has been purchased with your Sustaina-Credits.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Unable to complete purchase",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-muted/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading marketplace...</div>
        </div>
      </div>
    );
  }

  const userCredits = user?.sustainaCredits || 0;
  const equivalentValue = Math.round(userCredits * 5); // 1 credit = ₹5

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Equipment Marketplace</h1>
          <p className="text-muted-foreground max-w-2xl">
            Redeem your hard-earned Sustaina-Credits for premium farming equipment and get exclusive discounts on sustainable farming tools.
          </p>
        </div>
        
        {/* Credit Balance Banner */}
        <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Your Sustaina-Credits Balance</h3>
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-accent mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                  </svg>
                  <span className="text-3xl font-bold text-foreground" data-testid="text-credit-balance">
                    {userCredits.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground ml-2">Credits Available</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Equivalent Value</p>
                <p className="text-lg font-semibold text-primary">
                  ₹{equivalentValue.toLocaleString()} in Discounts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Equipment Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {equipment?.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              userCredits={userCredits}
              onPurchase={() => purchaseMutation.mutate(item.id)}
              isPurchasing={purchaseMutation.isPending}
            />
          ))}
        </div>
        
        {/* Redemption Guide */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">How to Redeem Your Sustaina-Credits</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Learn & Complete</h4>
                <p className="text-sm text-muted-foreground">Complete learning modules and farm activities to earn credits</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Accumulate Credits</h4>
                <p className="text-sm text-muted-foreground">Watch your credit balance grow with each completed task</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Choose Equipment</h4>
                <p className="text-sm text-muted-foreground">Browse and select the farming equipment you need</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Redeem & Save</h4>
                <p className="text-sm text-muted-foreground">Use credits for discounts and enhance your sustainable farming journey</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
