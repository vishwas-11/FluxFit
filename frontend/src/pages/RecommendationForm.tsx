import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecommendation } from "../api/ai.api";
// import TiltedCard from "../components/TiltedCard";

export default function RecommendationForm() {
  const [goal, setGoal] = useState("");
  const [injury, setInjury] = useState("");
  const [diet, setDiet] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  type ApiError = {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /**
     * 🚦 IMMEDIATE UX FEEDBACK
     * Navigate to loading screen instantly
     */
    navigate("/generating");

    try {
      const res = await getRecommendation({
        profile: {
          goals: { primary: goal },
          preferences: {
            injury,
            dietType: diet,
          },
        },
        recentLogs: [],
      });

      /**
       * ✅ SUCCESS → RESULT PAGE
       */
      navigate("/recommendation", {
        state: res.data,
      });

    } catch (error: unknown) {
      console.error("❌ Failed to get recommendation");

      navigate("/recommend", { replace: true });

      const typedError = error as ApiError;

      if (typedError.response) {
        alert(typedError.response.data?.message || "AI service failed");
      } else {
        alert("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[#00f3ff]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-[#ff00aa]/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* LEFT: FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">
            BUILD YOUR <span className="text-[#00f3ff]">PLAN</span>
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Tell our AI about your goals to generate a personalized routine.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs text-[#00f3ff] uppercase">Primary Goal</label>
              <input
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Build Muscle, Lose Fat, Marathon Prep"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-[#ff00aa] uppercase">Injury / Limitation</label>
              <input
                value={injury}
                onChange={(e) => setInjury(e.target.value)}
                placeholder="Lower back pain, None"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-[#00ff88] uppercase">Diet Preference</label>
              <input
                required
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                placeholder="Vegan, Keto, High Protein"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-linear-to-r from-[#00f3ff] to-[#0099ff] text-black font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Generate Program"}
            </button>
          </form>
        </div>

        {/* RIGHT: VISUAL */}
        {/* <div className="hidden md:flex justify-center">
          <TiltedCard
            imageSrc="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
            altText="Fitness AI"
            captionText="FLUXFIT // NEURAL ENGINE"
            containerHeight="400px"
            containerWidth="400px"
            imageHeight="400px"
            imageWidth="400px"
            rotateAmplitude={12}
            scaleOnHover={1.1}
            showMobileWarning={false}
            showTooltip
            displayOverlayContent
            overlayContent={
              <div className="absolute bottom-8 left-8 p-4 bg-black/60 border-l-4 border-[#00f3ff]">
                <p className="font-bold">AI ANALYZING</p>
                <p className="text-xs text-[#00f3ff]">PLEASE WAIT</p>
              </div>
            }
          />
        </div> */}
      </div>
    </div>
  );
}
