import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Refrigerator, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";

const guestLinks = [
  { label: "HOME", path: "/" },
  { label: "HOW IT WORKS", path: "/#how-it-works" },
  { label: "TESTIMONIALS", path: "/#testimonials" },
  { label: "ABOUT", path: "/about" },
  { label: "CONTACT", path: "/contact" },
];

const appLinks = [
  { label: "HOME", path: "/" },
  { label: "RECIPES", path: "/results" },
  { label: "SAVED", path: "/saved" },
  { label: "BAZAAR", path: "/bazaar" },
  { label: "PANTRY", path: "/pantry" },
  { label: "PROFILE", path: "/profile" },
];

const getFirstName = (fullName?: string) => {
  if (!fullName) return "";
  return fullName.trim().split(" ")[0];
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = isLoggedIn ? appLinks : guestLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith("/#")) {
      e.preventDefault();
      const sectionId = path.replace("/#", "");
      if (location.pathname === "/") {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-4 border-primary">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">

        <Link to="/" className="flex items-center gap-2">
          <Refrigerator className="w-8 h-8 text-primary" />
          <span className="font-display text-xl text-primary tracking-wide">
            WHAT'S IN MY FRIDGE?
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className={`font-bold text-sm tracking-wide transition-colors hover:text-primary cursor-pointer ${
                location.pathname === link.path ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="font-bold text-sm text-primary">
                {getFirstName(user?.username)}
              </span>
              <Button
                variant="nav"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                LOGOUT
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5">
                  LOGIN
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="nav" size="sm">
                  GET STARTED →
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleNavClick(e, link.path)}
              className="block py-2 font-bold text-sm tracking-wide hover:text-primary cursor-pointer"
            >
              {link.label}
            </a>
          ))}

          {isLoggedIn ? (
            <div className="mt-2">
              <p className="text-sm font-bold text-primary mb-2">
                {getFirstName(user?.username)}
              </p>
              <Button
                variant="nav"
                size="sm"
                className="w-full flex items-center gap-1"
                onClick={() => { handleLogout(); setMobileOpen(false); }}
              >
                <LogOut className="w-4 h-4" />
                LOGOUT
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-2 border-primary text-primary font-bold rounded-full">
                  LOGIN
                </Button>
              </Link>
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="nav" size="sm" className="w-full">
                  GET STARTED →
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;