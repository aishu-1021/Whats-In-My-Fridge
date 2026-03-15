from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import requests
import sqlite3
import json
import os
import jwt
import datetime
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
bcrypt = Bcrypt(app)

# ── All secrets loaded from .env ─────────────────────────────────────────────
API_KEY    = os.environ.get("SPOONACULAR_API_KEY", "")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "whats_in_my_fridge_secret_2026")
BASE_URL   = "https://api.spoonacular.com"

DB_PATH = os.path.join(os.path.dirname(__file__), "fridge.db")

VEGETARIAN_EXCLUDE = "egg,eggs,chicken,beef,pork,lamb,fish,shrimp,mutton,turkey,bacon,sausage,prawn,crab,lobster,tuna,salmon,ham,meat,steak,mince,keema"

INDIAN_CUISINES = "indian"

WESTERN_TITLE_EXCLUDE = [
    "french fries", "vichyssoise", "sauerkraut", "penne", "spaghetti",
    "pasta", "pizza", "lasagna", "risotto", "quiche", "frittata",
    "casserole", "pot pie", "gnocchi", "bravas", "brabant", "hasselback",
    "knish", "pudding", "cupcake", "brownie", "muffin", "waffle",
    "pancake", "crepe", "croissant", "baguette", "focaccia", "calzone",
    "taco", "burrito", "quesadilla", "nachos", "fajita", "enchilada",
    "sushi", "ramen", "pho", "kimchi", "schnitzel", "bratwurst",
    "paella", "moussaka", "gyros", "hummus", "falafel", "shawarma",
    "ceviche", "empanada", "pierogi", "stroganoff", "goulash",
    "chowder", "bisque", "bouillabaisse", "coq au vin", "beef bourguignon",
    "bacon", "ham", "prosciutto", "salami", "pepperoni",
]

# ── Gmail config ─────────────────────────────────────────────────────────────
GMAIL_USER         = "noreply.whatsinmyfridge@gmail.com"
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

def is_western(title: str) -> bool:
    title_lower = title.lower()
    return any(keyword in title_lower for keyword in WESTERN_TITLE_EXCLUDE)


# -------------------------------------------------------
# CORS PREFLIGHT HANDLER
# -------------------------------------------------------

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers["Access-Control-Allow-Origin"]  = "*"
        res.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        res.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        return res


