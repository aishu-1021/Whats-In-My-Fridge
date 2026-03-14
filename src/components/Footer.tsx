import { Link } from "react-router-dom";
import { Refrigerator } from "lucide-react";

// ── Inline SVG social icons — no external dependency needed ──────────────────

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ── Social link wrapper ───────────────────────────────────────────────────────

const SocialLink = ({ href, label, children }: {
  href: string; label: string; children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    style={{
      width: 34, height: 34,
      borderRadius: "50%",
      border: "1.5px solid rgba(255,255,255,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "rgba(255,255,255,0.7)",
      transition: "color 0.18s, border-color 0.18s, background 0.18s, transform 0.18s",
      textDecoration: "none",
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLAnchorElement;
      el.style.color = "white";
      el.style.borderColor = "rgba(255,255,255,0.6)";
      el.style.background = "rgba(255,255,255,0.1)";
      el.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLAnchorElement;
      el.style.color = "rgba(255,255,255,0.7)";
      el.style.borderColor = "rgba(255,255,255,0.2)";
      el.style.background = "transparent";
      el.style.transform = "translateY(0)";
    }}
  >
    {children}
  </a>
);

// ── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="bg-navy text-navy-foreground pt-12 pb-6">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* Brand column */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Refrigerator className="w-6 h-6" />
          <span className="font-display text-lg">WHAT'S IN MY FRIDGE?</span>
        </div>
        <p className="text-sm opacity-80 leading-relaxed">
          Turn your leftover veggies into delicious Indian street food. Reduce waste, eat amazing.
        </p>

        {/* Social icons — proper SVGs, no emojis */}
        <div className="flex gap-2 mt-5">
          <SocialLink href="https://instagram.com" label="Instagram">
            <InstagramIcon />
          </SocialLink>
          <SocialLink href="https://twitter.com" label="Twitter / X">
            <TwitterXIcon />
          </SocialLink>
          <SocialLink href="https://youtube.com" label="YouTube">
            <YouTubeIcon />
          </SocialLink>
          <SocialLink href="https://linkedin.com" label="LinkedIn">
            <LinkedInIcon />
          </SocialLink>
        </div>
      </div>

      {/* Explore column */}
      <div>
        <h4 className="font-display text-lg mb-3">EXPLORE</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li><Link to="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
          <li><Link to="/results" className="hover:opacity-100 transition-opacity">Recipes</Link></li>
          <li><Link to="/saved" className="hover:opacity-100 transition-opacity">Saved Recipes</Link></li>
          <li><Link to="/bazaar" className="hover:opacity-100 transition-opacity">Bazaar List</Link></li>
          <li><Link to="/pantry" className="hover:opacity-100 transition-opacity">Pantry Setup</Link></li>
        </ul>
      </div>

      {/* Company column */}
      <div>
        <h4 className="font-display text-lg mb-3">COMPANY</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li><Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
          <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
          <li><span className="cursor-pointer hover:opacity-100 transition-opacity">Privacy Policy</span></li>
          <li><span className="cursor-pointer hover:opacity-100 transition-opacity">Terms of Service</span></li>
        </ul>
      </div>
    </div>

    {/* Bottom bar — removed pizza emoji */}
    <div className="container mx-auto px-4 mt-8 pt-6 border-t border-navy-foreground/20 text-center text-sm opacity-60">
      © 2026 What's in my Fridge? All rights reserved. Made with love in India.
    </div>
  </footer>
);
export default Footer;