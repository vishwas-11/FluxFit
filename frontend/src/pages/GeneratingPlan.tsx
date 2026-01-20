export default function GeneratingPlan() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-2xl font-bold tracking-wide">
          Building your personalized plan
        </h2>
        <p className="text-gray-400 text-sm max-w-md">
          Our AI is analyzing your goals and creating a tailored fitness
          program. This may take up to 30 seconds.
        </p>
      </div>
    </div>
  );
}