# -------------------------------------------------------
# DATABASE SETUP
# -------------------------------------------------------

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pantry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            ingredient TEXT NOT NULL,
            UNIQUE(user_id, ingredient)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            username TEXT DEFAULT 'Chef Foodie',
            handle TEXT DEFAULT '@cheffoodie',
            bio TEXT DEFAULT '',
            avatar TEXT DEFAULT '',
            is_vegetarian INTEGER DEFAULT 0,
            is_vegan INTEGER DEFAULT 0,
            is_gluten_free INTEGER DEFAULT 0,
            is_non_vegetarian INTEGER DEFAULT 1,
            spice_level INTEGER DEFAULT 3,
            cuisine_moods TEXT DEFAULT '[]'
        )
    """)

    try:
        cursor.execute("ALTER TABLE profile ADD COLUMN bio TEXT DEFAULT ''")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE profile ADD COLUMN avatar TEXT DEFAULT ''")
    except sqlite3.OperationalError:
        pass

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            recipe_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            image TEXT,
            used_count INTEGER DEFAULT 0,
            missed_count INTEGER DEFAULT 0,
            missed_ingredients TEXT DEFAULT '[]',
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, recipe_id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bazaar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            ingredient TEXT NOT NULL,
            is_bought INTEGER DEFAULT 0,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS otp_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            otp TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialised at:", DB_PATH)


# -------------------------------------------------------
# AUTH HELPERS
# -------------------------------------------------------

def get_current_user():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("user_id")
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


# -------------------------------------------------------
# EMAIL HELPER
# -------------------------------------------------------

def send_otp_email(to_email: str, otp: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your What's In My Fridge? Password Reset OTP"
    msg["From"]    = GMAIL_USER
    msg["To"]      = to_email

    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;
                background:#fff8f0;border-radius:16px;border:2px solid #f5e0d0;">
      <div style="background:#c0392b;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <h1 style="color:white;font-size:22px;margin:0;letter-spacing:1px;">
          WHAT'S IN MY FRIDGE?
        </h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">
          Password Reset Request
        </p>
      </div>
      <p style="color:#333;font-size:15px;margin-bottom:8px;">
        Hey Chef! 👋 Use the OTP below to reset your password.
      </p>
      <p style="color:#666;font-size:13px;margin-bottom:24px;">
        This code expires in <strong>10 minutes</strong>.
        If you didn't request this, ignore this email.
      </p>
      <div style="background:#c0392b;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,0.8);font-size:12px;margin:0 0 8px;letter-spacing:2px;">
          YOUR OTP CODE
        </p>
        <h2 style="color:white;font-size:42px;letter-spacing:12px;margin:0;font-weight:900;">
          {otp}
        </h2>
      </div>
      <p style="color:#999;font-size:12px;text-align:center;">
        Made with ❤️ in Bangalore, India
      </p>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_USER, to_email, msg.as_string())


# -------------------------------------------------------
# AUTH ROUTES
# -------------------------------------------------------

@app.route("/auth/register", methods=["POST"])
def register():
    data     = request.get_json()
    username = data.get("username", "").strip()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")

    conn = get_db()
    try:
        cursor = conn.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed)
        )
        user_id = cursor.lastrowid
        conn.execute(
            "INSERT INTO profile (user_id, username, handle) VALUES (?, ?, ?)",
            (user_id, username, f"@{username.lower().replace(' ', '')}")
        )
        conn.commit()

        token = jwt.encode({
            "user_id": user_id,
            "email":   email,
            "exp":     datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "message": "Account created!",
            "token":   token,
            "user":    {"id": user_id, "username": username, "email": email}
        }), 201

    except sqlite3.IntegrityError:
        return jsonify({"error": "An account with this email already exists"}), 409
    finally:
        conn.close()


@app.route("/auth/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode({
        "user_id": user["id"],
        "email":   user["email"],
        "exp":     datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Login successful!",
        "token":   token,
        "user":    {"id": user["id"], "username": user["username"], "email": user["email"]}
    })


@app.route("/auth/me", methods=["GET"])
def get_me():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    user = conn.execute("SELECT id, username, email FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user["id"], "username": user["username"], "email": user["email"]})


# -------------------------------------------------------
# FORGOT PASSWORD — OTP ROUTES
# -------------------------------------------------------

@app.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    data  = request.get_json()
    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()

    if not user:
        return jsonify({"message": "If this email exists, an OTP has been sent."}), 200

    otp        = str(random.randint(100000, 999999))
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

    conn = get_db()
    conn.execute("DELETE FROM otp_codes WHERE email = ?", (email,))
    conn.execute(
        "INSERT INTO otp_codes (email, otp, expires_at) VALUES (?, ?, ?)",
        (email, otp, expires_at)
    )
    conn.commit()
    conn.close()

    try:
        send_otp_email(email, otp)
    except Exception as e:
        print("Email error:", e)
        return jsonify({"error": "Failed to send OTP email. Please try again."}), 500

    return jsonify({"message": "OTP sent successfully!"}), 200


@app.route("/auth/verify-otp", methods=["POST"])
def verify_otp():
    data  = request.get_json()
    email = data.get("email", "").strip().lower()
    otp   = data.get("otp", "").strip()

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    conn   = get_db()
    record = conn.execute(
        "SELECT * FROM otp_codes WHERE email = ? AND used = 0 ORDER BY id DESC LIMIT 1",
        (email,)
    ).fetchone()
    conn.close()

    if not record:
        return jsonify({"error": "No OTP found for this email."}), 400

    try:
        expires_at = datetime.datetime.strptime(record["expires_at"], "%Y-%m-%d %H:%M:%S.%f")
    except ValueError:
        expires_at = datetime.datetime.strptime(record["expires_at"], "%Y-%m-%d %H:%M:%S")

    if datetime.datetime.utcnow() > expires_at:
        return jsonify({"error": "OTP has expired. Please request a new one."}), 400

    if record["otp"] != otp:
        return jsonify({"error": "Incorrect OTP. Please try again."}), 400

    conn = get_db()
    conn.execute("UPDATE otp_codes SET used = 1 WHERE id = ?", (record["id"],))
    conn.commit()
    conn.close()

    return jsonify({"message": "OTP verified!"}), 200


@app.route("/auth/reset-password", methods=["POST"])
def reset_password():
    data     = request.get_json()
    email    = data.get("email", "").strip().lower()
    otp      = data.get("otp", "").strip()
    password = data.get("password", "")

    if not email or not otp or not password:
        return jsonify({"error": "All fields are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    conn   = get_db()
    record = conn.execute(
        "SELECT * FROM otp_codes WHERE email = ? AND otp = ? AND used = 1 ORDER BY id DESC LIMIT 1",
        (email, otp)
    ).fetchone()
    conn.close()

    if not record:
        return jsonify({"error": "Invalid or unverified OTP."}), 400

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    conn   = get_db()
    conn.execute("UPDATE users SET password = ? WHERE email = ?", (hashed, email))
    conn.execute("DELETE FROM otp_codes WHERE email = ?", (email,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Password reset successfully!"}), 200


# -------------------------------------------------------
# RECIPE ROUTES
# -------------------------------------------------------

@app.route("/recipes", methods=["GET"])
def get_recipes():
    ingredients = request.args.get("ingredients", "")
    number      = int(request.args.get("number", 20))
    diet        = request.args.get("diet", "")

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    user_id = get_current_user()
    pantry_ingredients = []
    if user_id:
        conn = get_db()
        rows = conn.execute("SELECT ingredient FROM pantry WHERE user_id = ?", (user_id,)).fetchall()
        conn.close()
        pantry_ingredients = [row["ingredient"] for row in rows]

    all_ingredients = ",".join([i.strip() for i in ingredients.split(",")])
    if pantry_ingredients:
        all_ingredients = all_ingredients + "," + ",".join(pantry_ingredients)

    if diet == "vegetarian":
        response = requests.get(f"{BASE_URL}/recipes/complexSearch", params={
            "apiKey":               API_KEY,
            "includeIngredients":   all_ingredients,
            "excludeIngredients":   VEGETARIAN_EXCLUDE,
            "diet":                 "vegetarian",
            "cuisine":              INDIAN_CUISINES,
            "number":               min(number, 50),
            "addRecipeInformation": False,
            "fillIngredients":      True,
            "ranking":              2,
        })
        if response.status_code == 200:
            results = response.json().get("results", [])
            shaped  = [
                {
                    "id":                    r["id"],
                    "title":                 r["title"],
                    "image":                 r.get("image", ""),
                    "usedIngredientCount":   r.get("usedIngredientCount", 0),
                    "missedIngredientCount": r.get("missedIngredientCount", 0),
                    "missedIngredients":     r.get("missedIngredients", []),
                }
                for r in results
                if not is_western(r["title"])
            ]
            return jsonify(shaped)
        else:
            return jsonify({"error": "Failed to fetch vegetarian recipes"}), 500

    response = requests.get(f"{BASE_URL}/recipes/complexSearch", params={
        "apiKey":               API_KEY,
        "includeIngredients":   all_ingredients,
        "cuisine":              INDIAN_CUISINES,
        "number":               min(number, 50),
        "addRecipeInformation": False,
        "fillIngredients":      True,
        "ranking":              2,
        "ignorePantry":         True,
    })

    if response.status_code == 200:
        results = response.json().get("results", [])
        shaped  = [
            {
                "id":                    r["id"],
                "title":                 r["title"],
                "image":                 r.get("image", ""),
                "usedIngredientCount":   r.get("usedIngredientCount", 0),
                "missedIngredientCount": r.get("missedIngredientCount", 0),
                "missedIngredients":     r.get("missedIngredients", []),
            }
            for r in results
            if not is_western(r["title"])
        ]
        return jsonify(shaped)
    else:
        return jsonify({"error": "Failed to fetch recipes"}), 500


@app.route("/recipes/<int:recipe_id>", methods=["GET"])
def get_recipe_details(recipe_id):
    response = requests.get(f"{BASE_URL}/recipes/{recipe_id}/information", params={
        "apiKey":           API_KEY,
        "includeNutrition": False
    })
    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({"error": "Failed to fetch recipe details"}), 500


# -------------------------------------------------------
# PANTRY ROUTES
# -------------------------------------------------------

@app.route("/pantry", methods=["GET"])
def get_pantry():
    user_id = get_current_user()
    if not user_id:
        return jsonify([])
    conn = get_db()
    rows = conn.execute("SELECT ingredient FROM pantry WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([row["ingredient"] for row in rows])


@app.route("/pantry", methods=["POST"])
def save_pantry():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data        = request.get_json()
    ingredients = data.get("ingredients", [])
    conn        = get_db()
    conn.execute("DELETE FROM pantry WHERE user_id = ?", (user_id,))
    for ingredient in ingredients:
        if ingredient.strip():
            conn.execute(
                "INSERT OR IGNORE INTO pantry (user_id, ingredient) VALUES (?, ?)",
                (user_id, ingredient.strip().lower())
            )
    conn.commit()
    conn.close()
    return jsonify({"message": "Pantry saved!"})


# -------------------------------------------------------
# PROFILE ROUTES
# -------------------------------------------------------

@app.route("/profile", methods=["GET"])
def get_profile():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    row  = conn.execute("SELECT * FROM profile WHERE user_id = ?", (user_id,)).fetchone()
    conn.close()

    if row:
        return jsonify({
            "username":          row["username"],
            "handle":            row["handle"],
            "bio":               row["bio"] or "",
            "avatar":            row["avatar"] or "",
            "is_vegetarian":     bool(row["is_vegetarian"]),
            "is_vegan":          bool(row["is_vegan"]),
            "is_gluten_free":    bool(row["is_gluten_free"]),
            "is_non_vegetarian": bool(row["is_non_vegetarian"]),
            "spice_level":       row["spice_level"],
            "cuisine_moods":     json.loads(row["cuisine_moods"])
        })

    return jsonify({"error": "Profile not found"}), 404


@app.route("/profile", methods=["POST"])
def save_profile():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    conn = get_db()
    conn.execute("""
        INSERT INTO profile (
            user_id, username, handle, bio, avatar,
            is_vegetarian, is_vegan, is_gluten_free,
            is_non_vegetarian, spice_level, cuisine_moods
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            username          = excluded.username,
            handle            = excluded.handle,
            bio               = excluded.bio,
            avatar            = excluded.avatar,
            is_vegetarian     = excluded.is_vegetarian,
            is_vegan          = excluded.is_vegan,
            is_gluten_free    = excluded.is_gluten_free,
            is_non_vegetarian = excluded.is_non_vegetarian,
            spice_level       = excluded.spice_level,
            cuisine_moods     = excluded.cuisine_moods
    """, (
        user_id,
        data.get("username", "Chef Foodie"),
        data.get("handle",   "@cheffoodie"),
        data.get("bio",      ""),
        data.get("avatar",   ""),
        int(data.get("is_vegetarian",     False)),
        int(data.get("is_vegan",          False)),
        int(data.get("is_gluten_free",    False)),
        int(data.get("is_non_vegetarian", True)),
        data.get("spice_level",   3),
        json.dumps(data.get("cuisine_moods", []))
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Profile saved!"})


# -------------------------------------------------------
# SAVED RECIPES
# -------------------------------------------------------

@app.route("/saved", methods=["GET"])
def get_saved_recipes():
    user_id = get_current_user()
    if not user_id:
        return jsonify([])

    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM saved_recipes WHERE user_id = ? ORDER BY saved_at DESC", (user_id,)
    ).fetchall()
    conn.close()

    return jsonify([{
        "id":                    row["recipe_id"],
        "title":                 row["title"],
        "image":                 row["image"],
        "usedIngredientCount":   row["used_count"],
        "missedIngredientCount": row["missed_count"],
        "missedIngredients":     json.loads(row["missed_ingredients"]),
        "saved_at":              row["saved_at"]
    } for row in rows])


@app.route("/saved", methods=["POST"])
def save_recipe():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    conn = get_db()
    try:
        conn.execute("""
            INSERT OR IGNORE INTO saved_recipes
            (user_id, recipe_id, title, image, used_count, missed_count, missed_ingredients)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id, data["id"], data["title"], data.get("image", ""),
            data.get("usedIngredientCount",  0),
            data.get("missedIngredientCount", 0),
            json.dumps(data.get("missedIngredients", []))
        ))
        conn.commit()
    finally:
        conn.close()
    return jsonify({"message": "Recipe saved!"})


