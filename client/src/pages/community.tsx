import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { CommunityPost, User } from "@shared/schema";

interface CommunityPostWithUser extends CommunityPost {
  user: User;
}

interface TopContributor {
  user: User;
  weeklyCredits: number;
}

export default function Community() {
  const { data: posts, isLoading } = useQuery<CommunityPostWithUser[]>({
    queryKey: ["/api/community/posts"],
  });

  const { data: topContributors } = useQuery<TopContributor[]>({
    queryKey: ["/api/community/top-contributors"],
  });

  const { data: communityStats } = useQuery<{
    activeFarmers: number;
    successStories: number;
    creditsEarnedToday: number;
    equipmentRedeemed: number;
  }>({
    queryKey: ["/api/community/stats"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading community...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Community & Success Stories</h1>
        <p className="text-muted-foreground max-w-2xl">
          Connect with fellow farmers, share experiences, and learn from real success stories in sustainable farming.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Stats */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Farmers</span>
                  <span className="font-semibold text-foreground" data-testid="text-active-farmers">
                    {communityStats?.activeFarmers?.toLocaleString() || "12,540"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Success Stories</span>
                  <span className="font-semibold text-foreground" data-testid="text-success-stories">
                    {communityStats?.successStories?.toLocaleString() || "2,890"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Credits Earned Today</span>
                  <span className="font-semibold text-primary" data-testid="text-credits-today">
                    {communityStats?.creditsEarnedToday?.toLocaleString() || "45,670"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Equipment Redeemed</span>
                  <span className="font-semibold text-accent" data-testid="text-equipment-redeemed">
                    {communityStats?.equipmentRedeemed?.toLocaleString() || "1,250"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Contributors */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Contributors This Week</h3>
              <div className="space-y-3">
                {topContributors && topContributors.length > 0 ? (
                  topContributors.slice(0, 3).map((contributor, index) => (
                    <div key={contributor.user.id} className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={index === 0 ? "bg-primary text-primary-foreground" : index === 1 ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}>
                          {contributor.user.firstName[0]}{contributor.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {contributor.user.firstName} {contributor.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contributor.weeklyCredits.toLocaleString()} credits earned
                        </p>
                      </div>
                      <svg className={`w-4 h-4 ${index === 0 ? "text-accent" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                  ))
                ) : (
                  // Fallback display
                  <>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">MP</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Mohan Patel</p>
                        <p className="text-xs text-muted-foreground">1,250 credits earned</p>
                      </div>
                      <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">AS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Anjali Singh</p>
                        <p className="text-xs text-muted-foreground">1,180 credits earned</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent text-accent-foreground">VK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Vikram Kumar</p>
                        <p className="text-xs text-muted-foreground">950 credits earned</p>
                      </div>
                      <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Success Stories */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarFallback>
                          {post.user.firstName[0]}{post.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {post.user.firstName} {post.user.lastName}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{post.title}</p>
                        <div className="bg-primary/5 rounded-lg p-4 mb-4">
                          <p className="text-sm text-foreground">{post.content}</p>
                        </div>
                        
                        {post.metrics && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-red-100 rounded-lg p-3 text-center">
                              <p className="text-xs text-red-700 font-medium">Before: Traditional</p>
                              <p className="text-sm text-red-600">
                                ₹{(post.metrics as any).income_before?.toLocaleString() || "8,000"}/month
                              </p>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3 text-center">
                              <p className="text-xs text-green-700 font-medium">After: Sustainable</p>
                              <p className="text-sm text-green-600">
                                ₹{(post.metrics as any).income_after?.toLocaleString() || "35,000"}/month
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <button className="flex items-center space-x-1 hover:text-primary transition-colors" data-testid={`button-like-${post.id}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                            <span>{post.likesCount}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-primary transition-colors" data-testid={`button-comment-${post.id}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                            <span>{post.commentsCount}</span>
                          </button>
                          <button className="flex items-center hover:text-primary transition-colors" data-testid={`button-share-${post.id}`}>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                            </svg>
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback success stories
              <>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">RM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">Rajesh Mehta</h4>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Increased income by 300% with vertical farming</p>
                        <div className="bg-primary/5 rounded-lg p-4 mb-4">
                          <p className="text-sm text-foreground">
                            "After completing the vertical farming course on AgriVenture and redeeming credits for a hydroponic setup, my monthly income jumped from ₹15,000 to ₹45,000! The step-by-step learning modules made it so easy to understand."
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                            </svg>
                            45 likes
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                            </svg>
                            12 comments
                          </span>
                          <button className="flex items-center hover:text-primary transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                            </svg>
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">PS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">Priya Sharma</h4>
                          <span className="text-xs text-muted-foreground">4 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Reduced water usage by 80% while doubling crop yield</p>
                        <div className="bg-secondary/5 rounded-lg p-4 mb-4">
                          <p className="text-sm text-foreground">
                            "The smart irrigation course taught me how to optimize water usage. Using the drip irrigation system I got with my credits, I'm now using 80% less water and getting twice the yield! My water bills dropped from ₹8,000 to ₹1,500 per month."
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-red-100 rounded-lg p-3 text-center">
                            <p className="text-xs text-red-700 font-medium">Before: Traditional</p>
                            <p className="text-sm text-red-600">₹8,000/month water bill</p>
                          </div>
                          <div className="bg-green-100 rounded-lg p-3 text-center">
                            <p className="text-xs text-green-700 font-medium">After: Smart Irrigation</p>
                            <p className="text-sm text-green-600">₹1,500/month water bill</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                            </svg>
                            67 likes
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                            </svg>
                            18 comments
                          </span>
                          <button className="flex items-center hover:text-primary transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                            </svg>
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Discussion Forums Preview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Active Discussions</h3>
                  <Button variant="ghost" size="sm">View All Forums</Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 hover:bg-muted/20 rounded-lg transition-colors cursor-pointer">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Best LED lights for indoor lettuce farming?</p>
                      <p className="text-xs text-muted-foreground">45 replies • Last activity 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 hover:bg-muted/20 rounded-lg transition-colors cursor-pointer">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Organic pest control methods that actually work</p>
                      <p className="text-xs text-muted-foreground">23 replies • Last activity 5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 hover:bg-muted/20 rounded-lg transition-colors cursor-pointer">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">ROI calculation for vertical farming setup</p>
                      <p className="text-xs text-muted-foreground">31 replies • Last activity 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
