import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Refrigerator, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "RECIPES", path: "/results" },
  { label: "SAVED", path: "/saved" },
  { label: "BAZAAR", path: "/bazaar" },
  { label: "PANTRY", path: "/pantry" },
  { label: "PROFILE", path: "/profile" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-4 border-primary">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Refrigerator className="w-8 h-8 text-primary" />
          <span className="font-display text-xl text-primary tracking-wide">
            WHAT'S IN MY FRIDGE?
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-bold text-sm tracking-wide transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Link to="/auth">
            <Button variant="nav" size="sm">LOGIN</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block py-2 font-bold text-sm tracking-wide hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/auth" onClick={() => setMobileOpen(false)}>
            <Button variant="nav" size="sm" className="mt-2 w-full">LOGIN</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
