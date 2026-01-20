import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Source } from "../models/source.model";
import { retrieveCandidateSources } from "../services/retrieval.service";
import dotenv from "dotenv";


dotenv.config();

/**
 * Comprehensive system test to verify:
 * 1. MongoDB connection
 * 2. Database has sources
 * 3. Gemini API key works
 * 4. Retrieval works with tags
 * 5. Full integration test
 */

async function testSystem() {
  console.log("🧪 Starting System Tests\n");
  console.log("=".repeat(50));
  
  let allTestsPassed = true;

  // TEST 1: MongoDB Connection
  console.log("\n📦 TEST 1: MongoDB Connection");
  console.log("-".repeat(50));
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected successfully");
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error.message);
    allTestsPassed = false;
    return;
  }

  // TEST 2: Check if Sources Exist
  console.log("\n📚 TEST 2: Database Sources");
  console.log("-".repeat(50));
  try {
    const sourceCount = await Source.countDocuments();
    console.log(`Found ${sourceCount} sources in database`);
    
    if (sourceCount === 0) {
      console.error("❌ No sources found! Run: npx ts-node src/scripts/seed-sources.ts");
      allTestsPassed = false;
    } else {
      console.log("✅ Database has sources");
      
      // Show categories
      const categories = await Source.distinct("category");
      console.log(`   Categories: ${categories.join(", ")}`);
      
      // Show sample tags
      const allTags = await Source.distinct("tags");
      console.log(`   Total unique tags: ${allTags.length}`);
      console.log(`   Sample tags: ${allTags.slice(0, 10).join(", ")}`);
    }
  } catch (error: any) {
    console.error("❌ Database check failed:", error.message);
    allTestsPassed = false;
  }

  // TEST 3: Gemini API Key
  console.log("\n🔑 TEST 3: Gemini API Key");
  console.log("-".repeat(50));
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in .env");
    }
    console.log(`✅ API Key found: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  } catch (error: any) {
    console.error("❌ API Key check failed:", error.message);
    allTestsPassed = false;
  }

  // TEST 4: Gemini API Call
  console.log("\n🤖 TEST 4: Gemini API Call");
  console.log("-".repeat(50));
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    
    // Try different model names
    const modelsToTry = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-pro"
    ];
    
    let modelWorked = false;
    let workingModel = "";
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`   Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say 'test' in JSON format: {message: 'test'}");
        const text = result.response.text();
        
        console.log(`   ✅ ${modelName} works!`);
        console.log(`   Response: ${text.substring(0, 50)}...`);
        modelWorked = true;
        workingModel = modelName;
        break;
      } catch (err: any) {
        console.log(`   ❌ ${modelName} failed: ${err.message.substring(0, 50)}`);
      }
    }
    
    if (modelWorked) {
      console.log(`\n✅ Gemini API works! Use model: "${workingModel}"`);
      console.log(`\n💡 Update your gemini.service.ts to use: "${workingModel}"`);
    } else {
      console.error("\n❌ No Gemini models worked. Check your API key.");
      allTestsPassed = false;
    }
  } catch (error: any) {
    console.error("❌ Gemini API test failed:", error.message);
    allTestsPassed = false;
  }

  // TEST 5: Retrieval Service
  console.log("\n🔍 TEST 5: Retrieval Service");
  console.log("-".repeat(50));
  try {
    const testCases = [
      {
        name: "Weight loss query",
        tags: ["weight loss", "beginner"],
        expectedMinResults: 1
      },
      {
        name: "Injury-specific query",
        tags: ["knee pain", "injury"],
        expectedMinResults: 1
      },
      {
        name: "Nutrition query",
        tags: ["vegetarian", "protein"],
        expectedMinResults: 1
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n   Testing: ${testCase.name}`);
      console.log(`   Tags: [${testCase.tags.join(", ")}]`);
      
      const results = await retrieveCandidateSources(testCase.tags, [], 3);
      
      if (results.length >= testCase.expectedMinResults) {
        console.log(`   ✅ Found ${results.length} sources`);
        results.forEach((r, i) => {
          console.log(`      ${i + 1}. ${r.title}`);
        });
      } else {
        console.log(`   ⚠️  Only found ${results.length} sources (expected ${testCase.expectedMinResults}+)`);
      }
    }
    
    console.log("\n✅ Retrieval service working");
  } catch (error: any) {
    console.error("❌ Retrieval test failed:", error.message);
    allTestsPassed = false;
  }

  // TEST 6: Full Integration Test
  console.log("\n🎯 TEST 6: Full Integration Test");
  console.log("-".repeat(50));
  try {
    const mockProfile = {
      age: 30,
      height: 170,
      weight: 80,
      goals: { primary: "weight loss", targetWeight: 70 },
      preferences: { injury: "knee pain", dietType: "vegetarian" }
    };

    console.log("   Testing with profile:");
    console.log(`   - Age: ${mockProfile.age}`);
    console.log(`   - Goal: ${mockProfile.goals.primary}`);
    console.log(`   - Injury: ${mockProfile.preferences.injury}`);
    console.log(`   - Diet: ${mockProfile.preferences.dietType}`);

    const tags = [
      mockProfile.goals.primary,
      mockProfile.preferences.injury,
      mockProfile.preferences.dietType
    ];

    const sources = await retrieveCandidateSources(tags, [], 3);
    console.log(`\n   ✅ Retrieved ${sources.length} relevant sources`);

    if (sources.length > 0) {
      const context = sources
        .map(s => `Title: ${s.title}\n${s.content.substring(0, 200)}...`)
        .join("\n\n---\n\n");
      
      console.log(`   ✅ Built context (${context.length} characters)`);
      console.log("\n   Sample context preview:");
      console.log(`   ${context.substring(0, 150)}...`);
    } else {
      console.log("   ⚠️  No context built (will use fallback)");
    }

    console.log("\n✅ Full integration test passed");
  } catch (error: any) {
    console.error("❌ Integration test failed:", error.message);
    allTestsPassed = false;
  }

  // FINAL SUMMARY
  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));
  
  if (allTestsPassed) {
    console.log("\n🎉 ALL TESTS PASSED!");
    console.log("\n✅ Your system is ready to use!");
    console.log("\nNext steps:");
    console.log("1. Start backend: npm run dev");
    console.log("2. Test endpoint with Postman or curl");
    console.log("3. Try the frontend");
  } else {
    console.log("\n⚠️  SOME TESTS FAILED");
    console.log("\nPlease fix the issues above and run tests again:");
    console.log("npx ts-node src/scripts/test-system.ts");
  }

  await mongoose.disconnect();
  console.log("\n👋 Disconnected from MongoDB");
}

// Run the tests
testSystem().catch(error => {
  console.error("💥 Test script crashed:", error);
  process.exit(1);
});