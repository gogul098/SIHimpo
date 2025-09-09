import { 
  type User, 
  type InsertUser, 
  type FarmPlot, 
  type InsertFarmPlot,
  type LearningModule,
  type InsertLearningModule,
  type UserProgress,
  type InsertUserProgress,
  type Equipment,
  type InsertEquipment,
  type Achievement,
  type UserAchievement,
  type CommunityPost,
  type InsertCommunityPost,
  type WeatherData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getCurrentUser(): Promise<User>;

  // Farm plot methods
  getFarmPlots(userId: string): Promise<FarmPlot[]>;
  getFarmPlot(userId: string, plotIndex: number): Promise<FarmPlot | undefined>;
  updateFarmPlot(userId: string, plotIndex: number, updates: Partial<FarmPlot>): Promise<FarmPlot>;
  createFarmPlot(farmPlot: InsertFarmPlot): Promise<FarmPlot>;

  // Learning methods
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: string): Promise<LearningModule | undefined>;
  getUserProgress(userId: string): Promise<(UserProgress & { module: LearningModule })[]>;
  getUserProgressByModule(userId: string, moduleId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: string, moduleId: string, updates: Partial<UserProgress>): Promise<UserProgress>;

  // Equipment methods
  getEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: string): Promise<Equipment | undefined>;
  purchaseEquipment(userId: string, equipmentId: string): Promise<void>;

  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  awardAchievement(userId: string, achievementId: string): Promise<void>;

  // Community methods
  getCommunityPosts(): Promise<(CommunityPost & { user: User })[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getTopContributors(): Promise<{ user: User; weeklyCredits: number }[]>;
  getCommunityStats(): Promise<{
    activeFarmers: number;
    successStories: number;
    creditsEarnedToday: number;
    equipmentRedeemed: number;
  }>;

  // Weather methods
  getCurrentWeather(): Promise<WeatherData | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private farmPlots: Map<string, FarmPlot[]>; // userId -> plots
  private learningModules: Map<string, LearningModule>;
  private userProgress: Map<string, UserProgress[]>; // userId -> progress
  private equipment: Map<string, Equipment>;
  private achievements: Map<string, Achievement>;
  private userAchievements: Map<string, UserAchievement[]>; // userId -> achievements
  private communityPosts: Map<string, CommunityPost>;
  private weatherData: WeatherData | undefined;
  private currentUserId: string;

  constructor() {
    this.users = new Map();
    this.farmPlots = new Map();
    this.learningModules = new Map();
    this.userProgress = new Map();
    this.equipment = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.communityPosts = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: "default-user",
      username: "farmer123",
      email: "farmer@example.com",
      firstName: "Ravi",
      lastName: "Patel",
      sustainaCredits: 2450,
      farmLevel: 5,
      learningStreak: 7,
      location: "Haryana, India",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
    this.currentUserId = defaultUser.id;

    // Initialize farm plots
    const plots: FarmPlot[] = [
      {
        id: "plot-0",
        userId: defaultUser.id,
        plotIndex: 0,
        cropType: "tomatoes",
        plantedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        growthStage: "growing",
        growthProgress: 75,
        estimatedHarvestDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        waterLevel: 85,
        healthStatus: "healthy",
      },
      {
        id: "plot-1",
        userId: defaultUser.id,
        plotIndex: 1,
        cropType: "spinach",
        plantedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        growthStage: "ready",
        growthProgress: 100,
        estimatedHarvestDate: new Date(),
        waterLevel: 90,
        healthStatus: "healthy",
      },
      {
        id: "plot-2",
        userId: defaultUser.id,
        plotIndex: 2,
        cropType: "lettuce",
        plantedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        growthStage: "ready",
        growthProgress: 100,
        estimatedHarvestDate: new Date(),
        waterLevel: 88,
        healthStatus: "healthy",
      },
      {
        id: "plot-3",
        userId: defaultUser.id,
        plotIndex: 3,
        cropType: "carrots",
        plantedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        growthStage: "seedling",
        growthProgress: 25,
        estimatedHarvestDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        waterLevel: 95,
        healthStatus: "healthy",
      },
      {
        id: "plot-4",
        userId: defaultUser.id,
        plotIndex: 4,
        cropType: "peppers",
        plantedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        growthStage: "growing",
        growthProgress: 60,
        estimatedHarvestDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        waterLevel: 80,
        healthStatus: "healthy",
      },
    ];
    
    // Add empty plots for indices 5-8
    for (let i = 5; i <= 8; i++) {
      plots.push({
        id: `plot-${i}`,
        userId: defaultUser.id,
        plotIndex: i,
        cropType: null,
        plantedAt: null,
        growthStage: "empty",
        growthProgress: 0,
        estimatedHarvestDate: null,
        waterLevel: 100,
        healthStatus: "healthy",
      });
    }
    
    this.farmPlots.set(defaultUser.id, plots);

    // Initialize learning modules
    const modules: LearningModule[] = [
      {
        id: "module-1",
        title: "Smart Crop Selection",
        description: "Choose the right crops for maximum profitability",
        category: "crops",
        difficulty: "intermediate",
        lessonsCount: 8,
        creditsReward: 150,
        prerequisiteModules: [],
        estimatedDuration: 240,
        thumbnailColor: "from-green-400 to-green-600",
      },
      {
        id: "module-2",
        title: "Soil Health & Management",
        description: "Optimize soil for sustainable farming",
        category: "soil",
        difficulty: "beginner",
        lessonsCount: 6,
        creditsReward: 200,
        prerequisiteModules: [],
        estimatedDuration: 180,
        thumbnailColor: "from-amber-400 to-orange-600",
      },
      {
        id: "module-3",
        title: "Vertical Farming Systems",
        description: "Master space-efficient farming techniques",
        category: "vertical",
        difficulty: "intermediate",
        lessonsCount: 12,
        creditsReward: 300,
        prerequisiteModules: ["module-2"],
        estimatedDuration: 360,
        thumbnailColor: "from-blue-400 to-indigo-600",
      },
      {
        id: "module-4",
        title: "Agricultural Market Analysis",
        description: "Understand pricing and demand trends",
        category: "market",
        difficulty: "advanced",
        lessonsCount: 10,
        creditsReward: 250,
        prerequisiteModules: ["module-3"],
        estimatedDuration: 300,
        thumbnailColor: "from-purple-400 to-pink-600",
      },
      {
        id: "module-5",
        title: "Modern Farm Equipment",
        description: "Master agricultural technology and tools",
        category: "equipment",
        difficulty: "beginner",
        lessonsCount: 9,
        creditsReward: 180,
        prerequisiteModules: [],
        estimatedDuration: 270,
        thumbnailColor: "from-teal-400 to-cyan-600",
      },
      {
        id: "module-6",
        title: "Sustainable Farming Practices",
        description: "Eco-friendly and profitable farming methods",
        category: "sustainable",
        difficulty: "intermediate",
        lessonsCount: 11,
        creditsReward: 320,
        prerequisiteModules: ["module-2"],
        estimatedDuration: 330,
        thumbnailColor: "from-emerald-400 to-green-700",
      },
    ];

    modules.forEach(module => this.learningModules.set(module.id, module));

    // Initialize user progress
    const progress: UserProgress[] = [
      {
        id: "progress-1",
        userId: defaultUser.id,
        moduleId: "module-1",
        currentLesson: 6,
        completedLessons: 6,
        progress: 75,
        completed: false,
        creditsEarned: 112,
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completedAt: null,
      },
      {
        id: "progress-2",
        userId: defaultUser.id,
        moduleId: "module-2",
        currentLesson: 6,
        completedLessons: 6,
        progress: 100,
        completed: true,
        creditsEarned: 200,
        startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "progress-3",
        userId: defaultUser.id,
        moduleId: "module-3",
        currentLesson: 5,
        completedLessons: 5,
        progress: 40,
        completed: false,
        creditsEarned: 120,
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedAt: null,
      },
    ];

    this.userProgress.set(defaultUser.id, progress);

    // Initialize equipment
    const equipmentItems: Equipment[] = [
      {
        id: "equipment-1",
        name: "Solar Water Pump System",
        description: "1HP solar-powered irrigation pump with smart controller and weather monitoring.",
        category: "irrigation",
        price: "45000.00",
        originalPrice: "60000.00",
        creditsRequired: 1500,
        discountPercentage: 25,
        inStock: true,
        thumbnailColor: "from-yellow-400 to-orange-500",
        specifications: {
          power: "1HP",
          efficiency: "85%",
          warranty: "5 years",
        },
      },
      {
        id: "equipment-2",
        name: "Complete Vertical Farm Setup",
        description: "6-tier hydroponic system with LED grow lights, nutrient solution, and automation.",
        category: "tools",
        price: "85000.00",
        originalPrice: null,
        creditsRequired: 2800,
        discountPercentage: 0,
        inStock: true,
        thumbnailColor: "from-green-400 to-emerald-600",
        specifications: {
          tiers: 6,
          capacity: "200 plants",
          lighting: "Full spectrum LED",
        },
      },
      {
        id: "equipment-3",
        name: "Smart Irrigation Controller",
        description: "IoT-enabled drip irrigation system with soil moisture sensors and mobile app control.",
        category: "irrigation",
        price: "25500.00",
        originalPrice: "30000.00",
        creditsRequired: 900,
        discountPercentage: 15,
        inStock: true,
        thumbnailColor: "from-blue-400 to-cyan-600",
        specifications: {
          sensors: "Soil moisture, pH",
          connectivity: "WiFi, Bluetooth",
          coverage: "Up to 1 acre",
        },
      },
      {
        id: "equipment-4",
        name: "Professional Soil Testing Kit",
        description: "Digital pH meter, NPK sensor, and moisture tester with mobile app connectivity.",
        category: "sensors",
        price: "8500.00",
        originalPrice: null,
        creditsRequired: 300,
        discountPercentage: 0,
        inStock: true,
        thumbnailColor: "from-purple-400 to-indigo-600",
        specifications: {
          tests: "pH, NPK, Moisture",
          accuracy: "±0.1 pH units",
          battery: "Rechargeable Li-ion",
        },
      },
      {
        id: "equipment-5",
        name: "Premium Seed Variety Pack",
        description: "High-yield, disease-resistant seeds for lettuce, spinach, tomato, and herbs.",
        category: "seeds",
        price: "1200.00",
        originalPrice: null,
        creditsRequired: 50,
        discountPercentage: 0,
        inStock: true,
        thumbnailColor: "from-pink-400 to-rose-600",
        specifications: {
          varieties: "4 types",
          germination: "95%+",
          organic: true,
        },
      },
      {
        id: "equipment-6",
        name: "Hydroponic Nutrient Solutions",
        description: "Complete nutrient mix for hydroponic systems - vegetative and flowering formulas.",
        category: "tools",
        price: "3500.00",
        originalPrice: null,
        creditsRequired: 120,
        discountPercentage: 0,
        inStock: true,
        thumbnailColor: "from-amber-400 to-yellow-600",
        specifications: {
          formulas: "Vegetative & Flowering",
          concentration: "Concentrated",
          yield: "500L solution",
        },
      },
    ];

    equipmentItems.forEach(item => this.equipment.set(item.id, item));

    // Initialize achievements
    const achievementsList: Achievement[] = [
      {
        id: "achievement-1",
        title: "Green Thumb",
        description: "Successfully harvested 10 crops",
        iconType: "star",
        creditsReward: 100,
        category: "farming",
        color: "primary",
      },
      {
        id: "achievement-2",
        title: "Knowledge Seeker",
        description: "Completed 5 learning modules",
        iconType: "check",
        creditsReward: 150,
        category: "learning",
        color: "secondary",
      },
      {
        id: "achievement-3",
        title: "Efficient Farmer",
        description: "Reduced water usage by 50%",
        iconType: "settings",
        creditsReward: 75,
        category: "efficiency",
        color: "accent",
      },
    ];

    achievementsList.forEach(achievement => this.achievements.set(achievement.id, achievement));

    // Initialize user achievements
    const userAchievementsList: UserAchievement[] = [
      {
        id: "user-achievement-1",
        userId: defaultUser.id,
        achievementId: "achievement-1",
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "user-achievement-2",
        userId: defaultUser.id,
        achievementId: "achievement-3",
        earnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    this.userAchievements.set(defaultUser.id, userAchievementsList);

    // Initialize sample community posts
    const posts: CommunityPost[] = [
      {
        id: "post-1",
        userId: defaultUser.id,
        title: "Increased income by 300% with vertical farming",
        content: "After completing the vertical farming course on AgriVenture and redeeming credits for a hydroponic setup, my monthly income jumped from ₹15,000 to ₹45,000! The step-by-step learning modules made it so easy to understand.",
        type: "success_story",
        metrics: { income_before: 15000, income_after: 45000 },
        likesCount: 45,
        commentsCount: 12,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "post-2",
        userId: defaultUser.id,
        title: "Reduced water usage by 80% while doubling crop yield",
        content: "The smart irrigation course taught me how to optimize water usage. Using the drip irrigation system I got with my credits, I'm now using 80% less water and getting twice the yield! My water bills dropped from ₹8,000 to ₹1,500 per month.",
        type: "success_story",
        metrics: { water_before: 8000, water_after: 1500, yield_increase: 200 },
        likesCount: 67,
        commentsCount: 18,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ];

    posts.forEach(post => this.communityPosts.set(post.id, post));

    // Initialize weather data
    this.weatherData = {
      id: "weather-1",
      location: "Haryana, India",
      temperature: 28,
      humidity: 72,
      windSpeed: 15,
      uvIndex: 6,
      condition: "Partly Cloudy",
      forecast: {
        tomorrow: { temperature: 26, condition: "Light Rain" },
        dayAfter: { temperature: 30, condition: "Sunny" },
      },
      updatedAt: new Date(),
    };
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      sustainaCredits: 0,
      farmLevel: 1,
      learningStreak: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getCurrentUser(): Promise<User> {
    const user = this.users.get(this.currentUserId);
    if (!user) throw new Error("Current user not found");
    return user;
  }

  // Farm plot methods
  async getFarmPlots(userId: string): Promise<FarmPlot[]> {
    return this.farmPlots.get(userId) || [];
  }

  async getFarmPlot(userId: string, plotIndex: number): Promise<FarmPlot | undefined> {
    const plots = this.farmPlots.get(userId) || [];
    return plots.find(plot => plot.plotIndex === plotIndex);
  }

  async updateFarmPlot(userId: string, plotIndex: number, updates: Partial<FarmPlot>): Promise<FarmPlot> {
    const plots = this.farmPlots.get(userId) || [];
    const plotIndex_ = plots.findIndex(plot => plot.plotIndex === plotIndex);
    
    if (plotIndex_ === -1) throw new Error("Farm plot not found");
    
    plots[plotIndex_] = { ...plots[plotIndex_], ...updates };
    this.farmPlots.set(userId, plots);
    return plots[plotIndex_];
  }

  async createFarmPlot(farmPlot: InsertFarmPlot): Promise<FarmPlot> {
    const id = randomUUID();
    const plot: FarmPlot = { ...farmPlot, id };
    
    const plots = this.farmPlots.get(farmPlot.userId) || [];
    plots.push(plot);
    this.farmPlots.set(farmPlot.userId, plots);
    return plot;
  }

  // Learning methods
  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values());
  }

  async getLearningModule(id: string): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }

  async getUserProgress(userId: string): Promise<(UserProgress & { module: LearningModule })[]> {
    const progress = this.userProgress.get(userId) || [];
    return progress.map(p => ({
      ...p,
      module: this.learningModules.get(p.moduleId)!,
    })).filter(p => p.module);
  }

  async getUserProgressByModule(userId: string, moduleId: string): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(userId) || [];
    return progress.find(p => p.moduleId === moduleId);
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const userProgress: UserProgress = { 
      ...progress, 
      id,
      startedAt: new Date(),
      completedAt: null,
    };
    
    const progressList = this.userProgress.get(progress.userId) || [];
    progressList.push(userProgress);
    this.userProgress.set(progress.userId, progressList);
    return userProgress;
  }

  async updateUserProgress(userId: string, moduleId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const progressList = this.userProgress.get(userId) || [];
    const progressIndex = progressList.findIndex(p => p.moduleId === moduleId);
    
    if (progressIndex === -1) throw new Error("User progress not found");
    
    progressList[progressIndex] = { ...progressList[progressIndex], ...updates };
    if (updates.completed && !progressList[progressIndex].completedAt) {
      progressList[progressIndex].completedAt = new Date();
    }
    
    this.userProgress.set(userId, progressList);
    return progressList[progressIndex];
  }

  // Equipment methods
  async getEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipmentById(id: string): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async purchaseEquipment(userId: string, equipmentId: string): Promise<void> {
    const user = this.users.get(userId);
    const equipment = this.equipment.get(equipmentId);
    
    if (!user) throw new Error("User not found");
    if (!equipment) throw new Error("Equipment not found");
    if (!equipment.inStock) throw new Error("Equipment out of stock");
    if (user.sustainaCredits < equipment.creditsRequired) {
      throw new Error("Insufficient credits");
    }
    
    // Deduct credits
    user.sustainaCredits -= equipment.creditsRequired;
    this.users.set(userId, user);
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = this.userAchievements.get(userId) || [];
    return userAchievements.map(ua => ({
      ...ua,
      achievement: this.achievements.get(ua.achievementId)!,
    })).filter(ua => ua.achievement);
  }

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    const userAchievements = this.userAchievements.get(userId) || [];
    const alreadyEarned = userAchievements.some(ua => ua.achievementId === achievementId);
    
    if (!alreadyEarned) {
      const userAchievement: UserAchievement = {
        id: randomUUID(),
        userId,
        achievementId,
        earnedAt: new Date(),
      };
      
      userAchievements.push(userAchievement);
      this.userAchievements.set(userId, userAchievements);
      
      // Award credits
      const achievement = this.achievements.get(achievementId);
      if (achievement) {
        const user = this.users.get(userId);
        if (user) {
          user.sustainaCredits += achievement.creditsReward;
          this.users.set(userId, user);
        }
      }
    }
  }

  // Community methods
  async getCommunityPosts(): Promise<(CommunityPost & { user: User })[]> {
    const posts = Array.from(this.communityPosts.values());
    return posts.map(post => ({
      ...post,
      user: this.users.get(post.userId)!,
    })).filter(post => post.user);
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const communityPost: CommunityPost = {
      ...post,
      id,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
    };
    
    this.communityPosts.set(id, communityPost);
    return communityPost;
  }

  async getTopContributors(): Promise<{ user: User; weeklyCredits: number }[]> {
    // Return mock data for now - in a real app this would calculate weekly credits
    const contributors = Array.from(this.users.values()).slice(0, 3);
    return contributors.map((user, index) => ({
      user,
      weeklyCredits: 1250 - (index * 100), // Mock decreasing credits
    }));
  }

  async getCommunityStats(): Promise<{
    activeFarmers: number;
    successStories: number;
    creditsEarnedToday: number;
    equipmentRedeemed: number;
  }> {
    return {
      activeFarmers: 12540,
      successStories: this.communityPosts.size,
      creditsEarnedToday: 45670,
      equipmentRedeemed: 1250,
    };
  }

  // Weather methods
  async getCurrentWeather(): Promise<WeatherData | undefined> {
    return this.weatherData;
  }
}

export const storage = new MemStorage();
