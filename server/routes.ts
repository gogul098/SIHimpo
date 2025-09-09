import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFarmPlotSchema, 
  insertUserProgressSchema, 
  insertCommunityPostSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/current", async (req, res) => {
    try {
      const user = await storage.getCurrentUser();
      res.json(user);
    } catch (error) {
      res.status(404).json({ message: "User not found" });
    }
  });

  // Farm routes
  app.get("/api/farm/plots", async (req, res) => {
    try {
      const user = await storage.getCurrentUser();
      const plots = await storage.getFarmPlots(user.id);
      res.json(plots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farm plots" });
    }
  });

  app.post("/api/farm/plant", async (req, res) => {
    try {
      const { plotIndex, cropType } = req.body;
      
      if (typeof plotIndex !== "number" || typeof cropType !== "string") {
        return res.status(400).json({ message: "Invalid input data" });
      }

      const user = await storage.getCurrentUser();
      const existingPlot = await storage.getFarmPlot(user.id, plotIndex);
      
      if (existingPlot && existingPlot.cropType) {
        return res.status(400).json({ message: "Plot already has a crop" });
      }

      const cropDurations: Record<string, number> = {
        tomatoes: 14,
        spinach: 7,
        lettuce: 10,
        carrots: 21,
        peppers: 18,
      };

      const duration = cropDurations[cropType] || 14;
      const estimatedHarvestDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

      if (existingPlot) {
        await storage.updateFarmPlot(user.id, plotIndex, {
          cropType,
          plantedAt: new Date(),
          growthStage: "seedling",
          growthProgress: 10,
          estimatedHarvestDate,
          waterLevel: 100,
          healthStatus: "healthy",
        });
      } else {
        await storage.createFarmPlot({
          userId: user.id,
          plotIndex,
          cropType,
          plantedAt: new Date(),
          growthStage: "seedling",
          growthProgress: 10,
          estimatedHarvestDate,
          waterLevel: 100,
          healthStatus: "healthy",
        });
      }

      res.json({ message: "Crop planted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to plant crop" });
    }
  });

  app.post("/api/farm/harvest", async (req, res) => {
    try {
      const { plotIndex } = req.body;
      
      if (typeof plotIndex !== "number") {
        return res.status(400).json({ message: "Invalid plot index" });
      }

      const user = await storage.getCurrentUser();
      const plot = await storage.getFarmPlot(user.id, plotIndex);
      
      if (!plot || plot.growthStage !== "ready") {
        return res.status(400).json({ message: "Crop not ready for harvest" });
      }

      // Calculate credits earned based on crop type
      const cropCredits: Record<string, number> = {
        tomatoes: 50,
        spinach: 30,
        lettuce: 25,
        carrots: 40,
        peppers: 60,
      };

      const creditsEarned = cropCredits[plot.cropType || ""] || 25;

      // Reset plot
      await storage.updateFarmPlot(user.id, plotIndex, {
        cropType: null,
        plantedAt: null,
        growthStage: "empty",
        growthProgress: 0,
        estimatedHarvestDate: null,
        waterLevel: 100,
        healthStatus: "healthy",
      });

      // Award credits
      await storage.updateUser(user.id, {
        sustainaCredits: user.sustainaCredits + creditsEarned,
      });

      res.json({ message: "Crop harvested successfully", creditsEarned });
    } catch (error) {
      res.status(500).json({ message: "Failed to harvest crop" });
    }
  });

  app.post("/api/farm/water", async (req, res) => {
    try {
      const user = await storage.getCurrentUser();
      const plots = await storage.getFarmPlots(user.id);
      
      // Water all active plots
      for (const plot of plots) {
        if (plot.cropType) {
          await storage.updateFarmPlot(user.id, plot.plotIndex, {
            waterLevel: Math.min(100, plot.waterLevel + 20),
          });
        }
      }

      res.json({ message: "All crops watered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to water crops" });
    }
  });

  // Learning routes
  app.get("/api/learning/modules", async (req, res) => {
    try {
      const modules = await storage.getLearningModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning modules" });
    }
  });

  app.get("/api/learning/progress", async (req, res) => {
    try {
      const user = await storage.getCurrentUser();
      const progress = await storage.getUserProgress(user.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch learning progress" });
    }
  });

  app.get("/api/learning/user-progress", async (req, res) => {
    try {
      const user = await storage.getCurrentUser();
      const progress = await storage.getUserProgress(user.id);
      res.json(progress.map(p => ({ ...p, module: undefined }))); // Remove module from response
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.post("/api/learning/start", async (req, res) => {
    try {
      const { moduleId } = req.body;
      
      if (typeof moduleId !== "string") {
        return res.status(400).json({ message: "Invalid module ID" });
      }

      const user = await storage.getCurrentUser();
      const module = await storage.getLearningModule(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }

      const existingProgress = await storage.getUserProgressByModule(user.id, moduleId);
      if (existingProgress) {
        return res.status(400).json({ message: "Module already started" });
      }

      await storage.createUserProgress({
        userId: user.id,
        moduleId,
        currentLesson: 1,
        completedLessons: 0,
        progress: 0,
        completed: false,
        creditsEarned: 0,
      });

      res.json({ message: "Module started successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to start module" });
    }
  });

  app.post("/api/learning/continue", async (req, res) => {
    try {
      const { moduleId } = req.body;
      
      if (typeof moduleId !== "string") {
        return res.status(400).json({ message: "Invalid module ID" });
      }

      const user = await storage.getCurrentUser();
      const module = await storage.getLearningModule(moduleId);
      const progress = await storage.getUserProgressByModule(user.id, moduleId);
      
      if (!module || !progress) {
        return res.status(404).json({ message: "Module or progress not found" });
      }

      if (progress.completed) {
        return res.status(400).json({ message: "Module already completed" });
      }

      const newCompletedLessons = Math.min(progress.completedLessons + 1, module.lessonsCount);
      const newProgress = Math.round((newCompletedLessons / module.lessonsCount) * 100);
      const isCompleted = newCompletedLessons === module.lessonsCount;
      
      const creditsPerLesson = Math.floor(module.creditsReward / module.lessonsCount);
      const newCreditsEarned = progress.creditsEarned + creditsPerLesson;

      await storage.updateUserProgress(user.id, moduleId, {
        currentLesson: newCompletedLessons + 1,
        completedLessons: newCompletedLessons,
        progress: newProgress,
        completed: isCompleted,
        creditsEarned: newCreditsEarned,
      });

      // Award credits to user
      await storage.updateUser(user.id, {
        sustainaCredits: user.sustainaCredits + creditsPerLesson,
        learningStreak: user.learningStreak + 1,
      });

      res.json({ 
        message: "Lesson completed successfully", 
        creditsEarned: creditsPerLesson,
        moduleCompleted: isCompleted,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to continue module" });
    }
  });

  // Marketplace routes
  app.get("/api/marketplace/equipment", async (req, res) => {
    try {
      const equipment = await storage.getEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.post("/api/marketplace/purchase", async (req, res) => {
    try {
      const { equipmentId } = req.body;
      
      if (typeof equipmentId !== "string") {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }

      const user = await storage.getCurrentUser();
      await storage.purchaseEquipment(user.id, equipmentId);

      res.json({ message: "Equipment purchased successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to purchase equipment" });
    }
  });

  // Achievement routes
  app.get("/api/achievements/recent", async (req, res) => {
    try {
      const user = await storage.getCurrentUser();
      const achievements = await storage.getUserAchievements(user.id);
      res.json(achievements.slice(-3)); // Return last 3 achievements
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Community routes
  app.get("/api/community/posts", async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.get("/api/community/top-contributors", async (req, res) => {
    try {
      const contributors = await storage.getTopContributors();
      res.json(contributors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top contributors" });
    }
  });

  app.get("/api/community/stats", async (req, res) => {
    try {
      const stats = await storage.getCommunityStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community stats" });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const result = insertCommunityPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid post data" });
      }

      const user = await storage.getCurrentUser();
      const post = await storage.createCommunityPost({
        ...result.data,
        userId: user.id,
      });

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Weather routes
  app.get("/api/weather/current", async (req, res) => {
    try {
      const weather = await storage.getCurrentWeather();
      if (!weather) {
        return res.status(404).json({ message: "Weather data not available" });
      }
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
