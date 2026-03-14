import streamlit as st
import requests
# -------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------
API_KEY = "bbfae80527924e32b258b731450d894b"  # Replace with your Spoonacular API key
BASE_URL = "https://api.spoonacular.com"

# -------------------------------------------------------
# PAGE SETUP
# -------------------------------------------------------

st.set_page_config(
    page_title="What's in my fridge?",
    page_icon="🧊",
    layout="centered"
)

# -------------------------------------------------------
# CUSTOM STYLING
# -------------------------------------------------------

st.markdown("""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500&display=swap');

        /* Overall background */
        .stApp {
            background-color: #FAFAF7;
            font-family: 'DM Sans', sans-serif;
        }

        /* Hide Streamlit default header/footer */
        #MainMenu, footer, header { visibility: hidden; }

        /* Hero title */
        .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            color: #1A1A1A;
            text-align: center;
            margin-bottom: 0.2rem;
            line-height: 1.2;
        }

        .hero-subtitle {
            font-family: 'DM Sans', sans-serif;
            font-size: 1.05rem;
            color: #777;
            text-align: center;
            margin-bottom: 2.5rem;
        }

        /* Ingredient tag pills */
        .tag-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 1rem 0;
        }
        .tag {
            background-color: #E8F5E9;
            color: #2E7D32;
            border-radius: 999px;
            padding: 4px 14px;
            font-size: 0.88rem;
            font-weight: 500;
            display: inline-block;
        }

        /* Recipe card */
        .recipe-card {
            background: #FFFFFF;
            border: 1px solid #EBEBEB;
            border-radius: 16px;
            padding: 1.4rem 1.6rem;
            margin-bottom: 1.2rem;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
            transition: box-shadow 0.2s;
        }
        .recipe-card:hover {
            box-shadow: 0 6px 24px rgba(0,0,0,0.09);
        }

        .recipe-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            color: #1A1A1A;
            margin-bottom: 0.5rem;
        }

        .badge-green {
            background: #E8F5E9;
            color: #2E7D32;
            padding: 3px 10px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-right: 6px;
        }
        .badge-red {
            background: #FDECEA;
            color: #C62828;
            padding: 3px 10px;
            border-radius: 999px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .missing-text {
            font-size: 0.85rem;
            color: #999;
            margin-top: 0.4rem;
        }

        /* Detail section */
        .detail-box {
            background: #FFFFFF;
            border: 1px solid #EBEBEB;
            border-radius: 16px;
            padding: 1.8rem;
            margin-top: 1.5rem;
            box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }

        .detail-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem;
            color: #1A1A1A;
            margin-bottom: 0.8rem;
        }

        .meta-row {
            display: flex;
            gap: 1.5rem;
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 1.2rem;
        }

        .divider {
            border: none;
            border-top: 1px solid #EBEBEB;
            margin: 1.2rem 0;
        }

        /* Button override */
        .stButton > button {
            background-color: #1A1A1A;
            color: white;
            border-radius: 999px;
            padding: 0.55rem 2rem;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.95rem;
            font-weight: 500;
            border: none;
            width: 100%;
            transition: background 0.2s;
        }
        .stButton > button:hover {
            background-color: #333;
            color: white;
        }

        /* Input field */
        .stTextInput > div > div > input {
            border-radius: 999px;
            border: 1.5px solid #DCDCDC;
            padding: 0.6rem 1.2rem;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.95rem;
            background: #fff;
        }
        .stTextInput > div > div > input:focus {
            border-color: #1A1A1A;
            box-shadow: none;
        }

        /* Selectbox */
        .stSelectbox > div > div {
            border-radius: 999px;
            border: 1.5px solid #DCDCDC;
            font-family: 'DM Sans', sans-serif;
        }

        /* Slider label */
        .stSlider label {
            font-family: 'DM Sans', sans-serif;
            font-size: 0.9rem;
            color: #555;
        }

    </style>
""", unsafe_allow_html=True)


# -------------------------------------------------------
# BACKEND FUNCTIONS
# -------------------------------------------------------

