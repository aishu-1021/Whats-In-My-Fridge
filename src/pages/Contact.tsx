import { useState } from "react";
import emailjs from "@emailjs/browser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, MapPin, Clock, MessageSquare, Loader2 } from "lucide-react";

const EJS_SERVICE  = "service_zgzd38a";
const EJS_TEMPLATE = "template_nzdnuuo";
const EJS_KEY      = "MMaLzV-Wvmsya4aWx";

const infoCards = [
  {
    icon:   <Mail size={18} strokeWidth={2} />,
    title:  "Email Us",
    detail: "noreply.whatsinmyfridge@gmail.com",
    sub:    "We reply within 24 hours",
  },
  {
    icon:   <MapPin size={18} strokeWidth={2} />,
    title:  "Based In",
    detail: "Bangalore, India",
    sub:    "Made with love locally",
  },
  {
    icon:   <Clock size={18} strokeWidth={2} />,
    title:  "Response Time",
    detail: "Under 24 hours",
    sub:    "Mon – Sat, 9am – 6pm IST",
  },
];

const Contact = () => {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    setError("");
    try {
      await emailjs.send(
        EJS_SERVICE,
        EJS_TEMPLATE,
        {
          name:    name.trim(),
          email:   email.trim(),
          message: message.trim(),
        },
        { publicKey: EJS_KEY }  // ✅ fixed: modern @emailjs/browser API
      );
      setSent(true);
      setName(""); setEmail(""); setMessage("");
    } catch (err: any) {
      console.error("EmailJS error:", err);
      setError(`Failed to send (${err?.status ?? err?.text ?? "unknown error"}). Please try again.`);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background py-20">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "hsl(var(--accent) / 0.12)" }}>
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="font-display text-3xl text-primary mb-3">MESSAGE RECEIVED!</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We've got your message in the tiffin! We'll get back to you faster
              than a hot samosa disappears at tea time.
            </p>
            <Button variant="hero" onClick={() => setSent(false)}>KEEP COOKING →</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <style>{`
        .contact-input {
          width: 100%; height: 48px; padding: 0 20px;
          border-radius: 999px; border: 2px solid hsl(var(--border));
          background: hsl(var(--background)); font-size: 14px;
          font-family: inherit; color: hsl(var(--foreground));
          outline: none; transition: border-color 0.18s, box-shadow 0.18s;
        }
        .contact-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
        }
        .contact-textarea {
          width: 100%; padding: 14px 20px; border-radius: 16px;
          border: 2px solid hsl(var(--border)); background: hsl(var(--background));
          font-size: 14px; font-family: inherit; color: hsl(var(--foreground));
          outline: none; resize: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .contact-textarea:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
        }
        .info-card {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; border-radius: 14px;
          border: 1.5px solid hsl(var(--border)); background: hsl(var(--card));
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .info-card:hover {
          border-color: hsl(var(--primary) / 0.4);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .info-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: hsl(var(--primary) / 0.1); color: hsl(var(--primary));
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background">

          {/* Hero */}
          <section className="bg-primary py-14 text-center">
            <div className="container mx-auto px-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(255,255,255,0.15)" }}>
                <MessageSquare size={24} strokeWidth={2} color="white" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-primary-foreground mb-3">
                SAY NAMASTE!
              </h1>
              <p className="text-primary-foreground/80 max-w-md mx-auto text-sm leading-relaxed">
                Got a recipe to share? A question about spice blends? Or just want to say hi?
                We'd love to hear from you.
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-14">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Info cards */}
                <div className="flex flex-col gap-4">
                  <p className="font-bold text-xs tracking-widest text-muted-foreground uppercase mb-1">
                    Get in touch
                  </p>
                  {infoCards.map((card) => (
                    <div key={card.title} className="info-card">
                      <div className="info-icon">{card.icon}</div>
                      <div>
                        <p className="font-bold text-sm">{card.title}</p>
                        <p className="text-sm text-foreground mt-0.5 break-all">{card.detail}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 p-4 rounded-2xl"
                    style={{ background: "hsl(var(--primary) / 0.06)", borderLeft: "3px solid hsl(var(--primary))" }}>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "Every great recipe starts with a conversation. Let's start one."
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="md:col-span-2">
                  <div className="bg-card border-2 border-border rounded-2xl p-8">
                    <h2 className="font-display text-xl text-primary mb-6">SEND A MESSAGE</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase block mb-1.5">
                            Your Name
                          </label>
                          <input type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe" className="contact-input" />
                        </div>
                        <div>
                          <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase block mb-1.5">
                            Email Address
                          </label>
                          <input type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" className="contact-input" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold tracking-wide text-muted-foreground uppercase block mb-1.5">
                          Your Message
                        </label>
                        <textarea value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us about a recipe, a spice question, or just say hi..."
                          rows={6} className="contact-textarea" />
                      </div>

                      {error && (
                        <p className="text-sm font-medium" style={{ color: "hsl(var(--destructive))" }}>
                          {error}
                        </p>
                      )}

                      <Button variant="hero" className="w-full h-12" onClick={handleSend}
                        disabled={sending || !name.trim() || !email.trim() || !message.trim()}>
                        {sending ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />SENDING...</>
                        ) : (
                          <><Mail className="w-4 h-4 mr-2" />SEND MESSAGE</>
                        )}
                      </Button>

                      <p className="p-xs text-center text-muted-foreground">
                        We'll never share your details with anyone.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
};
export default Contact;