@app.route("/saved/<int:recipe_id>", methods=["DELETE"])
def unsave_recipe(recipe_id):
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    conn.execute("DELETE FROM saved_recipes WHERE user_id = ? AND recipe_id = ?", (user_id, recipe_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Recipe removed"})


# -------------------------------------------------------
# BAZAAR
# -------------------------------------------------------

@app.route("/bazaar", methods=["GET"])
def get_bazaar():
    user_id = get_current_user()
    if not user_id:
        return jsonify([])

    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM bazaar WHERE user_id = ? ORDER BY added_at DESC", (user_id,)
    ).fetchall()
    conn.close()
    return jsonify([{
        "id":         row["id"],
        "ingredient": row["ingredient"],
        "is_bought":  bool(row["is_bought"])
    } for row in rows])


@app.route("/bazaar", methods=["POST"])
def add_to_bazaar():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data        = request.get_json()
    ingredients = data.get("ingredients", [])
    conn        = get_db()
    for ingredient in ingredients:
        name = ingredient if isinstance(ingredient, str) else ingredient.get("name", "")
        if name.strip():
            conn.execute(
                "INSERT INTO bazaar (user_id, ingredient) VALUES (?, ?)",
                (user_id, name.strip().lower())
            )
    conn.commit()
    conn.close()
    return jsonify({"message": "Added to Bazaar!"})


@app.route("/bazaar/<int:item_id>", methods=["PATCH"])
def toggle_bazaar_item(item_id):
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    conn.execute("""
        UPDATE bazaar SET is_bought = CASE WHEN is_bought = 0 THEN 1 ELSE 0 END
        WHERE id = ? AND user_id = ?
    """, (item_id, user_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item updated"})


@app.route("/bazaar/<int:item_id>", methods=["DELETE"])
def delete_bazaar_item(item_id):
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    conn.execute("DELETE FROM bazaar WHERE id = ? AND user_id = ?", (item_id, user_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Item deleted"})


@app.route("/auth/delete-account", methods=["DELETE"])
def delete_account():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db()
    try:
        conn.execute("DELETE FROM pantry        WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM profile       WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM saved_recipes WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM bazaar        WHERE user_id = ?", (user_id,))
        conn.execute("DELETE FROM users         WHERE id = ?",      (user_id,))
        conn.commit()
        return jsonify({"message": "Account deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# ── Keep alive ping endpoint ─────────────────────────────────────────────────
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "alive", "message": "pinging..."}), 200
# -------------------------------------------------------
# Run the server
# -------------------------------------------------------

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)