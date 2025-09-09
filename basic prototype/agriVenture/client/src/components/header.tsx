import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const navigationItems = [
    { path: "/", label: "Dashboard", href: "#dashboard" },
    { path: "/farm", label: "My Farm", href: "#farm" },
    { path: "/learning", label: "Learning", href: "#learn" },
    { path: "/marketplace", label: "Marketplace", href: "#marketplace" },
    { path: "/community", label: "Community", href: "#community" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-bold text-foreground">AgriVenture</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8 ml-8">
              {navigationItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a className={`transition-colors pb-4 ${
                    location === item.path 
                      ? "text-primary font-medium border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}>
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
              </svg>
              <span className="text-sm font-medium" data-testid="text-user-credits">
                {user?.sustainaCredits?.toLocaleString() || "0"}
              </span>
              <span className="text-xs text-muted-foreground">Credits</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName[0]}${user.lastName[0]}` 
                    : "U"
                  }
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block" data-testid="text-user-name">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </span>
              <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
