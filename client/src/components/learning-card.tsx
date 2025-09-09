import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { UserProgress, LearningModule } from "@shared/schema";

interface LearningCardProps {
  progress: UserProgress & { module: LearningModule };
}

export default function LearningCard({ progress }: LearningCardProps) {
  const { module } = progress;
  
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardContent className="p-4">
        <h4 className="font-medium text-foreground mb-2">{module.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
        
        <div className="flex items-center mb-3">
          <Progress value={progress.progress} className="flex-1 mr-3" />
          <span className="text-sm font-medium text-foreground">{progress.progress}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Lesson {progress.currentLesson}/{module.lessonsCount}
          </span>
          <Button size="sm" data-testid="button-continue-learning">
            Continue
          </Button>
        </div>
        
        <div className="mt-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Credits earned:</span>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-accent mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
              </svg>
              <span className="font-semibold text-accent">+{progress.creditsEarned}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
