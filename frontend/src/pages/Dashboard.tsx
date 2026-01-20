import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile, type UserProfile } from "../api/user.api";

type FormState = {
  name: string;
  age: string;
  height: string;
  dietType: string;
  avatarUrl: string;
};

const AVATAR_FALLBACK =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80";

export default function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    age: "",
    height: "",
    dietType: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const populateForm = (data: UserProfile) => {
    setForm({
      name: data.name ?? "",
      age: data.age ? String(data.age) : "",
      height: data.height ? String(data.height) : "",
      dietType: data.preferences?.dietType ?? "",
      avatarUrl: data.avatarUrl ?? "",
    });
  };

  useEffect(() => {
    let ignore = false;
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProfile();
        if (!ignore && data) {
          setProfile(data);
          populateForm(data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Could not load your profile. Please try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      ignore = true;
    };
  }, []);

  const handleInput =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setStatus(null);
      setError(null);
    };

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Please choose an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      setStatus(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setStatus(null);

    const safeNumber = (value: string) =>
      value.trim() === "" ? undefined : Number(value);

    const payload: Partial<UserProfile> = {
      name: form.name.trim(),
      age: safeNumber(form.age),
      height: safeNumber(form.height),
      preferences: {
        ...profile?.preferences,
        dietType: form.dietType.trim(),
      },
    };
    // Only send avatarUrl when it changed to avoid 413 on large base64 images
    if (form.avatarUrl !== profile?.avatarUrl) {
      payload.avatarUrl = form.avatarUrl || undefined;
    }

    try {
      const updated = await updateProfile(payload);
      setProfile(updated);
      populateForm(updated);
      setStatus("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update failed", err);
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (profile) populateForm(profile);
    setStatus(null);
    setError(null);
  };

  const displayAvatar = useMemo(() => {
    if (form.avatarUrl) return form.avatarUrl;
    if (profile?.avatarUrl) return profile.avatarUrl;
    return AVATAR_FALLBACK;
  }, [form.avatarUrl, profile?.avatarUrl]);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-130 h-130 bg-[#00f3ff]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-115 h-115 bg-[#ff00aa]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400 mb-2">
              Personal hub
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Update your basics and keep your coach in sync.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/recommend")}
              className="px-5 py-3 rounded-lg bg-linear-to-r from-[#00f3ff] to-[#0099ff] text-black font-semibold shadow-[0_0_25px_rgba(0,243,255,0.35)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all"
            >
              Generate Plan
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-3 rounded-lg border border-white/10 text-white hover:border-white/30 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={displayAvatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10"
                />
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[#00f3ff] border-2 border-[#050505]" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                  {profile?.email || "profile"}
                </p>
                <h2 className="text-xl font-semibold">{form.name || "User"}</h2>
                <p className="text-sm text-gray-400">
                  {form.dietType
                    ? `${form.dietType} diet`
                    : "Add your diet preference"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs text-gray-400">Age</p>
                <p className="text-2xl font-semibold">
                  {form.age || "--"}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs text-gray-400">Height (cm)</p>
                <p className="text-2xl font-semibold">
                  {form.height || "--"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Profile completeness</span>
                <span className="font-semibold">
                  {["name", "age", "height", "dietType"].filter(
                    (f) => form[f as keyof FormState]
                  ).length}
                  /4
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#00f3ff] to-[#ff00aa]"
                  style={{
                    width: `${
                      (["name", "age", "height", "dietType"].filter(
                        (f) => form[f as keyof FormState]
                      ).length /
                        4) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
                  Edit profile
                </p>
                <h3 className="text-2xl font-semibold">Basics & preferences</h3>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:border-white/30 transition-all"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#00f3ff] text-black font-semibold shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_18px_rgba(0,243,255,0.45)] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>

            {status && (
              <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {status}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex items-center gap-3 text-gray-300">
                <span className="h-3 w-3 rounded-full bg-[#00f3ff] animate-ping" />
                Loading your profile...
              </div>
            ) : (
              <form
                id="profile-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Name
                    </span>
                    <input
                      value={form.name}
                      onChange={handleInput("name")}
                      required
                      placeholder="Your display name"
                      className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 focus:border-[#00f3ff] outline-none transition-all"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Diet preference
                    </span>
                    <input
                      value={form.dietType}
                      onChange={handleInput("dietType")}
                      placeholder="Vegan, Keto, High Protein..."
                      className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 focus:border-[#ff00aa] outline-none transition-all"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Age
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={form.age}
                      onChange={handleInput("age")}
                      placeholder="Years"
                      className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 focus:border-[#00f3ff] outline-none transition-all"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Height (cm)
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={form.height}
                      onChange={handleInput("height")}
                      placeholder="e.g. 175"
                      className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 focus:border-[#ff00aa] outline-none transition-all"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Profile image URL
                    </span>
                    <input
                      value={form.avatarUrl}
                      onChange={handleInput("avatarUrl")}
                      placeholder="Paste an image link"
                      className="w-full rounded-lg bg-black/20 border border-white/10 px-4 py-3 focus:border-[#00f3ff] outline-none transition-all"
                    />
                    <span className="text-xs text-gray-500">
                      Paste a link or upload a file below.
                    </span>
                  </label>

                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Upload image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="w-full rounded-lg bg-black/20 border border-dashed border-white/20 px-4 py-3 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">
                      Max 2MB. Stored as a secure data URL.
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm text-gray-300">Profile preview</p>
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={displayAvatar}
                        alt="Preview"
                        className="h-14 w-14 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <p className="font-semibold">
                          {form.name || "Your name"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {form.dietType || "Diet preference"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm text-gray-300">Quick tips</p>
                    <ul className="mt-3 text-xs text-gray-400 space-y-1">
                      <li>• Keep your name recognizable for your coach.</li>
                      <li>• Diet preference shapes meal recommendations.</li>
                      <li>• Age/height help tailor training volume.</li>
                    </ul>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
