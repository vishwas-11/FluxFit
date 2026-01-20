import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Import Source model - adjust path based on your structure
import { Source } from "../models/source.model";

/**
 * Comprehensive fitness knowledge base for RAG
 */
const fitnessKnowledge = [
  // WEIGHT LOSS
  {
    title: "Effective Weight Loss Strategies",
    url: "internal://weight-loss-guide",
    type: "article",
    category: "weight-loss",
    content: `Weight loss fundamentals: Create a caloric deficit of 300-500 calories per day for sustainable weight loss of 0.5-1kg per week. 
    
    Key principles:
    - Combine cardio (150-300 mins/week) with strength training (2-3 times/week)
    - Focus on high-protein intake (1.6-2.2g per kg bodyweight) to preserve muscle
    - Prioritize whole foods, vegetables, and lean proteins
    - Stay hydrated (2-3 liters daily)
    - Get 7-9 hours of sleep for optimal hormone regulation
    
    Common mistakes:
    - Cutting calories too drastically (slows metabolism)
    - Doing only cardio without strength training (loses muscle mass)
    - Not tracking food intake accurately
    - Expecting too fast results (leading to unsustainable methods)
    
    Safe rate: 0.5-1% body weight per week`,
    tags: ["weight loss", "fat loss", "calorie deficit", "cardio", "beginner"],
  },
  
  // MUSCLE BUILDING
  {
    title: "Muscle Building and Strength Training Guide",
    url: "internal://muscle-building",
    type: "article",
    category: "muscle-building",
    content: `Muscle building requires progressive overload, adequate protein, and recovery.
    
    Training principles:
    - Lift heavy weights with good form (6-12 rep range)
    - Train each muscle group 2-3 times per week
    - Focus on compound movements: squats, deadlifts, bench press, rows
    - Progressive overload: gradually increase weight, reps, or sets
    
    Nutrition for muscle growth:
    - Caloric surplus of 200-300 calories daily
    - Protein: 1.6-2.2g per kg bodyweight
    - Carbs for energy: 3-5g per kg bodyweight
    - Don't neglect healthy fats: 0.8-1g per kg bodyweight
    
    Recovery is crucial:
    - 48-72 hours rest between training same muscle group
    - 7-9 hours of sleep
    - Active recovery on rest days
    
    Expected timeline:
    - Beginners: 0.5-1kg muscle gain per month
    - Intermediates: 0.25-0.5kg per month`,
    tags: ["muscle building", "strength training", "hypertrophy", "progressive overload", "bulking"],
  },
  
  // HOME WORKOUTS
  {
    title: "Complete Home Workout Program",
    url: "internal://home-workout",
    type: "article",
    category: "home-workout",
    content: `Complete home workout program requiring minimal equipment.
    
    Bodyweight exercises:
    1. Push-ups (chest, triceps, shoulders) - 3x10-15
    2. Squats (legs, glutes) - 3x15-20
    3. Lunges (legs, balance) - 3x10 each leg
    4. Plank (core) - 3x30-60 seconds
    5. Mountain climbers (cardio, core) - 3x20
    6. Burpees (full body, cardio) - 3x10
    
    Weekly structure:
    Monday: Upper body focus
    Tuesday: Lower body focus
    Wednesday: Active rest (yoga, walk)
    Thursday: Full body circuit
    Friday: Cardio focus
    Saturday: Lower body
    Sunday: Complete rest
    
    Progression strategies:
    - Increase reps gradually
    - Add tempo (slower movements for time under tension)
    - Reduce rest time between sets
    - Add resistance bands
    - Progress to harder variations`,
    tags: ["home workout", "bodyweight", "no equipment", "beginner friendly", "calisthenics"],
  },
  
  // KNEE PAIN
  {
    title: "Safe Exercise with Knee Pain",
    url: "internal://knee-pain-guide",
    type: "article",
    category: "injury-management",
    content: `Safe exercises and modifications for knee pain or injury.
    
    EXERCISES TO AVOID:
    - Deep squats or lunges below 90 degrees
    - Running/jumping on hard surfaces
    - Leg extensions with heavy weight
    - Any exercise causing sharp pain
    
    SAFE ALTERNATIVES:
    - Swimming or water aerobics (zero impact)
    - Cycling with proper seat height
    - Wall sits (partial range of motion)
    - Glute bridges
    - Step-ups with low step height (4-6 inches)
    - Resistance band leg exercises
    
    Knee strengthening exercises:
    1. Straight leg raises - 3x15
    2. Terminal knee extensions with band - 3x15
    3. Clamshells - 3x15 each side
    4. Glute bridges - 3x15
    5. Wall squats to comfortable depth - 3x10
    6. Seated leg extensions (light weight, high reps)
    
    Important principles:
    - Always warm up with 5-10 minutes of gentle movement
    - Start with low impact exercises
    - Focus on strengthening muscles around knee (quads, hamstrings, glutes)
    - Use ice after workout if inflammation occurs
    - Stop immediately if sharp pain
    - Consult physiotherapist if pain persists beyond 2 weeks`,
    tags: ["knee pain", "knee injury", "low impact", "rehabilitation", "modifications", "injury"],
  },
  
  // BACK PAIN
  {
    title: "Lower Back Pain Exercise Modifications",
    url: "internal://back-pain-guide",
    type: "article",
    category: "injury-management",
    content: `Exercise modifications for lower back issues.
    
    EXERCISES TO AVOID:
    - Heavy deadlifts or bent-over rows
    - Traditional sit-ups or crunches
    - Hyperextensions
    - Heavy overhead press
    - High-impact activities
    
    SAFE AND BENEFICIAL:
    - Bird dogs - 3x10 each side
    - Dead bugs - 3x10
    - Cat-cow stretches - 10 reps
    - Pelvic tilts - 15 reps
    - Modified planks (on knees if needed) - 3x20-30s
    - Swimming
    - Walking
    
    Core strengthening (McGill Big 3):
    1. Curl-ups - 3x10
    2. Side planks - 3x20s each side
    3. Bird dogs - 3x10 each side
    
    Additional safe exercises:
    - Pallof press with resistance band
    - Dead bugs
    - Hollow body holds (modified)
    - Quadruped opposite arm/leg raises
    
    Key principles:
    - Maintain neutral spine (avoid rounding or arching)
    - Brace core before all movements
    - Breathe properly (never hold breath)
    - Start with minimal or no load
    - Focus on control over speed`,
    tags: ["back pain", "lower back", "back injury", "core strength", "rehabilitation"],
  },
  
  // VEGETARIAN NUTRITION
  {
    title: "Complete Vegetarian High-Protein Guide",
    url: "internal://vegetarian-protein",
    type: "article",
    category: "nutrition",
    content: `Complete protein sources and meal planning for vegetarians.
    
    Best protein sources (per 100g):
    - Greek yogurt: 10g protein
    - Cottage cheese: 11g protein
    - Lentils (cooked): 9g protein
    - Chickpeas: 9g protein
    - Black beans: 8g protein
    - Tofu: 8g protein
    - Tempeh: 19g protein
    - Quinoa: 4g protein (complete protein)
    - Eggs: 13g protein
    - Paneer: 18g protein
    - Protein powder (pea/soy): 20-25g per scoop
    
    Sample meal plan (2000 calories, 120g protein):
    
    Breakfast (25g protein):
    - Greek yogurt parfait: 200g yogurt, 30g granola, berries, 15g almonds
    
    Snack (20g protein):
    - Protein smoothie: 1 scoop protein powder, banana, 2 tbsp peanut butter, soy milk
    
    Lunch (25g protein):
    - Lentil dal curry with quinoa and mixed vegetables, side salad
    
    Snack (10g protein):
    - Hummus (100g) with vegetables and whole grain crackers
    
    Dinner (30g protein):
    - Tofu stir-fry (200g tofu) with brown rice and mixed vegetables
    
    Evening snack (10g protein):
    - Cottage cheese or paneer with fruit
    
    Tips for vegetarians:
    - Combine incomplete proteins (rice + beans = complete protein)
    - Use protein powder if struggling to meet targets
    - Include variety for complete amino acid profile
    - Don't forget B12 supplementation
    - Consider iron-rich foods (spinach, lentils) with vitamin C`,
    tags: ["vegetarian", "protein", "meal plan", "plant-based", "nutrition", "diet"],
  },
  
  // BALANCED NUTRITION
  {
    title: "Balanced Nutrition for Fitness Goals",
    url: "internal://balanced-nutrition",
    type: "article",
    category: "nutrition",
    content: `Macronutrient breakdown and meal timing for optimal results.
    
    Macronutrient ranges by goal:
    
    Weight loss:
    - Protein: 40% (keeps you full, preserves muscle)
    - Carbs: 30% (energy for workouts)
    - Fats: 30% (hormone production)
    
    Maintenance:
    - Protein: 30%
    - Carbs: 40%
    - Fats: 30%
    
    Muscle building:
    - Protein: 30%
    - Carbs: 45% (fuel for intense training)
    - Fats: 25%
    
    Meal timing for performance:
    - Pre-workout (1-2 hours before): Carbs + moderate protein
      Example: Banana with peanut butter, oatmeal
    - Post-workout (within 2 hours): Protein + carbs
      Example: Protein shake with fruit, chicken with rice
    - Before bed: Slow-digesting protein
      Example: Casein protein, cottage cheese, Greek yogurt
    
    Food quality matters:
    Proteins: Chicken, fish, eggs, legumes, dairy, tofu
    Carbs: Whole grains, oats, rice, quinoa, fruits, vegetables
    Fats: Avocado, nuts, seeds, olive oil, fatty fish
    
    Hydration guidelines:
    - Baseline: 30-35ml per kg bodyweight
    - Add 500-1000ml per hour of exercise
    - More in hot weather or intense exercise
    - Monitor urine color (pale yellow = well hydrated)
    
    Supplements to consider:
    - Protein powder (whey, pea, soy) for convenience
    - Creatine monohydrate (5g daily) for strength and power
    - Vitamin D (if deficient or low sun exposure)
    - Omega-3 (if low fish intake)
    - Multivitamin (insurance policy, not replacement for whole foods)`,
    tags: ["nutrition", "macros", "meal timing", "balanced diet", "supplements", "hydration"],
  },
  
  // CARDIO FOR FAT LOSS
  {
    title: "Optimal Cardio for Fat Loss",
    url: "internal://cardio-guide",
    type: "article",
    category: "cardio",
    content: `Strategic cardio approaches for fat loss while preserving muscle.
    
    Types of cardio explained:
    
    1. LISS (Low Intensity Steady State)
       - Heart rate: 50-65% of max
       - Examples: Walking, slow cycling, swimming
       - Duration: 30-60 minutes
       - Benefits: Burns fat, easy recovery, can be done daily
       - Best for: Beginners, active recovery days, high training volume
    
    2. MISS (Moderate Intensity Steady State)
       - Heart rate: 65-75% of max
       - Examples: Jogging, brisk cycling, rowing
       - Duration: 20-40 minutes
       - Benefits: Good calorie burn, sustainable long-term
       - Best for: General fitness, steady fat loss
    
    3. HIIT (High Intensity Interval Training)
       - Heart rate: 85-95% of max during intervals
       - Examples: Sprint intervals, bike sprints, burpees
       - Duration: 15-25 minutes total
       - Structure: 20-30s hard, 40-60s easy, repeat 8-12 rounds
       - Benefits: High calorie burn, metabolic boost for hours after
       - Best for: Time-efficient fat loss, conditioning
    
    Weekly cardio schedule for weight loss:
    - 2-3 sessions HIIT (15-20 minutes) - high intensity days
    - 2-3 sessions LISS (30-45 minutes) - recovery/easy days
    - Keep cardio on non-lifting days OR after weights
    - Total: 150-300 minutes per week
    
    Important notes:
    - Don't overdo cardio (can interfere with muscle building)
    - Prioritize strength training for body composition
    - Increase intensity gradually to avoid burnout
    - Listen to your body - joint pain means scale back
    - Combine with calorie deficit for best fat loss results`,
    tags: ["cardio", "weight loss", "fat loss", "HIIT", "LISS", "fat burning", "conditioning"],
  },
  
  // BEGINNER GUIDE
  {
    title: "Complete Beginner's Fitness Roadmap",
    url: "internal://beginner-guide",
    type: "article",
    category: "beginner",
    content: `Starting your fitness journey: a complete beginner's roadmap.
    
    PHASE 1 - Weeks 1-2: Build the habit
    - Exercise 3 times per week (e.g., Monday, Wednesday, Friday)
    - 20-30 minutes per session
    - Focus on learning proper form with light weights
    - Don't worry about intensity yet - consistency is key
    - Example: 3 sets of 10 reps for each exercise
    
    PHASE 2 - Weeks 3-4: Increase consistency
    - Add 1 more day (4 days per week)
    - 30-40 minutes per session
    - Start tracking workouts in a notebook or app
    - Add more variety to exercises
    - Begin to feel more comfortable with movements
    
    PHASE 3 - Month 2-3: Progressive challenge
    - Gradually increase weights/resistance by 5-10%
    - Add more advanced exercise variations
    - Focus on form and mind-muscle connection
    - Start tracking nutrition and calories
    - Consider adding cardio on off days
    
    Sample beginner full-body workout (3x per week):
    
    1. Warm-up: 5 minutes light cardio (walk, bike, jumping jacks)
    
    2. Main workout:
       - Squats - 3x10 (bodyweight or light dumbbell)
       - Push-ups - 3x8 (modify on knees if needed)
       - Dumbbell rows - 3x10 each arm
       - Lunges - 3x8 each leg
       - Plank - 3x20-30 seconds
       - Glute bridges - 3x12
    
    3. Cool-down: 5 minutes stretching (focus on muscles worked)
    
    Common beginner mistakes to avoid:
    - Doing too much too soon (leads to burnout or injury)
    - Not taking rest days seriously (muscles grow during rest)
    - Using poor form to lift heavier weights
    - Neglecting nutrition while exercising
    - Comparing yourself to others (everyone starts somewhere)
    - Giving up after 2-3 weeks (real changes take time)
    
    Realistic expectations by timeline:
    - Week 1-2: Feel sore, building habit
    - Week 3-4: Soreness decreases, exercises feel easier
    - Month 2-3: Notice energy improvements, better sleep
    - Month 3-6: Visible body changes, significant strength gains
    - 6+ months: Major transformations possible with consistency
    
    Key success factors:
    - Consistency over perfection
    - Progressive overload (gradually increase difficulty)
    - Adequate nutrition (fuel your workouts)
    - Sufficient sleep (7-9 hours)
    - Patience and persistence`,
    tags: ["beginner", "getting started", "fitness journey", "workout routine", "beginner friendly"],
  },
  
  // ADVANCED TRAINING
  {
    title: "Advanced Training Techniques for Plateaus",
    url: "internal://advanced-training",
    type: "article",
    category: "advanced",
    content: `Plateau-breaking techniques for experienced lifters.
    
    Progressive overload methods (beyond adding weight):
    1. Increase weight (most straightforward)
    2. Increase reps at same weight
    3. Increase number of sets
    4. Decrease rest time between sets
    5. Increase time under tension (slower tempo)
    6. Improve form and increase range of motion
    
    Advanced intensity techniques:
    
    Drop sets:
    - Complete a set to near failure
    - Immediately reduce weight by 20-30%
    - Continue to failure again
    - Repeat 2-3 times
    - Best for: Hypertrophy, muscle endurance
    
    Supersets:
    - Two exercises back-to-back with no rest
    - Can be same muscle group (agonist) or opposing (antagonist)
    - Example: Bench press + Dumbbell flyes
    - Best for: Time efficiency, muscle pump
    
    Giant sets:
    - 3-4 exercises for same muscle group with minimal rest
    - Example: Squats + Leg press + Lunges + Leg extensions
    - Best for: Hypertrophy, metabolic stress
    
    Rest-pause training:
    - Take a set to failure
    - Rest 15-20 seconds
    - Continue for more reps to failure
    - Repeat 2-3 times
    - Best for: Breaking strength plateaus
    
    Tempo training:
    - Control the speed of each rep phase
    - Example: 3-1-2-1 (3s eccentric, 1s pause, 2s concentric, 1s pause)
    - Increases time under tension
    - Best for: Muscle growth, mind-muscle connection
    
    Periodization for long-term progress:
    
    Hypertrophy phase (4-6 weeks):
    - 8-12 reps, 3-4 sets
    - Moderate weight (65-75% 1RM)
    - 60-90s rest between sets
    
    Strength phase (3-4 weeks):
    - 4-6 reps, 4-5 sets
    - Heavy weight (80-90% 1RM)
    - 2-3 minutes rest
    
    Power phase (2-3 weeks):
    - 1-3 reps, 5-6 sets
    - Very heavy (90-95% 1RM)
    - 3-5 minutes rest
    
    Deload week (every 4-6 weeks):
    - Reduce volume by 40-50%
    - Reduce intensity by 20-30%
    - Active recovery focus
    
    Signs you need a deload:
    - Persistent fatigue despite adequate sleep
    - Strength plateau or regression
    - Joint pain or excessive soreness
    - Loss of motivation to train
    - Irritability or mood changes
    - Poor sleep quality
    
    Advanced training requires:
    - Several years of consistent training
    - Solid understanding of exercise form
    - Ability to gauge intensity accurately
    - Good recovery practices
    - Proper nutrition to support training volume`,
    tags: ["advanced", "progressive overload", "plateau", "training techniques", "periodization"],
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");
    
    // Check if MONGO_URI is available
    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      throw new Error("MONGO_URI or MONGODB_URI not found in environment variables");
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("📡 Connecting to MongoDB...");
    console.log(`   URI: ${mongoUri?.substring(0, 30)}...`);
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri!);
    console.log("✅ Connected to MongoDB\n");
    
    // Clear existing sources
    const deleteResult = await Source.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing sources\n`);
    
    // Insert new sources
    console.log("📝 Inserting new fitness knowledge sources...");
    const result = await Source.insertMany(fitnessKnowledge);
    console.log(`✅ Inserted ${result.length} fitness knowledge sources\n`);
    
    // Display summary
    console.log("📊 Seeding Summary:");
    console.log("=".repeat(50));
    
    const categories = await Source.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    categories.forEach(cat => {
      console.log(`   ${cat._id.padEnd(20)}: ${cat.count} article(s)`);
    });
    
    console.log("\n✨ Sample tags in database:");
    const allTags = await Source.distinct("tags");
    console.log(`   ${allTags.slice(0, 20).join(", ")}`);
    console.log(`   ... and ${allTags.length - 20} more tags`);
    
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n✅ You can now:");
    console.log("   1. Start your backend: npm run dev");
    console.log("   2. Test the recommendation endpoint");
    console.log("   3. RAG will now retrieve relevant fitness content!");
    
  } catch (error: any) {
    console.error("\n❌ Seeding failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("   1. Check if MONGO_URI is set in .env file");
    console.error("   2. Verify MongoDB is running");
    console.error("   3. Check network/firewall settings");
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

// Run the seeding
seedDatabase();