import { useEffect, useState } from "react";
import { login, register } from "../services/auth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState({});

  // clear fields when switching modes
  useEffect(() => {
    setEmail("");
    setPassword("");
    setTouched({});
  }, [mode]);

  const emailErr =
    touched.email && !/^\S+@\S+\.\S+$/.test(email || "")
      ? "Enter a valid email."
      : null;
  const pwdErr =
    touched.password && (!password || password.length < 6)
      ? "At least 6 characters."
      : null;

  const invalid = Boolean(emailErr || pwdErr);

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (invalid) return;

    setBusy(true);
    try {
      if (mode === "login") {
        await login({ email, password });
        toast.success("Welcome back 👟");
      } else {
        await register({ email, password }); // role not sent -> Customer by default
        toast.success("Account created! You’re signed in.");
      }
      location.href = "/"; // go home
    } catch {
      // errors are already toasted by axios interceptor
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Soft gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200 via-indigo-100 to-white" />
      {/* Floating blobs for depth */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl place-items-center px-4">
        {/* Card */}
        <div className="w-full max-w-md rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md transition motion-safe:hover:shadow-2xl">
          {/* Brand */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-black/90 text-white grid place-items-center">
              <span className="text-sm font-bold">zF</span>
            </div>
            <div className="text-2xl font-semibold tracking-tight">
              zFlipsters
            </div>
          </div>

          <div className="mb-4 flex rounded-xl bg-gray-100 p-1">
            <button
              className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
                mode === "login"
                  ? "bg-white shadow font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setMode("login")}
              aria-current={mode === "login" ? "page" : undefined}
            >
              Sign in
            </button>
            <button
              className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
                mode === "register"
                  ? "bg-white shadow font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setMode("register")}
              aria-current={mode === "register" ? "page" : undefined}
            >
              Create account
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                className={`mt-1 w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  emailErr ? "border-red-300" : "border-gray-300"
                }`}
                value={email}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              {emailErr && (
                <p className="mt-1 text-xs text-red-600">{emailErr}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div
                className={`mt-1 flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${
                  pwdErr ? "border-red-300" : "border-gray-300"
                }`}
              >
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  className="w-full bg-transparent outline-none"
                  value={password}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "login" ? "Your password" : "Create a password"
                  }
                />
                <button
                  type="button"
                  className="ml-2 rounded-lg px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              {pwdErr && <p className="mt-1 text-xs text-red-600">{pwdErr}</p>}
              {mode === "register" && (
                <p className="mt-1 text-xs text-gray-500">
                  New accounts are <span className="font-medium">Customer</span>{" "}
                  by default.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={busy}
              className="group relative mt-2 w-full rounded-xl bg-blue-600 py-2 text-white transition disabled:opacity-60 hover:bg-blue-600/90"
            >
              <span className="relative z-10">
                {busy
                  ? "Please wait…"
                  : mode === "login"
                  ? "Login"
                  : "Create account"}
              </span>
              <span className="absolute inset-0 -z-0 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-0 blur transition group-hover:opacity-40" />
            </button>
          </form>

          {/* Tiny helper text */}
          <div className="mt-4 text-center text-xs text-gray-500">
            {mode === "login" ? (
              <button className="underline" onClick={() => setMode("register")}>
                Need an account? Register
              </button>
            ) : (
              <button className="underline" onClick={() => setMode("login")}>
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
