import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FarmPlot from "@/components/farm-plot";
import LearningCard from "@/components/learning-card";
import AchievementBadge from "@/components/achievement-badge";
import { Link } from "wouter";
import type { User, FarmPlot as FarmPlotType, UserProgress, LearningModule, UserAchievement, Achievement, WeatherData } from "@shared/schema";

export default function Dashboard() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: farmPlots } = useQuery<FarmPlotType[]>({
    queryKey: ["/api/farm/plots"],
  });

  const { data: learningProgress } = useQuery<(UserProgress & { module: LearningModule })[]>({
    queryKey: ["/api/learning/progress"],
  });

  const { data: recentAchievements } = useQuery<(UserAchievement & { achievement: Achievement })[]>({
    queryKey: ["/api/achievements/recent"],
  });

  const { data: weather } = useQuery<WeatherData>({
    queryKey: ["/api/weather/current"],
  });

  const activeCrops = farmPlots?.filter(plot => plot.cropType !== null)?.length || 0;
  const readyCrops = farmPlots?.filter(plot => plot.growthStage === "ready")?.length || 0;
  const avgLearningProgress = learningProgress?.reduce((acc, progress) => acc + progress.progress, 0) / (learningProgress?.length || 1) || 0;

  return (
    <div className="farming-pattern min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName || "Farmer"}! 🌱
          </h2>
          <p className="text-muted-foreground">
            Continue your sustainable farming journey and earn more Sustaina-Credits.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover" data-testid="card-total-credits">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">+120 today</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-total-credits">
                {user?.sustainaCredits?.toLocaleString() || "0"}
              </h3>
              <p className="text-sm text-muted-foreground">Sustaina-Credits</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover" data-testid="card-learning-progress">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">
                  {learningProgress?.filter(p => p.completed).length || 0} completed
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-learning-progress">
                {Math.round(avgLearningProgress)}%
              </h3>
              <p className="text-sm text-muted-foreground">Course Completion</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover" data-testid="card-farm-level">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">Level up soon!</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-farm-level">
                {user?.farmLevel || 1}
              </h3>
              <p className="text-sm text-muted-foreground">Farm Level</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover" data-testid="card-active-crops">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className={`text-sm ${readyCrops > 0 ? "text-accent pulse-glow" : "text-muted-foreground"}`}>
                  {readyCrops > 0 ? `${readyCrops} ready!` : "Growing..."}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-active-crops">
                {activeCrops}
              </h3>
              <p className="text-sm text-muted-foreground">Active Crops</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Suggestions */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-foreground flex items-center">
                <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Today's Smart Suggestions
              </h3>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"/>
                    </svg>
                    <span className="font-medium text-foreground">Weather Update</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {weather ? 
                      `${weather.condition}, ${weather.temperature}°C. Humidity: ${weather.humidity}%` :
                      "Moderate rain expected tomorrow. Perfect for your tomato seedlings!"
                    }
                  </p>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium text-foreground">Market Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Spinach prices up 15%! Consider harvesting early.
                  </p>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Markets
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium text-foreground">Learning Streak</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    You're on a {user?.learningStreak || 0}-day streak! Complete today's lesson to earn bonus credits.
                  </p>
                  <Link href="/learning">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Continue Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Virtual Farm Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    My Virtual Farm
                  </CardTitle>
                  <Link href="/farm">
                    <Button data-testid="button-manage-farm">
                      Manage Farm
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {Array.from({ length: 9 }, (_, i) => {
                    const plot = farmPlots?.find(p => p.plotIndex === i);
                    return (
                      <FarmPlot
                        key={i}
                        plot={plot}
                        plotIndex={i}
                        data-testid={`farm-plot-${i}`}
                      />
                    );
                  })}
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    disabled={readyCrops === 0}
                    data-testid="button-harvest-ready"
                  >
                    🌾 Harvest Ready Crops
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    data-testid="button-water-crops"
                  >
                    💧 Water All Crops
                  </Button>
                  <Button 
                    variant="outline"
                    data-testid="button-expand-farm"
                  >
                    ➕ Expand
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Learning Progress Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  Current Learning
                </h3>
                
                {learningProgress && learningProgress.length > 0 ? (
                  <LearningCard progress={learningProgress[0]} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No active learning modules</p>
                    <Link href="/learning">
                      <Button>Start Learning</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <svg className="w-5 h-5 text-accent mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Recent Achievements
                </h3>
                
                <div className="space-y-3">
                  {recentAchievements && recentAchievements.length > 0 ? (
                    recentAchievements.slice(0, 3).map((userAchievement) => (
                      <AchievementBadge 
                        key={userAchievement.id} 
                        achievement={userAchievement.achievement}
                        earnedAt={userAchievement.earnedAt}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No achievements yet. Start farming and learning to earn your first badge!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