def find_recipes_by_ingredients(ingredients, number_of_results=5):
    """Calls Spoonacular to find recipes matching the given ingredients."""
    ingredients_str = ",".join(ingredients)
    url = f"{BASE_URL}/recipes/findByIngredients"
    params = {
        "apiKey": API_KEY,
        "ingredients": ingredients_str,
        "number": number_of_results,
        "ranking": 1,
        "ignorePantry": True
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        st.error(f"API error {response.status_code}: {response.text}")
        return []


def get_recipe_details(recipe_id):
    """Fetches full details for a specific recipe ID."""
    url = f"{BASE_URL}/recipes/{recipe_id}/information"
    params = {
        "apiKey": API_KEY,
        "includeNutrition": False
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    return None


# -------------------------------------------------------
# SESSION STATE SETUP
# (Streamlit reruns the whole script on interaction,
#  so we use session_state to remember things)
# -------------------------------------------------------

if "recipes" not in st.session_state:
    st.session_state.recipes = []

if "selected_recipe" not in st.session_state:
    st.session_state.selected_recipe = None

if "ingredient_list" not in st.session_state:
    st.session_state.ingredient_list = []


# -------------------------------------------------------
# HERO SECTION
# -------------------------------------------------------

st.markdown('<div class="hero-title">🧊 What\'s in my fridge?</div>', unsafe_allow_html=True)
st.markdown('<div class="hero-subtitle">Enter your ingredients and discover what you can cook today.</div>', unsafe_allow_html=True)


# -------------------------------------------------------
# INPUT SECTION
# -------------------------------------------------------

col1, col2 = st.columns([3, 1])

with col1:
    ingredient_input = st.text_input(
        label="Ingredients",
        placeholder="e.g. eggs, butter, garlic, tomatoes",
        label_visibility="collapsed"
    )

with col2:
    add_clicked = st.button("＋ Add")

# When user clicks Add, parse and store ingredients
if add_clicked and ingredient_input:
    new_items = [i.strip().lower() for i in ingredient_input.split(",") if i.strip()]
    for item in new_items:
        if item not in st.session_state.ingredient_list:
            st.session_state.ingredient_list.append(item)

# Show ingredient tags
if st.session_state.ingredient_list:
    tags_html = '<div class="tag-container">' + \
        "".join([f'<span class="tag">🥄 {ing}</span>' for ing in st.session_state.ingredient_list]) + \
        '</div>'
    st.markdown(tags_html, unsafe_allow_html=True)

    # Clear button
    if st.button("🗑️ Clear all ingredients"):
        st.session_state.ingredient_list = []
        st.session_state.recipes = []
        st.session_state.selected_recipe = None
        st.rerun()


# -------------------------------------------------------
# SEARCH CONTROLS
# -------------------------------------------------------

st.markdown("---")
num_results = st.slider("How many recipes to suggest?", min_value=1, max_value=10, value=5)

search_clicked = st.button("🔍 Find Recipes")

if search_clicked:
    if not st.session_state.ingredient_list:
        st.warning("Please add at least one ingredient first!")
    else:
        with st.spinner("Searching for recipes..."):
            st.session_state.recipes = find_recipes_by_ingredients(
                st.session_state.ingredient_list,
                number_of_results=num_results
            )
            st.session_state.selected_recipe = None  # Reset any open detail view


# -------------------------------------------------------
# RECIPE RESULTS
# -------------------------------------------------------

if st.session_state.recipes:
    st.markdown(f"### 🍽️ {len(st.session_state.recipes)} Recipe(s) Found")

    for recipe in st.session_state.recipes:
        missing = [i['name'] for i in recipe.get('missedIngredients', [])]
        missing_text = f"Missing: {', '.join(missing)}" if missing else "You have everything! 🎉"

        card_html = f"""
        <div class="recipe-card">
            <div class="recipe-title">{recipe['title']}</div>
            <span class="badge-green">✅ Have: {recipe['usedIngredientCount']}</span>
            <span class="badge-red">❌ Missing: {recipe['missedIngredientCount']}</span>
            <div class="missing-text">{missing_text}</div>
        </div>
        """
        st.markdown(card_html, unsafe_allow_html=True)

        if st.button(f"📖 See full recipe", key=f"btn_{recipe['id']}"):
            with st.spinner("Loading recipe details..."):
                st.session_state.selected_recipe = get_recipe_details(recipe['id'])


# -------------------------------------------------------
# RECIPE DETAIL VIEW
# -------------------------------------------------------

if st.session_state.selected_recipe:
    detail = st.session_state.selected_recipe

    st.markdown("---")

    instructions = detail.get('instructions', '')
    # Strip basic HTML tags from instructions if present
    import re
    instructions_clean = re.sub('<[^<]+?>', '', instructions) if instructions else "No instructions available."

    detail_html = f"""
    <div class="detail-box">
        <div class="detail-title">{detail['title']}</div>
        <div class="meta-row">
            <span>⏱️ {detail.get('readyInMinutes', 'N/A')} mins</span>
            <span>🍴 {detail.get('servings', 'N/A')} servings</span>
        </div>
        <hr class="divider"/>
        <p style="font-size:0.95rem; color:#333; line-height:1.7;">{instructions_clean}</p>
    </div>
    """
    st.markdown(detail_html, unsafe_allow_html=True)

    source_url = detail.get('sourceUrl', '')
    if source_url:
        st.markdown(f"🔗 [View full recipe on source website]({source_url})")

    if st.button("✖ Close details"):
        st.session_state.selected_recipe = None
        st.rerun()


# -------------------------------------------------------
# EMPTY STATE
# -------------------------------------------------------

elif not st.session_state.recipes and not st.session_state.ingredient_list:
    st.markdown("""
        <div style="text-align:center; padding: 3rem 0; color: #AAAAAA;">
            <div style="font-size: 3rem;">🥕</div>
            <div style="font-size: 1rem; margin-top: 0.5rem;">Add your ingredients above to get started!</div>
        </div>
    """, unsafe_allow_html=True)