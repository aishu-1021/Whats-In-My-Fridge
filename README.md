<div align="center">

# 🧊 What's In My Fridge?
### India's Smartest Recipe Finder

**Turn your leftover ingredients into delicious Indian street food.**
No waste. Just taste.

![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red)
![Built in Bangalore](https://img.shields.io/badge/Built%20in-Bangalore%2C%20India-orange)
![React](https://img.shields.io/badge/React-18-blue)
![Flask](https://img.shields.io/badge/Flask-Python-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

## 📖 About

**What's In My Fridge?** was born out of a frustrating evening - parents out of town, a sad collection of random vegetables in the fridge, and absolutely no idea what to cook.

This app solves exactly that problem. Tell it what you have, and it finds Indian recipes you can actually make - right now, with what's already in your kitchen.

---

## ✨ Features

- 🔍 **Smart Recipe Search**: Enter your ingredients and get matched Indian recipes instantly
- 🧅 **Pantry Setup**: Save your pantry staples so they're always included in searches
- ❤️ **Save Recipes**: Bookmark your favourite recipes for later
- 🛒 **Bazaar List**: Automatically tracks missing ingredients as a shopping list
- 📱 **WhatsApp Share**: Send your shopping list directly to WhatsApp
- 🖨️ **Print List**: Print your Bazaar list for offline shopping
- 👤 **User Profiles**: Customise your taste preferences, spice level, and cuisine mood
- 🔐 **Auth System**: Full login/signup with JWT authentication
- 🔑 **Forgot Password**: OTP-based password reset via email
- 🌶️ **Dietary Filters**: Filter by Vegetarian, Non-Veg, Vegan, Gluten-Free, Spicy, Sweet, Under 30 mins
- 📬 **Contact Form**: Reach out via the built-in contact form (powered by EmailJS)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Navigation |
| EmailJS | Contact form emails |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Python + Flask | REST API server |
| SQLite | Database |
| Flask-Bcrypt | Password hashing |
| PyJWT | Authentication tokens |
| smtplib | OTP emails via Gmail |
| Spoonacular API | Recipe data |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Spoonacular API key (free at [spoonacular.com](https://spoonacular.com/food-api))
- A Gmail account with App Password enabled

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Whats-In-My-Fridge.git
cd Whats-In-My-Fridge
```

---

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
# Frontend — Vite
VITE_API_URL=http://localhost:5000
VITE_EJS_SERVICE=your_emailjs_service_id
VITE_EJS_TEMPLATE=your_emailjs_template_id
VITE_EJS_KEY=your_emailjs_public_key

# Backend — Flask
SPOONACULAR_API_KEY=your_spoonacular_api_key
JWT_SECRET_KEY=your_super_secret_jwt_key
GMAIL_APP_PASSWORD=your_gmail_app_password
```

> 💡 See `.env.example` for reference. Never commit your `.env` file.

---

### 3. Install frontend dependencies

```bash
npm install
```

---

### 4. Install backend dependencies

```bash
pip install flask flask-cors flask-bcrypt pyjwt requests python-dotenv
```

---

### 5. Start the backend

```bash
python Backend.py
```

You should see:
```
✅ Database initialised at: .../fridge.db
 * Running on http://127.0.0.1:5000
```

---

### 6. Start the frontend

In a new terminal:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Project Structure

```
Whats-In-My-Fridge/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── FloatingEmojis.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RecipeCard.tsx
│   ├── contexts/
│   │   └── AppContext.tsx    # Global state management
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Auth.tsx          # Login + Signup + Forgot Password
│   │   ├── Bazaar.tsx        # Shopping list
│   │   ├── Contact.tsx
│   │   ├── Index.tsx         # Landing page
│   │   ├── NotFound.tsx
│   │   ├── Pantry.tsx        # Pantry setup
│   │   ├── Preferences.tsx
│   │   ├── Profile.tsx
│   │   ├── RecipeDetail.tsx
│   │   ├── Results.tsx       # Recipe search results
│   │   └── Saved.tsx         # Saved recipes
│   ├── App.tsx
│   └── main.tsx
├── Backend.py                # Flask REST API
├── Api.py                    # Standalone CLI prototype
├── fridge.db                 # SQLite database (auto-generated)
├── .env                      # Environment variables (never commit)
├── .env.example              # Safe reference template
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| POST | `/auth/forgot-password` | Send OTP to email |
| POST | `/auth/verify-otp` | Verify OTP code |
| POST | `/auth/reset-password` | Reset password |
| DELETE | `/auth/delete-account` | Delete account |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recipes?ingredients=...` | Search recipes by ingredients |
| GET | `/recipes/:id` | Get recipe details |

### Pantry
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pantry` | Get user's pantry |
| POST | `/pantry` | Save pantry items |

### Saved Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/saved` | Get saved recipes |
| POST | `/saved` | Save a recipe |
| DELETE | `/saved/:id` | Remove saved recipe |

### Bazaar
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bazaar` | Get shopping list |
| POST | `/bazaar` | Add items |
| PATCH | `/bazaar/:id` | Toggle bought status |
| DELETE | `/bazaar/:id` | Remove item |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get profile |
| POST | `/profile` | Save profile |

---

## 🔐 Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `VITE_API_URL` | Frontend | Backend URL |
| `VITE_EJS_SERVICE` | Frontend | EmailJS Service ID |
| `VITE_EJS_TEMPLATE` | Frontend | EmailJS Template ID |
| `VITE_EJS_KEY` | Frontend | EmailJS Public Key |
| `SPOONACULAR_API_KEY` | Backend | Spoonacular recipe API key |
| `JWT_SECRET_KEY` | Backend | JWT signing secret |
| `GMAIL_APP_PASSWORD` | Backend | Gmail App Password for OTP emails |

---

## 🧑‍🍳 The Builder

**Aishwarya Aiyandra Sujith**
*Founder, Designer & Developer*

Built this entirely from scratch - frontend, backend, database, and design.
What started as a frustrated evening staring at an empty fridge turned into a full-stack app.
Proud of every line of it.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ in Bangalore, India**

*© 2026 What's In My Fridge? All rights reserved.*

</div>