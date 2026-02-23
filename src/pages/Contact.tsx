import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

const Contact = () => {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background py-20">
          <div className="container mx-auto px-4 max-w-md text-center">
            <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4" />
            <h1 className="font-display text-3xl text-primary mb-3">MESSAGE RECEIVED!</h1>
            <p className="text-muted-foreground mb-6">
              We've got your message in the tiffin! We'll get back to you faster than a hot samosa disappears at tea time.
            </p>
            <Button variant="hero" onClick={() => setSent(false)}>KEEP COOKING →</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">SAY NAMASTE!</h1>
            <div className="w-32 h-1 bg-primary mx-auto rounded-full mb-4" style={{ borderRadius: "50%/100%" }} />
            <p className="text-muted-foreground">
              Got a recipe to share? A question about spice blends? Or just want to say hi?
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl p-8">
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
              <input type="email" placeholder="Your Email" className="w-full h-12 px-5 rounded-full border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors" />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-card focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <Button variant="hero" className="w-full" onClick={() => setSent(true)}>
                <Mail className="w-4 h-4 mr-2" /> SEND MESSAGE
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
