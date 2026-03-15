import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingEmojis from "@/components/FloatingEmojis";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Loader2, ArrowLeft } from "lucide-react";

const API = "http://localhost:5000";

const Auth = () => {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Forgot password state
  // step: "login" | "forgot_email" | "forgot_otp" | "forgot_reset" | "forgot_done"
  const [fpStep, setFpStep]         = useState<"login" | "forgot_email" | "forgot_otp" | "forgot_reset" | "forgot_done">("login");
  const [fpEmail, setFpEmail]       = useState("");
  const [fpOtp, setFpOtp]           = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpConfirm, setFpConfirm]   = useState("");
  const [fpError, setFpError]       = useState("");
  const [fpLoading, setFpLoading]   = useState(false);

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (err: any) {
      setLoginError(err.message || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── SIGNUP ────────────────────────────────────────────────────────────────
  const handleSignup = async () => {
    setSignupError("");
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setSignupError("Please fill in all fields.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setSignupError("Please agree to the Terms & Spice Policy.");
      return;
    }
    setSignupLoading(true);
    try {
      await register(signupName, signupEmail, signupPassword);
      navigate("/pantry");
    } catch (err: any) {
      setSignupError(err.message || "Signup failed. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  // ── FORGOT — Step 1: send OTP ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    setFpError("");
    if (!fpEmail.trim()) { setFpError("Please enter your email."); return; }
    setFpLoading(true);
    try {
      const res  = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setFpError(data.error || "Failed to send OTP."); return; }
      setFpStep("forgot_otp");
    } catch {
      setFpError("Network error. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  // ── FORGOT — Step 2: verify OTP ──────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setFpError("");
    if (!fpOtp.trim()) { setFpError("Please enter the OTP."); return; }
    setFpLoading(true);
    try {
      const res  = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setFpError(data.error || "Invalid OTP."); return; }
      setFpStep("forgot_reset");
    } catch {
      setFpError("Network error. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  // ── FORGOT — Step 3: reset password ──────────────────────────────────────
  const handleResetPassword = async () => {
    setFpError("");
    if (!fpPassword || !fpConfirm) { setFpError("Please fill in both fields."); return; }
    if (fpPassword !== fpConfirm)  { setFpError("Passwords do not match."); return; }
    if (fpPassword.length < 6)     { setFpError("Password must be at least 6 characters."); return; }
    setFpLoading(true);
    try {
      const res  = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: fpOtp, password: fpPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setFpError(data.error || "Failed to reset password."); return; }
      setFpStep("forgot_done");
    } catch {
      setFpError("Network error. Please try again.");
    } finally {
      setFpLoading(false);
    }
  };

  // ── Input class helper ────────────────────────────────────────────────────
  const inputCls = "w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors";

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 sunburst-bg relative overflow-hidden py-16">
        <FloatingEmojis />
        <div className="container mx-auto px-4 max-w-md relative z-10">

          {/* ════════════════════════════════════════════════════════
              FORGOT PASSWORD STEPS — shown instead of login/signup
          ════════════════════════════════════════════════════════ */}

          {fpStep !== "login" ? (
            <div className="bg-card rounded-2xl p-8 shadow-xl">

              {/* Back button */}
              {fpStep !== "forgot_done" && (
                <button
                  onClick={() => { setFpStep("login"); setFpError(""); setFpOtp(""); setFpPassword(""); setFpConfirm(""); }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              )}

              {/* ── Step 1: Enter email ── */}
              {fpStep === "forgot_email" && (
                <>
                  <h1 className="font-display text-3xl text-primary mb-1">FORGOT PASSWORD?</h1>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Enter your email and we'll send you a 6-digit OTP.
                  </p>
                  {fpError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                      {fpError}
                    </div>
                  )}
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                      className={inputCls}
                    />
                    <Button variant="hero" className="w-full" onClick={handleSendOtp} disabled={fpLoading}>
                      {fpLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "SEND OTP →"}
                    </Button>
                  </div>
                </>
              )}

              {/* ── Step 2: Enter OTP ── */}
              {fpStep === "forgot_otp" && (
                <>
                  <h1 className="font-display text-3xl text-primary mb-1">CHECK YOUR EMAIL!</h1>
                  <p className="text-muted-foreground mb-1 text-sm">
                    We sent a 6-digit OTP to:
                  </p>
                  <p className="font-bold text-primary mb-6 text-sm">{fpEmail}</p>
                  {fpError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                      {fpError}
                    </div>
                  )}
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={fpOtp}
                      maxLength={6}
                      onChange={(e) => setFpOtp(e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                      className={`${inputCls} text-center text-2xl font-bold tracking-widest`}
                    />
                    <Button variant="hero" className="w-full" onClick={handleVerifyOtp} disabled={fpLoading}>
                      {fpLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "VERIFY OTP →"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Didn't receive it?{" "}
                      <button
                        onClick={() => { setFpStep("forgot_email"); setFpError(""); setFpOtp(""); }}
                        className="text-primary font-bold hover:underline"
                      >
                        Resend OTP
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* ── Step 3: New password ── */}
              {fpStep === "forgot_reset" && (
                <>
                  <h1 className="font-display text-3xl text-primary mb-1">NEW PASSWORD</h1>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Almost there! Set your new password below.
                  </p>
                  {fpError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                      {fpError}
                    </div>
                  )}
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="New password (min 6 characters)"
                      value={fpPassword}
                      onChange={(e) => setFpPassword(e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={fpConfirm}
                      onChange={(e) => setFpConfirm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                      className={inputCls}
                    />
                    <Button variant="hero" className="w-full" onClick={handleResetPassword} disabled={fpLoading}>
                      {fpLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "RESET PASSWORD →"}
                    </Button>
                  </div>
                </>
              )}

              {/* ── Step 4: Success ── */}
              {fpStep === "forgot_done" && (
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">🎉</div>
                  <h1 className="font-display text-3xl text-primary mb-2">PASSWORD RESET!</h1>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Your password has been updated successfully. Go ahead and log in!
                  </p>
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => { setFpStep("login"); setFpEmail(""); setFpOtp(""); setFpPassword(""); setFpConfirm(""); }}
                  >
                    BACK TO LOGIN →
                  </Button>
                </div>
              )}

            </div>

          ) : (
            <>
              {/* ════════════════════════════════════════════════════
                  NORMAL LOGIN / SIGNUP TABS
              ════════════════════════════════════════════════════ */}

              {/* Tab toggle */}
              <div className="flex mb-8 rounded-full overflow-hidden border-2 border-primary">
                <button
                  onClick={() => setTab("login")}
                  className={`flex-1 py-3 font-bold text-sm transition-colors ${
                    tab === "login" ? "bg-primary text-primary-foreground" : "text-primary"
                  }`}
                >
                  LOG IN
                </button>
                <button
                  onClick={() => setTab("signup")}
                  className={`flex-1 py-3 font-bold text-sm transition-colors ${
                    tab === "signup" ? "bg-primary text-primary-foreground" : "text-primary"
                  }`}
                >
                  SIGN UP
                </button>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-xl">

                {/* ---- LOGIN FORM ---- */}
                {tab === "login" ? (
                  <>
                    <h1 className="font-display text-3xl text-primary mb-1">WELCOME BACK, CHEF!</h1>
                    <p className="text-muted-foreground mb-6">Your fridge missed you.</p>

                    {loginError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                        {loginError}
                      </div>
                    )}

                    <div className="space-y-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className={inputCls}
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className={inputCls}
                      />

                      <Button variant="hero" className="w-full" onClick={handleLogin} disabled={loginLoading}>
                        {loginLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "LET'S COOK →"}
                      </Button>

                      {/* Forgot password trigger */}
                      <p
                        className="text-center text-sm text-primary hover:underline cursor-pointer font-bold"
                        onClick={() => { setFpStep("forgot_email"); setFpEmail(loginEmail); setFpError(""); }}
                      >
                        Forgot your password?
                      </p>

                      <div className="flex items-center gap-3 text-muted-foreground text-xs">
                        <div className="flex-1 h-px bg-border" />
                        <span>OR</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>

                      <p className="text-center text-sm text-muted-foreground">
                        New here?{" "}
                        <button onClick={() => setTab("signup")} className="text-primary font-bold hover:underline">
                          Switch to Sign Up
                        </button>
                      </p>
                    </div>
                  </>
                ) : (

                /* ---- SIGNUP FORM ---- */
                  <>
                    <h1 className="font-display text-3xl text-primary mb-1">JOIN THE KITCHEN!</h1>
                    <p className="text-muted-foreground mb-6">Create your free account and start cooking.</p>

                    {signupError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                        {signupError}
                      </div>
                    )}

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className={inputCls}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className={inputCls}
                      />
                      <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className={inputCls}
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                        className={inputCls}
                      />

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm">I agree to the Terms & Spice Policy 🌶️</span>
                      </label>

                      <Button variant="hero" className="w-full" onClick={handleSignup} disabled={signupLoading}>
                        {signupLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "CREATE ACCOUNT →"}
                      </Button>

                      <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <button onClick={() => setTab("login")} className="text-primary font-bold hover:underline">
                          Log In
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;