import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { LearningModule, UserProgress } from "@shared/schema";

export default function Learning() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modules, isLoading } = useQuery<LearningModule[]>({
    queryKey: ["/api/learning/modules"],
  });

  const { data: userProgress } = useQuery<UserProgress[]>({
    queryKey: ["/api/learning/user-progress"],
  });

  const startModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      return apiRequest("POST", "/api/learning/start", { moduleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning/user-progress"] });
      toast({
        title: "Module Started!",
        description: "You've started a new learning module.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start module",
        variant: "destructive",
      });
    },
  });

  const continueModuleMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      return apiRequest("POST", "/api/learning/continue", { moduleId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning/user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/current"] });
      toast({
        title: "Progress Updated!",
        description: "You've earned credits for completing a lesson!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to continue module",
        variant: "destructive",
      });
    },
  });

  const getModuleProgress = (moduleId: string) => {
    return userProgress?.find(p => p.moduleId === moduleId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      soil: "from-amber-400 to-orange-600",
      crops: "from-green-400 to-green-600",
      vertical: "from-blue-400 to-indigo-600",
      market: "from-purple-400 to-pink-600",
      equipment: "from-teal-400 to-cyan-600",
      sustainable: "from-emerald-400 to-green-700",
    };
    return colors[category as keyof typeof colors] || "from-gray-400 to-gray-600";
  };

  if (isLoading) {
    return (
      <div className="farming-pattern min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading learning modules...</div>
        </div>
      </div>
    );
  }

  const completedCount = userProgress?.filter(p => p.completed).length || 0;
  const totalProgress = userProgress?.reduce((acc, p) => acc + p.progress, 0) / (userProgress?.length || 1) || 0;

  return (
    <div className="farming-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">AgriVenture Learning Academy</h1>
          <p className="text-muted-foreground max-w-2xl">
            Master sustainable farming techniques through interactive courses, earn Sustaina-Credits, and unlock advanced farming methods.
          </p>
        </div>

        {/* Learning Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Your Learning Journey</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-primary">Beginner</span>
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              
              <div className="flex-1 h-0.5 bg-primary mx-4"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-2">
                  <div className="w-3 h-3 bg-accent-foreground rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-accent">Intermediate</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(totalProgress)}% Complete
                </span>
              </div>
              
              <div className="flex-1 h-0.5 bg-border mx-4"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted-foreground">Advanced</span>
                <span className="text-xs text-muted-foreground">Locked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules?.map((module) => {
            const progress = getModuleProgress(module.id);
            const isCompleted = progress?.completed || false;
            const progressPercent = progress?.progress || 0;
            
            return (
              <Card key={module.id} className="overflow-hidden card-hover">
                <div className={`h-48 bg-gradient-to-br ${getCategoryColor(module.category)} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 farming-pattern"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
                    <p className="text-white/90 text-sm">{module.description}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur rounded-full px-2 py-1">
                      <span className="text-xs text-white font-medium">
                        {module.lessonsCount} Lessons
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-accent mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                      </svg>
                      <span className="text-sm font-medium text-foreground">
                        {module.creditsReward} Credits
                      </span>
                    </div>
                  </div>
                  
                  {isCompleted ? (
                    <div className="flex items-center justify-center py-2">
                      <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-primary font-medium">Completed</span>
                    </div>
                  ) : progress ? (
                    <>
                      <div className="flex items-center mb-4">
                        <Progress value={progressPercent} className="flex-1 mr-3" />
                        <span className="text-sm font-medium text-foreground">
                          {progress.completedLessons}/{module.lessonsCount}
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => continueModuleMutation.mutate(module.id)}
                        disabled={continueModuleMutation.isPending}
                        data-testid={`button-continue-${module.id}`}
                      >
                        Continue Learning
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => startModuleMutation.mutate(module.id)}
                      disabled={startModuleMutation.isPending}
                      data-testid={`button-start-${module.id}`}
                    >
                      Start Learning
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
