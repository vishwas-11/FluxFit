import { useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import YouTubeCard from "../components/YouTubeCard";

/* -------------------- Types -------------------- */

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
}

interface RecommendationData {
  personalizedInsight?: string;
  workoutPlan?: string[];
  dietGuidance?: {
    dailyCalorieRange?: string;
    macroSplit?: string;
    mealSuggestions?: string[];
  };
  injuryConsiderations?: string[];
  progressExpectations?: {
    week1to2?: string;
    month1?: string;
    month3?: string;
  };
  commonMistakes?: string[];
  motivationalTip?: string;
}

/* -------------------- Component -------------------- */

export default function RecommendationResult() {
  const { state } = useLocation();

  /* -------------------- YouTube State -------------------- */

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Redirect if page refreshed or state lost
  if (!state) return <Navigate to="/recommend" replace />;

  const data = state.data || state;

  const recommendation: RecommendationData | null =
    typeof data.recommendation === "object" ? data.recommendation : null;

  const profile = data.profile;

  /* -------------------- Fetch Videos -------------------- */

  type ApiError = {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      setVideoError(null);

      const res = await axios.post("/youtube/recommend", {
        goal: profile?.goals?.primary,
        diet: profile?.preferences?.dietType,
      });

      setVideos(res.data.data.youtubeVideos || []);
    } catch (err: unknown) {
      const typedErr = err as ApiError;
      const msg =
        typedErr?.response?.data?.message ||
        typedErr?.response?.data?.error ||
        typedErr?.message ||
        "Failed to load workout videos";
      setVideoError(msg);
    } finally {
      setLoadingVideos(false);
    }
  };

  /* -------------------- Guard -------------------- */

  if (!recommendation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Unable to Load Recommendation
          </h3>
          <p className="text-gray-300">
            Invalid recommendation format received.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Personalized Plan
          </h1>
          <p className="text-gray-400 mt-2">
            Tailored recommendations based on your profile
          </p>
        </div>

        {/* MOTIVATION */}
        {recommendation.motivationalTip && (
          <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">🌟 Motivation</h3>
            <p className="italic text-gray-200">
              {recommendation.motivationalTip}
            </p>
          </div>
        )}

        {/* INSIGHT */}
        {recommendation.personalizedInsight && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Insight</h3>
            <p className="text-gray-200">
              {recommendation.personalizedInsight}
            </p>
          </div>
        )}

        {/* WORKOUT PLAN */}
        {recommendation.workoutPlan && recommendation.workoutPlan.length > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">💪 Workout Plan</h3>
            <ul className="space-y-2">
              {recommendation.workoutPlan.map((w, i) => (
                <li key={i} className="bg-gray-800 rounded-lg p-3">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* DIET */}
        {recommendation.dietGuidance && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">🍽 Diet</h3>
            {recommendation.dietGuidance.dailyCalorieRange && (
              <p className="text-gray-200">
                {recommendation.dietGuidance.dailyCalorieRange}
              </p>
            )}
            {recommendation.dietGuidance.macroSplit && (
              <p className="text-gray-200 mt-1">
                {recommendation.dietGuidance.macroSplit}
              </p>
            )}
            <ul className="mt-3 space-y-2">
              {recommendation.dietGuidance.mealSuggestions?.map((m, i) => (
                <li key={i} className="bg-gray-800 rounded-lg p-3">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* INJURY */}
        {recommendation.injuryConsiderations?.length && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-red-400 mb-4">⚠️ Safety</h3>
            <ul className="space-y-2">
              {recommendation.injuryConsiderations.map((n, i) => (
                <li key={i} className="bg-red-950/40 rounded-lg p-3">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* -------------------- VIDEO BUTTON -------------------- */}

        <div className="text-center pt-6">
          <button
            onClick={fetchVideos}
            disabled={loadingVideos}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
          >
            {loadingVideos ? "Finding Videos..." : "🎥 Recommend Workout Videos"}
          </button>
          {videoError && (
            <p className="text-red-400 mt-3">{videoError}</p>
          )}
        </div>

        {/* -------------------- VIDEOS -------------------- */}

        {videos.length > 0 && (
          <div className="pt-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
              🎥 Recommended Workout Videos
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map(v => (
                <YouTubeCard key={v.videoId} {...v} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
