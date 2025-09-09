import { Badge } from "@/components/ui/badge";
import type { Achievement } from "@shared/schema";

interface AchievementBadgeProps {
  achievement: Achievement;
  earnedAt?: Date | string | null;
}

const iconMap = {
  star: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>
  ),
};

const colorMap = {
  primary: "bg-primary/10 border-primary/20",
  secondary: "bg-secondary/10 border-secondary/20", 
  accent: "bg-accent/10 border-accent/20",
  green: "bg-green-100 border-green-200",
  blue: "bg-blue-100 border-blue-200",
  purple: "bg-purple-100 border-purple-200",
};

export default function AchievementBadge({ achievement, earnedAt }: AchievementBadgeProps) {
  const icon = iconMap[achievement.iconType as keyof typeof iconMap] || iconMap.star;
  const colorClass = colorMap[achievement.color as keyof typeof colorMap] || colorMap.primary;

  return (
    <div className={`flex items-center space-x-3 p-3 ${colorClass} rounded-lg border`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-${achievement.color === 'accent' ? 'accent' : 'primary'}`}>
        {icon}
      </div>
      <div>
        <p className="font-medium text-foreground">{achievement.title}</p>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        {earnedAt && (
          <p className="text-xs text-muted-foreground">
            Earned {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
      {achievement.creditsReward > 0 && (
        <Badge variant="secondary" className="ml-auto">
          +{achievement.creditsReward}
        </Badge>
      )}
    </div>
  );
}
