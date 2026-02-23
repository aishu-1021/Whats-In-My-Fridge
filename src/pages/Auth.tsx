import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingEmojis from "@/components/FloatingEmojis";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [agreed, setAgreed] = useState(false);

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
            {tab === "login" ? (
              <>
                <h1 className="font-display text-3xl text-primary mb-1">WELCOME BACK, CHEF!</h1>
                <p className="text-muted-foreground mb-6">Your fridge missed you.</p>
                <div className="space-y-4">
                  <input type="email" placeholder="Email" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
                  <input type="password" placeholder="Password" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
                  <Button variant="hero" className="w-full">LET'S COOK →</Button>
                  <p className="text-center text-sm text-primary hover:underline cursor-pointer">Forgot your password?</p>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <div className="flex-1 h-px bg-border" />
                    <span>OR</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <Button variant="outline" className="w-full">Continue with Google</Button>
                  <p className="text-center text-sm text-muted-foreground">
                    New here?{" "}
                    <button onClick={() => setTab("signup")} className="text-primary font-bold hover:underline">Switch to Sign Up</button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <h1 className="font-display text-3xl text-primary mb-1">JOIN THE KITCHEN!</h1>
                <p className="text-muted-foreground mb-6">Create your free account and start cooking.</p>
                <div className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
                  <input type="email" placeholder="Email" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
                  <input type="password" placeholder="Password" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
                  <input type="password" placeholder="Confirm Password" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-sm">I agree to the Terms & Spice Policy 🌶️</span>
                  </label>
                  <Button variant="hero" className="w-full">CREATE ACCOUNT →</Button>
                  <Button variant="outline" className="w-full">Sign up with Google</Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button onClick={() => setTab("login")} className="text-primary font-bold hover:underline">Log In</button>
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
