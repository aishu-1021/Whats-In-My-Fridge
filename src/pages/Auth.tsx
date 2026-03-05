import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingEmojis from "@/components/FloatingEmojis";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Loader2 } from "lucide-react";

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

  // -------------------------------------------------------
  // HANDLE LOGIN
  // -------------------------------------------------------
  const handleLogin = async () => {
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter your email and password.");
      return;
    }

    setLoginLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate("/");  // Redirect to home on success
    } catch (err: any) {
      setLoginError(err.message || "Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // -------------------------------------------------------
  // HANDLE SIGNUP
  // -------------------------------------------------------
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
      navigate("/pantry");  // New users go to pantry setup
    } catch (err: any) {
      setSignupError(err.message || "Signup failed. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 sunburst-bg relative overflow-hidden py-16">
        <FloatingEmojis />
        <div className="container mx-auto px-4 max-w-md relative z-10">

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
                    className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
                  />

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleLogin}
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "LET'S COOK →"
                    )}
                  </Button>

                  <p className="text-center text-sm text-primary hover:underline cursor-pointer">
                    Forgot your password?
                  </p>

                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <div className="flex-1 h-px bg-border" />
                    <span>OR</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <p className="text-center text-sm text-muted-foreground">
                    New here?{" "}
                    <button
                      onClick={() => setTab("signup")}
                      className="text-primary font-bold hover:underline"
                    >
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
                    className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors"
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

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleSignup}
                    disabled={signupLoading}
                  >
                    {signupLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "CREATE ACCOUNT →"
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      onClick={() => setTab("login")}
                      className="text-primary font-bold hover:underline"
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;