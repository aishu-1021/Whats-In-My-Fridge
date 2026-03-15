import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { User, ThumbsUp, X, Camera, Pencil } from "lucide-react";

const cuisineOptions = ["North Indian", "South Indian", "Street Food", "Indo-Chinese", "Healthy Fits", "Desserts"];

const Profile = () => {
  const { savedRecipes, pantryItems, bazaarList, profile, saveProfile, user, logout, token } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account and all your data.")) return;
    try {
      await fetch("http://localhost:5000/auth/delete-account", {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch {
      alert("Failed to delete account. Please try again.");
    }
  };

  const [showModal,     setShowModal]     = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Taste preferences
  const [vegToggle,    setVegToggle]    = useState(false);
  const [nonVegToggle, setNonVegToggle] = useState(true);
  const [veganToggle,  setVeganToggle]  = useState(false);
  const [gfToggle,     setGfToggle]     = useState(false);
  const [spiceLevel,   setSpiceLevel]   = useState(3);
  const [cuisineMoods, setCuisineMoods] = useState<string[]>([]);

  // Edit profile fields
  const [editName,      setEditName]      = useState("");
  const [editHandle,    setEditHandle]    = useState("");
  const [editBio,       setEditBio]       = useState("");
  const [editAvatar,    setEditAvatar]    = useState<string>("");
  const [avatarSaving,  setAvatarSaving]  = useState(false);

  useEffect(() => {
    if (profile) {
      setVegToggle(profile.is_vegetarian);
      setNonVegToggle(profile.is_non_vegetarian);
      setVeganToggle(profile.is_vegan);
      setGfToggle(profile.is_gluten_free);
      setSpiceLevel(profile.spice_level);
      setCuisineMoods(profile.cuisine_moods || []);
      setEditName(profile.username || "");
      setEditHandle(profile.handle || "");
      setEditBio(profile.bio || "");
      setEditAvatar(profile.avatar || "");
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleCuisine = (mood: string) => {
    const updated = (cuisineMoods || []).includes(mood)
      ? cuisineMoods.filter((m) => m !== mood)
      : [...(cuisineMoods || []), mood];
    setCuisineMoods(updated);
  };

  const handleSave = async () => {
    await saveProfile({
      username:          profile?.username  || "Chef Foodie",
      handle:            profile?.handle    || "@cheffoodie",
      bio:               profile?.bio       || "",
      avatar:            profile?.avatar    || "",
      is_vegetarian:     vegToggle,
      is_non_vegetarian: nonVegToggle,
      is_vegan:          veganToggle,
      is_gluten_free:    gfToggle,
      spice_level:       spiceLevel,
      cuisine_moods:     cuisineMoods || [],
    });
    setShowModal(true);
  };

  const handleEditSave = async () => {
    setAvatarSaving(true);
    await saveProfile({
      username:          editName,
      handle:            editHandle,
      bio:               editBio,
      avatar:            editAvatar,
      is_vegetarian:     vegToggle,
      is_non_vegetarian: nonVegToggle,
      is_vegan:          veganToggle,
      is_gluten_free:    gfToggle,
      spice_level:       spiceLevel,
      cuisine_moods:     cuisineMoods || [],
    });
    setAvatarSaving(false);
    setShowEditModal(false);
    setShowModal(true);
  };

  const displayAvatar = profile?.avatar || "";

  return (
    <>
      <style>{`
        .ep-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: epFadeIn 0.2s ease both;
        }
        @keyframes epFadeIn { from{opacity:0} to{opacity:1} }

        .ep-modal {
          background: white;
          border-radius: 20px;
          width: 100%; max-width: 460px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          overflow: hidden;
          animation: epSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes epSlideUp {
          from{opacity:0;transform:translateY(24px) scale(0.97)}
          to  {opacity:1;transform:translateY(0)    scale(1)   }
        }

        .ep-header {
          background: hsl(var(--primary));
          padding: 20px 24px 16px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 1;
        }
        .ep-header-title {
          font-family: "Boogaloo", cursive;
          font-size: 22px; color: white; letter-spacing: 0.5px;
        }
        .ep-close {
          background: rgba(255,255,255,0.2); border: none; border-radius: 50%;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.15s; color: white;
        }
        .ep-close:hover { background: rgba(255,255,255,0.35); }

        .ep-avatar-section {
          display: flex; flex-direction: column; align-items: center;
          padding: 24px 24px 0; gap: 10px;
        }
        .ep-avatar-ring {
          width: 88px; height: 88px; border-radius: 50%;
          position: relative; cursor: pointer;
          border: 3px solid hsl(var(--primary) / 0.2);
          transition: border-color 0.2s;
        }
        .ep-avatar-ring:hover { border-color: hsl(var(--primary)); }
        .ep-avatar-img {
          width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
        }
        .ep-avatar-placeholder {
          width: 100%; height: 100%; border-radius: 50%;
          background: hsl(var(--primary) / 0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .ep-camera-badge {
          position: absolute; bottom: 0; right: 0;
          width: 28px; height: 28px; border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid white;
          display: flex; align-items: center; justify-content: center;
          color: white;
          transition: transform 0.2s;
        }
        .ep-avatar-ring:hover .ep-camera-badge { transform: scale(1.12); }
        .ep-avatar-hint {
          font-size: 11.5px; color: #999; font-weight: 600; letter-spacing: 0.3px;
        }

        .ep-body {
          padding: 20px 24px 8px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .ep-field-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; color: #888; margin-bottom: 5px;
        }
        .ep-input {
          width: 100%; border: 1.5px solid #E0D6C2; border-radius: 10px;
          padding: 10px 14px; font-size: 14px; font-weight: 600; color: #222;
          font-family: inherit; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s; background: white;
        }
        .ep-input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
        }
        .ep-textarea { resize: none; height: 80px; }

        .ep-actions {
          display: flex; gap: 10px; padding: 16px 24px 24px;
        }
        .ep-btn-cancel {
          flex: 1; border: 2px solid #E0D6C2; background: white;
          border-radius: 10px; padding: 11px;
          font-family: "Boogaloo", cursive; font-size: 15px;
          letter-spacing: 0.4px; color: #666; cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .ep-btn-cancel:hover { border-color: #aaa; color: #333; }
        .ep-btn-save {
          flex: 2; background: hsl(var(--primary)); border: none;
          border-radius: 10px; padding: 11px;
          font-family: "Boogaloo", cursive; font-size: 15px;
          letter-spacing: 0.4px; color: white; cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .ep-btn-save:disabled { opacity: 0.65; cursor: not-allowed; }
        .ep-btn-save:not(:disabled):hover {
          background: hsl(var(--primary) / 0.88); transform: scale(1.02);
        }

        .ep-trigger {
          background: none; border: 1.5px solid hsl(var(--primary) / 0.4);
          border-radius: 50px; padding: 4px 14px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
          color: hsl(var(--primary)); cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 6px; transition: background 0.15s, border-color 0.15s;
          font-family: inherit;
        }
        .ep-trigger:hover {
          background: hsl(var(--primary) / 0.07);
          border-color: hsl(var(--primary));
        }

        .profile-avatar-wrap {
          width: 96px; height: 96px; border-radius: 50%;
          overflow: hidden; margin: 0 auto 12px;
          border: 3px solid hsl(var(--primary) / 0.2);
        }
        .profile-avatar-wrap img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .profile-avatar-placeholder {
          width: 100%; height: 100%;
          background: hsl(var(--primary) / 0.1);
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background py-12">
          <div className="container mx-auto px-4 max-w-2xl">

            {/* ── Avatar + Name ── */}
            <div className="text-center mb-8">
              <div className="profile-avatar-wrap">
                {displayAvatar
                  ? <img src={displayAvatar} alt="Profile" />
                  : <div className="profile-avatar-placeholder">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                }
              </div>
              <h2 className="font-display text-2xl">{profile?.username || user?.username}</h2>
              <p className="text-muted-foreground text-sm">{profile?.handle || "@cheffoodie"}</p>
              {profile?.bio && (
                <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto italic">
                  {profile.bio}
                </p>
              )}
              <button className="ep-trigger" onClick={() => setShowEditModal(true)}>
                <Pencil size={11} strokeWidth={2.5} />
                EDIT PROFILE
              </button>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
                <p className="font-display text-3xl text-primary">{savedRecipes.length}</p>
                <p className="text-xs text-muted-foreground font-bold">Recipes Saved</p>
              </div>
              <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
                <p className="font-display text-3xl text-primary">{pantryItems.length}</p>
                <p className="text-xs text-muted-foreground font-bold">Pantry Items</p>
              </div>
              <div className="bg-card border-2 border-border rounded-2xl p-4 text-center">
                <p className="font-display text-3xl text-primary">{bazaarList.length}</p>
                <p className="text-xs text-muted-foreground font-bold">Bazaar Items</p>
              </div>
            </div>

            {/* ── Taste Preferences ── */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 mb-6">
              <h3 className="font-display text-xl text-primary mb-4">TASTE PREFERENCES</h3>
              {[
                { label: "Vegetarian",     value: vegToggle,    set: setVegToggle    },
                { label: "Non-Vegetarian", value: nonVegToggle, set: setNonVegToggle },
                { label: "Vegan",          value: veganToggle,  set: setVeganToggle  },
                { label: "Gluten-Free",    value: gfToggle,     set: setGfToggle     },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-bold text-sm">{item.label}</span>
                  <button
                    onClick={() => item.set(!item.value)}
                    className={`w-12 h-7 rounded-full transition-colors ${item.value ? "bg-accent" : "bg-muted"}`}
                  >
                    <div className={`w-5 h-5 bg-card rounded-full shadow transition-transform ${item.value ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* ── Spice Level ── */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 mb-6">
              <h3 className="font-display text-xl text-primary mb-4">SPICE LEVEL</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm">🧊 Mild</span>
                <input
                  type="range" min={1} max={5} value={spiceLevel}
                  onChange={(e) => setSpiceLevel(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm">🌋 Volcano</span>
              </div>
            </div>

            {/* ── Cuisine Mood ── */}
            <div className="bg-card border-2 border-border rounded-2xl p-6 mb-8">
              <h3 className="font-display text-xl text-primary mb-4">CUISINE MOOD</h3>
              <div className="flex flex-wrap gap-2">
                {cuisineOptions.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => toggleCuisine(mood)}
                    className={`font-bold text-sm px-4 py-2 rounded-full border-2 transition-colors ${
                      (cuisineMoods || []).includes(mood)
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleSave}>
              SAVE CHANGES →
            </Button>
            <Button
              variant="outline"
              className="w-full mt-3 border-2 border-red-300 text-red-500 hover:bg-red-50 rounded-full font-bold"
              onClick={handleDeleteAccount}
            >
              DELETE MY ACCOUNT
            </Button>
          </div>
        </main>
        <Footer />

        {/* ── Success modal ── */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl p-10 text-center max-w-sm mx-4 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-10 h-10 text-accent" />
              </div>
              <h2 className="font-display text-3xl text-primary mb-2">SHABASH!</h2>
              <p className="text-muted-foreground mb-6">Your profile is updated and ready to cook!</p>
              <Button variant="hero" onClick={() => setShowModal(false)}>BACK TO KITCHEN →</Button>
            </div>
          </div>
        )}

        {/* ── Edit Profile modal ── */}
        {showEditModal && (
          <div className="ep-overlay" onClick={() => setShowEditModal(false)}>
            <div className="ep-modal" onClick={(e) => e.stopPropagation()}>

              <div className="ep-header">
                <span className="ep-header-title">EDIT PROFILE</span>
                <button className="ep-close" onClick={() => setShowEditModal(false)}>
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              <div className="ep-avatar-section">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div
                  className="ep-avatar-ring"
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to change photo"
                >
                  {editAvatar
                    ? <img src={editAvatar} alt="Preview" className="ep-avatar-img" />
                    : <div className="ep-avatar-placeholder">
                        <User size={38} style={{ color: "hsl(var(--primary))" }} />
                      </div>
                  }
                  <div className="ep-camera-badge">
                    <Camera size={13} strokeWidth={2.5} />
                  </div>
                </div>
                <p className="ep-avatar-hint">Click photo to change · Max 2 MB</p>
              </div>

              <div className="ep-body">
                <div>
                  <p className="ep-field-label">Full Name</p>
                  <input
                    className="ep-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <p className="ep-field-label">Handle</p>
                  <input
                    className="ep-input"
                    value={editHandle}
                    onChange={(e) => setEditHandle(e.target.value)}
                    placeholder="@yourhandle"
                  />
                </div>
                <div>
                  <p className="ep-field-label">Bio</p>
                  <textarea
                    className="ep-input ep-textarea"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="A little something about you..."
                  />
                </div>
              </div>

              <div className="ep-actions">
                <button className="ep-btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button
                  className="ep-btn-save"
                  onClick={handleEditSave}
                  disabled={avatarSaving}
                >
                  {avatarSaving ? "Saving..." : "SAVE CHANGES →"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Profile;