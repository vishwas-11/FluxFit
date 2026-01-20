import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

declare global {
  interface Window {
    google?: typeof google;
  }
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loginWithGoogle, loading, error } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) navigate("/dashboard");
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google sign-in will not be available.");
      return;
    }

    let retryCount = 0;
    const MAX_RETRIES = 50; // Max 5 seconds (50 * 100ms)

    // Wait for Google script to load
    const checkGoogleScript = () => {
      if (window.google?.accounts?.id && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              const credential = response.credential;
              if (!credential) {
                console.error("No credential received from Google");
                return;
              }
              const success = await loginWithGoogle(credential);
              if (success) navigate("/dashboard");
            },
          });

          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              type: "standard",
              theme: "outline",
              size: "large",
              shape: "pill",
              width: 320,
            }
          );
        } catch (error) {
          console.error("Error initializing Google sign-in:", error);
        }
      } else if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(checkGoogleScript, 100);
      } else {
        console.warn("Google Identity Services script failed to load after maximum retries");
      }
    };

    // Start checking after component mounts
    const timeoutId = setTimeout(checkGoogleScript, 100);
    
    // Also listen for script load event
    const script = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (script) {
      script.addEventListener('load', checkGoogleScript);
    }

    // Fallback: check if script is already loaded
    if (window.google?.accounts?.id) {
      checkGoogleScript();
    }

    return () => {
      clearTimeout(timeoutId);
      if (script) {
        script.removeEventListener('load', checkGoogleScript);
      }
    };
  }, [loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden">
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      {/* Cyan Orb (Top Left) */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-[#00f3ff]/20 rounded-full blur-[120px] pointer-events-none" />
      {/* Pink Orb (Bottom Right) */}
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-[#ff00aa]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- REGISTER CARD --- */}
      <div className="relative z-10 w-full max-w-md p-8 m-4">
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">
          
          {/* Header Section */}
          <div className="text-center mb-8">
             {/* Small Logo Icon */}
             <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-linear-to-tr from-[#00f3ff] to-[#ff00aa] flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
            <h2 className="text-3xl font-bold text-white tracking-wider mb-2">
              CREATE <span className="text-[#00f3ff]">ACCOUNT</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Join the Core and start your fitness journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#00f3ff] tracking-widest uppercase ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all duration-300"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#00f3ff] tracking-widest uppercase ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="user@fluxfit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all duration-300"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#ff00aa] tracking-widest uppercase ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff00aa] focus:ring-1 focus:ring-[#ff00aa] transition-all duration-300"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full py-4 bg-[#00f3ff] text-black font-bold text-lg uppercase tracking-widest rounded-lg hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-3 text-xs uppercase tracking-[0.2em] text-gray-500">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center">
            <div ref={googleButtonRef} />
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-[#00f3ff] hover:text-white transition-colors font-semibold">
                Sign In
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
