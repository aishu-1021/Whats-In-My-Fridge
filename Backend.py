import requests
# -------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------
API_KEY = "bbfae80527924e32b258b731450d894b"  # Replace with your Spoonacular API key
BASE_URL = "https://api.spoonacular.com"
# -------------------------------------------------------
# STEP 1: GET INGREDIENTS FROM THE USER
# -------------------------------------------------------
def get_ingredients_from_user():
    """
    Asks the user to enter the ingredients they have.
    Returns a list of ingredient strings.

    Example input:  "eggs, butter, flour, milk"
    Example output: ["eggs", "butter", "flour", "milk"]
    """
    print("\n🍳 Welcome to FridgeChef!")
    print("Enter the ingredients you have, separated by commas.")
    raw_input = input("Your ingredients: ")

    # Split by comma and strip extra spaces from each ingredient
    ingredients = [item.strip() for item in raw_input.split(",") if item.strip()]

    print(f"\nGot it! You have: {', '.join(ingredients)}")
    return ingredients

# -------------------------------------------------------
# STEP 2: FIND RECIPES BY INGREDIENTS
# -------------------------------------------------------
def find_recipes_by_ingredients(ingredients, number_of_results=5):
    """
    Calls the Spoonacular API to find recipes that match
    the given ingredients.

    - ingredients: list of ingredient strings
    - number_of_results: how many recipes to return (default 5)

    Returns a list of recipe dictionaries, or an empty list if something goes wrong.
    """
    # Join the list into a comma-separated string for the API
    ingredients_str = ",".join(ingredients)

    # Build the API endpoint URL
    url = f"{BASE_URL}/recipes/findByIngredients"

    # These are the parameters we're sending to the API
    params = {
        "apiKey": API_KEY,
        "ingredients": ingredients_str,
        "number": number_of_results,
        "ranking": 1,  # 1 = maximize used ingredients, 2 = minimize missing ingredients
        "ignorePantry": True  # Ignores basic pantry staples like salt, water, etc.
    }

    print("\n🔍 Searching for recipes...")

    # Make the API call
    response = requests.get(url, params=params)

    # Check if the request was successful (status code 200 = OK)
    if response.status_code == 200:
        recipes = response.json()  # Convert the response to a Python list
        return recipes
    else:
        print(f"Error fetching recipes: {response.status_code} - {response.text}")
        return []

# -------------------------------------------------------
# STEP 3: GET DETAILED INFO FOR A SPECIFIC RECIPE
# -------------------------------------------------------
def get_recipe_details(recipe_id):
    """
    Given a recipe ID, fetches detailed information like
    instructions, cook time, and servings.

    Returns a dictionary with recipe details, or None if something goes wrong.
    """
    url = f"{BASE_URL}/recipes/{recipe_id}/information"

    params = {
        "apiKey": API_KEY,
        "includeNutrition": False  # Set to True if you want nutritional info later
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching recipe details: {response.status_code}")
        return None

# -------------------------------------------------------
# STEP 4: DISPLAY RECIPES IN A READABLE FORMAT
# -------------------------------------------------------
def display_recipes(recipes):
    """
    Takes the list of recipes from the API and prints them
    in a clean, readable format for the user.
    """

    if not recipes:
        print("\n😔 No recipes found with those ingredients. Try adding more!")
        return

    print(f"\n🍽️  Found {len(recipes)} recipe(s) for you:\n")
    print("=" * 50)

    for index, recipe in enumerate(recipes, start=1):
        print(f"\n#{index}: {recipe['title']}")
        print(f"   🟢 Ingredients you have:   {recipe['usedIngredientCount']}")
        print(f"   🔴 Ingredients you're missing: {recipe['missedIngredientCount']}")

        # Show which ingredients are missing
        if recipe['missedIngredientCount'] > 0:
            missing = [i['name'] for i in recipe['missedIngredients']]
            print(f"   Missing: {', '.join(missing)}")

        print(f"   🔗 Recipe ID: {recipe['id']}  (use this to get full details)")
        print("-" * 50)

# -------------------------------------------------------
# STEP 5: DISPLAY FULL RECIPE DETAILS
# -------------------------------------------------------
def display_recipe_details(recipe_id):
    """
    Fetches and displays the full details of a recipe
    including cooking instructions and time.
    """
    details = get_recipe_details(recipe_id)
    if not details:
        print("Could not fetch recipe details.")
        return
    print(f"\n📖 {details['title']}")
    print(f"   ⏱️  Ready in: {details.get('readyInMinutes', 'N/A')} minutes")
    print(f"   🍴 Servings: {details.get('servings', 'N/A')}")
    print(f"   🌐 Full Recipe URL: {details.get('sourceUrl', 'N/A')}")

    # Display cooking instructions if available
    instructions = details.get('instructions', '')
    if instructions:
        print(f"\n📝 Instructions:\n{instructions}")
    else:
        print("\n📝 No instructions available. Check the URL above for the full recipe.")

# -------------------------------------------------------
# MAIN FUNCTION — ties everything together
# -------------------------------------------------------
def main():
    # Step 1: Get ingredients from the user
    ingredients = get_ingredients_from_user()

    # Step 2: Find matching recipes
    recipes = find_recipes_by_ingredients(ingredients, number_of_results=5)

    # Step 3: Display the recipe list
    display_recipes(recipes)

    # Step 4: Let the user pick a recipe to see full details
    if recipes:
        print("\nWould you like to see the full details of a recipe?")
        choice = input("Enter the Recipe ID (or press Enter to skip): ").strip()

        if choice:
            display_recipe_details(int(choice))

    print("\n👋 Happy cooking!\n")

# This ensures main() only runs when you execute this file directly
if __name__ == "__main__":
    main()
