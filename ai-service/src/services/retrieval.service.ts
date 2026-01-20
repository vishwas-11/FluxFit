import { Source } from "../models/source.model";

/**
 * Retrieves candidate sources for RAG-based recommendations
 * Uses tag-based MongoDB query with scoring
 */
export const retrieveCandidateSources = async (
  tags: string[],
  recentLogs: any[],
  limit = 8
): Promise<any[]> => {
  try {
    console.log("🔍 Retrieving sources with tags:", tags);

    // Validate inputs
    if (!tags || tags.length === 0) {
      console.log("⚠️ No tags provided, attempting fallback retrieval");
      // Fallback: Get some general fitness content
      return await getFallbackSources(limit);
    }

    // Filter out empty/null tags and normalize
    const validTags = tags
      .filter(tag => tag && typeof tag === 'string' && tag.trim() !== '')
      .map(tag => tag.toLowerCase().trim());
    
    if (validTags.length === 0) {
      console.log("⚠️ No valid tags after filtering, using fallback");
      return await getFallbackSources(limit);
    }

    console.log("🏷️ Valid tags for search:", validTags);

    // Build tag variations for better matching
    const tagVariations = buildTagVariations(validTags);
    console.log("🔄 Including variations:", tagVariations.slice(0, 5));

    // Query with scoring: prefer documents with multiple matching tags
    const sources = await Source.aggregate([
      {
        // Match documents with any of the tags
        $match: {
          tags: { 
            $in: [...validTags, ...tagVariations] 
          }
        }
      },
      {
        // Add a score based on number of matching tags
        $addFields: {
          matchScore: {
            $size: {
              $setIntersection: [
                "$tags",
                [...validTags, ...tagVariations]
              ]
            }
          }
        }
      },
      {
        // Sort by match score (descending)
        $sort: { matchScore: -1 }
      },
      {
        // Limit results
        $limit: limit
      }
    ]);

    console.log(`📚 Found ${sources.length} sources via tag search`);

    if (sources.length > 0) {
      console.log("📄 Top source titles:");
      sources.slice(0, 3).forEach((s, idx) => {
        console.log(`   ${idx + 1}. ${s.title} (score: ${s.matchScore})`);
      });
    } else {
      console.log("⚠️ No sources found with provided tags");
      console.log("💡 Trying fallback retrieval...");
      return await getFallbackSources(limit);
    }

    return sources;

  } catch (error: any) {
    console.error("❌ Retrieval error:", error.message);
    console.error("Stack:", error.stack);
    
    // Try fallback on error
    console.log("🔄 Attempting fallback retrieval...");
    return await getFallbackSources(limit);
  }
};

/**
 * Build tag variations for better matching
 * e.g., "weight loss" -> ["weight loss", "fat loss", "lose weight"]
 */
function buildTagVariations(tags: string[]): string[] {
  const variations: string[] = [];
  
  // Common fitness term mappings
  const synonyms: { [key: string]: string[] } = {
    "weight loss": ["fat loss", "lose weight", "weight reduction"],
    "muscle building": ["muscle gain", "hypertrophy", "bulking"],
    "strength training": ["resistance training", "weight training", "lifting"],
    "cardio": ["aerobic", "cardiovascular", "endurance"],
    "beginner": ["novice", "starter", "getting started"],
    "home workout": ["home exercise", "bodyweight", "no equipment"],
    "knee pain": ["knee injury", "knee problems"],
    "back pain": ["lower back", "back injury"],
  };

  tags.forEach(tag => {
    const lowerTag = tag.toLowerCase();
    if (synonyms[lowerTag]) {
      variations.push(...synonyms[lowerTag]);
    }
  });

  return variations;
}

/**
 * Fallback: Get general fitness sources if no tags match
 */
async function getFallbackSources(limit: number): Promise<any[]> {
  try {
    console.log("🎯 Using fallback: retrieving general fitness content");
    
    // Get a mix of different categories
    const sources = await Source.aggregate([
      {
        $sample: { size: limit } // Random sampling
      }
    ]);

    console.log(`📚 Fallback returned ${sources.length} general sources`);
    
    if (sources.length > 0) {
      console.log("📄 Fallback source categories:", 
        sources.map(s => s.category).filter((v, i, a) => a.indexOf(v) === i)
      );
    }

    return sources;
    
  } catch (error: any) {
    console.error("❌ Fallback retrieval failed:", error.message);
    return [];
  }
}

/**
 * OPTIONAL: Test the retrieval function
 * Uncomment and run: npx ts-node -e "require('./retrieval.service').testRetrieval()"
 */
export async function testRetrieval() {
  const mongoose = require("mongoose");
  await mongoose.connect(process.env.MONGODB_URI);
  
  console.log("\n🧪 Testing retrieval with different tag combinations:\n");
  
  const testCases = [
    ["weight loss", "beginner"],
    ["muscle building", "advanced"],
    ["knee pain", "injury"],
    ["vegetarian", "protein"],
    [], // Empty tags
  ];

  for (const tags of testCases) {
    console.log(`\n--- Testing tags: [${tags.join(", ")}] ---`);
    const results = await retrieveCandidateSources(tags, [], 3);
    console.log(`Results: ${results.length} sources`);
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.title}`);
    });
  }

  await mongoose.disconnect();
}