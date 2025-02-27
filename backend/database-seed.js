//Imports
const mongoose = require("mongoose");
const Category = require("./models/categoryModel");
const Product = require("./models/productModel"); 
const database = require("./database");

/*Meal Constants*/

//Drinks
const pepsi = {
  name: 'Pepsi',
  type: 'simple',
  image: 'https://cdn.mafrservices.com/sys-master-root/h96/h55/61797238407198/13191_main.jpg',
  description: 'A refreshing soda drink.',
  tags: ['Drink', 'Sweet', 'Vegetarian', 'Gluten-Free'],
  calories: 150,
  servingSize: {
    value: 355,
    unit: 'ml',
  },
  macros: {
    carbs: 41,
    protein: 0,
    fats: 0,
  },
  sugar: 41,
  fiber: 0,
  sodium: 30, // Adjusted
  caffeine: 38, // Adjusted
  cholesterol: 0,
  saturatedFats: 0,
  unsaturatedFats: 0,
  ingredients: [
    { name: 'Carbonated water', amount: '355 ml', calories: 0 },
    { name: 'High fructose corn syrup', amount: '41g', calories: 140 },
    { name: 'Caramel color', amount: 'trace', calories: 0 },
  ],
  recipeUrl: null,
  videoUrl: null,
};

const matchaProteinShake = {
  name: 'Matcha Protein Shake',
  type: 'recipe',
  image: 'https://lovemischka.com/wp-content/uploads/2023/03/Matcha-Protein-Shake.jpg', // Example image link
  description: 'A refreshing and energizing matcha protein shake packed with antioxidants and plant-based protein.',
  tags: [
    // Course
    'Breakfast', 'Drink', 'Snack',
    // Cuisine
    'American',
    // Dietary Preferences
    'Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein',
  ],

  calories: 158, // Updated
  servingSize: {
    value: 1,
    unit: 'glass',
  },
  macros: {
    carbs: 7, // Updated
    protein: 25, // Updated
    fats: 4, // Updated
  },
  sugar: 1, // Updated
  fiber: 1, // Updated
  sodium: 398, // Updated
  caffeine: 50, // Estimated (from matcha)
  cholesterol: 55, // Updated
  saturatedFats: 1, // Updated
  unsaturatedFats: 3, // Calculated (poly + mono unsaturated fats)
  ingredients: [
    {
      name: 'Unsweetened almond milk',
      amount: '1 cup',
      calories: 30,
      isOptional: false, // Mandatory ingredient
    },
    {
      name: 'Vanilla protein powder',
      amount: '1 scoop',
      calories: 120,
      isOptional: false, // Mandatory ingredient
    },
    {
      name: 'Matcha powder',
      amount: '1.5 tsp',
      calories: 10,
      isOptional: false, // Mandatory ingredient
    },
    {
      name: 'Sweetener',
      amount: 'to taste',
      calories: 0,
      isOptional: true, // Optional ingredient
    },
    {
      name: 'Ice cubes',
      amount: 'as desired',
      calories: 0,
      isOptional: true, // Optional ingredient
    },
  ],
  
  recipeSteps: [
    'Pour your milk of choice into a large glass or personal blender.',
    'Add the vanilla protein powder and matcha powder (or matcha collagen powder).',
    'Mix thoroughly using a blender, battery-operated matcha whisk, or milk frother.',
    'If desired, add ice cubes to the glass or blender. If using a blender, mix again.',
    'Pour the blended matcha protein shake into a glass with ice (if desired).',
    'Enjoy!',
  ],
  recipeUrl: 'https://lovemischka.com/matcha-protein-shake-recipe/',
  videoUrl: null, // Add a video link if available
};

const homemadeHotChocolate = {
  name: 'Homemade Hot Chocolate',
  type: 'recipe',
  image: 'https://celebratingsweets.com/wp-content/uploads/2018/12/Homemade-Hot-Chocolate-4.jpg', // Add your image URL here
  description: 'Creamy Homemade Hot Chocolate. A combination of cocoa powder and chocolate chips make this hot chocolate extra flavorful and delicious! Ready in minutes.',
  tags: ['Drink', 'American', 'Sweet', 'Vegetarian', 'Gluten-Free', 'Comfort Food', 'Festive'], // Relevant tags
  calories: 323, // Per serving
  servingSize: {
    value: 1, 
    unit: 'cup',
  },
  macros: {
    carbs: 30, 
    protein: 9, 
    fats: 13, 
  },
  sugar: 38,
  fiber: 2, 
  sodium: 121, 
  caffeine: 5, 
  cholesterol: 27, 
  saturatedFats: 8, 
  unsaturatedFats: 5, 
  ingredients: [
    {
      name: 'Milk (preferably whole or 2%)',
      amount: '4 cups',
      calories: 240, // ~60 calories per cup
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Unsweetened cocoa powder',
      amount: '1/4 cup',
      calories: 50, // Estimated
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Granulated sugar',
      amount: '1/4 cup',
      calories: 200, // ~50 calories per tablespoon
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Bittersweet or semisweet chocolate chips',
      amount: '1/2 cup',
      calories: 400, // ~100 calories per 1/4 cup
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Pure vanilla extract',
      amount: '1/4 tsp',
      calories: 3, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Salt',
      amount: 'a pinch',
      calories: 0, // Negligible
      brand: null, // Optional
      isOptional: true,
    },
  ],
  recipeSteps: [
    'Place milk, cocoa powder, and sugar in a small saucepan.',
    'Heat over medium/medium-low heat, whisking frequently, until warm (but not boiling).',
    'Add chocolate chips and whisk constantly until the chocolate chips melt and distribute evenly into the milk.',
    'Whisk in vanilla extract and a pinch of salt (if desired).',
    'Serve immediately.',
  ],
  recipeUrl: 'https://celebratingsweets.com/homemade-hot-chocolate/#recipe', // Add the recipe URL
  videoUrl: null, // Add a video URL if available
};

const blackberrySmoothie = {
  name: 'Blackberry Smoothie',
  type: 'recipe',
  image: 'https://www.eatingwell.com/thmb/22eeu-jhmlhRZKux6vhMoIUn_KI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/blackberry-smoothie-273274d2161a415698646fe28d7e32c8.jpg', // Add your image URL here
  description: 'A refreshing and healthy blackberry smoothie made with fresh blackberries, banana, Greek yogurt, honey, lemon juice, and ginger.',
  tags: ['Drink', 'Snack', 'Breakfast', 'Vegetarian', 'Gluten-Free',  'Healthy', 'Quick & Easy'], // Relevant tags
  calories: 316, // Per serving
  servingSize: {
    value: 1, // Serves 1
    unit: 'serving',
  },
  macros: {
    carbs: 53, // Updated
    protein: 15, // Updated
    fats: 7, // Updated
  },
  sugar: 38, // Estimated (from honey, banana, and blackberries)
  fiber: 8, // Estimated (from blackberries and banana)
  sodium: 50, // Estimated (from yogurt and natural ingredients)
  caffeine: 0, // No caffeine
  cholesterol: 15, // Estimated (from yogurt)
  saturatedFats: 3, // Estimated (from yogurt)
  unsaturatedFats: 2, // Estimated (from yogurt and natural ingredients)
  ingredients: [
    {
      name: 'Fresh blackberries',
      amount: '1 cup (6 ounces)',
      calories: 62, // ~62 calories per cup
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Banana (medium)',
      amount: '1/2',
      calories: 53, // ~105 calories per medium banana
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Plain whole-milk Greek yogurt',
      amount: '1/2 cup',
      calories: 100, // ~100 calories per 1/2 cup
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Honey',
      amount: '1 tbsp',
      calories: 64, // ~64 calories per tablespoon
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Fresh lemon juice',
      amount: '1 1/2 tsp',
      calories: 2, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Fresh ginger (finely chopped)',
      amount: '1 tsp',
      calories: 2, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
  ],
  recipeSteps: [
    'Combine 1 cup blackberries, 1/2 banana, 1/2 cup yogurt, 1 tablespoon honey, 1 1/2 teaspoons lemon juice, and 1 teaspoon ginger in a blender.',
    'Cover and process until completely smooth, about 2 minutes.',
    'Serve immediately.',
  ],
  recipeUrl: 'https://www.eatingwell.com/recipe/7899650/blackberry-smoothie/', // Add the recipe URL
  videoUrl: null, // Add a video URL if available
};

const nescafeOriginal = {
  name: 'Nescafe Original Sachet',
  type: 'simple',
  image: 'https://www.nestleprofessional.com.au/sites/default/files/styles/np_article_big/public/2022-06/Nescafe%20Coffee.webp?h=418bbcf4&itok=fxYWHc_7',
  description: 'A quick and easy coffee drink with rich flavor.',
  tags: ['Drink', 'Caffeinated', 'Vegetarian', 'Gluten-Free'],
  calories: 60, // Adjusted, this is an approximate value per serving (1 sachet)
  servingSize: {
    value: 1,
    unit: 'sachet (1 cup)',
  },
  macros: {
    carbs: 12, // Estimated value
    protein: 1, // Estimated value
    fats: 1, // Estimated value
  },
  sugar: 10, // Estimated, based on a typical sachet
  fiber: 0, // Minimal or none
  sodium: 0, // Estimated, check packaging
  caffeine: 60, // Estimated per serving
  cholesterol: 0, // Typically none
  saturatedFats: 0, // Typically none
  unsaturatedFats: 0, // Typically none
  ingredients: [
    { name: 'Instant coffee', amount: '1 sachet (approximately 1.8g)', calories: 0 },
    { name: 'Sugar', amount: '9g', calories: 36 }, // Adjust based on the specific brand's sugar content
    { name: 'Non-dairy creamer', amount: '2g', calories: 24 }, // Estimated for a typical non-dairy creamer
  ],
  recipeUrl: null,
  videoUrl: null,
};


//Soups
const frenchOnionSoup = {
  name: 'French Onion Soup',
  type: 'recipe',
  image: 'https://www.simplyrecipes.com/thmb/4q6bBvsK6vNUcxBGyN9wb6jADmo=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-French-Onion-Soup-LEAD-06-00d3b5bcdf4a4261b89e1be4aedf90f3.jpg', 
  description: 'A classic French Onion Soup with caramelized onions, beef or chicken stock, and topped with cheesy toasted French bread.',
  tags: [
    'Comfort Food', 
    'Soup', 
    'Alcoholic', 
    'French', 
    'High-Protein', 
    'Stovetop', 
    'Baked', 
    'Simmered', 
    'Savory', 
    'Umami', 
    'Sweet'
  ],
  calories: 699, // Per serving
  servingSize: {
    value: 1, // Serves 1
    unit: 'bowl',
  },
  macros: {
    carbs: 84, // Updated
    protein: 30, // Updated
    fats: 26, // Updated
  },
  sugar: 10, // Estimated (from onions and sugar)
  fiber: 5, // Estimated (from onions)
  sodium: 1200, // Estimated (from stock and cheese)
  caffeine: 0, // No caffeine
  cholesterol: 50, // Estimated (from cheese and butter)
  saturatedFats: 12, // Estimated (from cheese and butter)
  unsaturatedFats: 10, // Estimated (from olive oil)
  ingredients: [
    {
      name: 'Large red or yellow onions',
      amount: '6 (about 3 pounds)',
      calories: 300, 
      brand: null, 
      isOptional: false,
    },
    {
      name: 'Extra virgin olive oil',
      amount: '4 tbsp',
      calories: 480, // ~120 calories per tablespoon
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Butter',
      amount: '2 tbsp',
      calories: 200, // ~100 calories per tablespoon
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Sugar',
      amount: '1 teaspoon',
      calories: 16, // ~16 calories per teaspoon
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Kosher salt',
      amount: 'to taste',
      calories: 0, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Garlic (minced)',
      amount: '2 cloves',
      calories: 8, 
      brand: null, 
      isOptional: false,
    },
    {
      name: 'Beef stock, chicken stock, or a combination',
      amount: '8 cups',
      calories: 80, 
      brand: null, 
      isOptional: false,
    },
    {
      name: 'Dry vermouth or dry white wine',
      amount: '1/2 cup',
      calories: 120, // ~120 calories per 1/2 cup
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Bay leaves',
      amount: '2',
      calories: 0, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Fresh thyme leaves, sprigs, or dried thyme',
      amount: '1 tbsp fresh or 1/2 tsp dried',
      calories: 1, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Freshly ground black pepper',
      amount: '1/2 tsp',
      calories: 1, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Brandy (optional)',
      amount: '2 tbsp',
      calories: 40, // ~20 calories per tablespoon
      brand: null, // Optional
      isOptional: true,
    },
    {
      name: 'French bread or baguette (1-inch slices)',
      amount: '8 slices',
      calories: 800, // ~100 calories per slice
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Grated Gruyere cheese',
      amount: '1 1/2 cups',
      calories: 600, // ~400 calories per cup
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Grated Parmesan cheese',
      amount: 'sprinkling',
      calories: 50, // Estimated
      brand: null, // Optional
      isOptional: false,
    },
  ],
  recipeSteps: [
    'Peel and thinly slice the onions from root to stem. There should be about 10 cups of sliced onions in total.',
    'In a 5 to 6 quart thick-bottomed pot, heat 3 tablespoons of olive oil on medium heat. Add the onions and toss to coat with the olive oil.',
    'Cook the onions, stirring often, until they have softened, about 15 to 20 minutes.',
    'Increase the heat to medium high. Add the remaining tablespoon of olive oil and the butter and cook, stirring often, until the onions start to brown, about 20 to 40 minutes.',
    'Sprinkle with sugar and 1 teaspoon of salt. Continue to cook until the onions are well browned, about 10 to 15 more minutes.',
    'Add the minced garlic and cook for a minute more.',
    'Add the wine or vermouth to the pot and scrape up the browned bits on the bottom and sides of the pot, deglazing the pot as you go.',
    'Add the stock, bay leaves, and thyme. Bring to a simmer, cover the pot, and lower the heat to maintain a low simmer. Cook for about 30 minutes.',
    'Season to taste with more salt and add freshly ground black pepper. Discard the bay leaves. Add brandy if using.',
    'While the soup is simmering, line a sheet pan with parchment paper or foil and preheat the oven to 450°F with a rack in the upper third of the oven.',
    'Brush both sides of the French bread or baguette slices lightly with olive oil (you\'ll end up using about a tablespoon and a half of olive oil for this).',
    'Put in the oven and toast until lightly browned, about 5 to 7 minutes. Remove from oven.',
    'Turn the toasts over and sprinkle with the grated Gruyere cheese and Parmesan. Return to oven when it\'s close to serving time and bake until the cheese is bubbly and lightly browned.',
    'To serve, ladle soup into a bowl and transfer one cheesy toast onto the top of each bowl of soup.',
  ],
  recipeUrl: 'https://www.simplyrecipes.com/recipes/french_onion_soup/', // Add the recipe URL
  videoUrl: null, // Add a video URL if available
};

const kishkLebaneseSoup = {
  name: 'Kishk Lebanese Soup',
  type: 'recipe',
  image: 'https://maureenabood.com/wp-content/uploads/2013/04/Bowls-of-kishk-Maureen-Abood.jpg', // Add your image URL here
  description: 'A traditional Lebanese soup made with kishk powder, kawarma (preserved meat), garlic, and potatoes. Hearty, flavorful, and perfect for cold days.',
  tags: [
    'Lebanese', 
    'Soup', 
    'Comfort Food', 
    'High-Protein', 
    'Stovetop', 
    'Savory', 
    'Umami', 
  ], // Relevant tags
  calories: 350, // Per serving (estimated)
  servingSize: {
    value: 1, // Serves 1
    unit: 'bowl',
  },
  macros: {
    carbs: 25, // Estimated
    protein: 20, // Estimated
    fats: 18, // Estimated
  },
  sugar: 3, // Estimated
  fiber: 4, // Estimated
  sodium: 800, // Estimated (from kishk and kawarma)
  caffeine: 0, // No caffeine
  cholesterol: 50, // Estimated (from kawarma)
  saturatedFats: 8, // Estimated (from kawarma)
  unsaturatedFats: 6, // Estimated (from kawarma and kishk)
  ingredients: [
    {
      name: 'Kishk powder',
      amount: '1 cup',
      calories: 200, // Estimated
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Kawarma (cow or goat meat preserved in sheep fat)',
      amount: '2 tbsp',
      calories: 100, // Estimated
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Garlic (chopped)',
      amount: '4 cloves',
      calories: 16, // ~4 calories per clove
      brand: null, // Optional
      isOptional: false,
    },
    {
      name: 'Potato (finely diced)',
      amount: '1 small',
      calories: 100, // ~100 calories per small potato
      brand: null, // Optional
      isOptional: true,
    },
    {
      name: 'Water',
      amount: '5 cups',
      calories: 0, // Negligible
      brand: null, // Optional
      isOptional: false,
    },
  ],
  recipeSteps: [
    'Cook the kawarma in a pot and stir slowly.',
    'Add the chopped garlic and the diced potato (if using). Stir well on low heat until the potatoes are cooked well.',
    'Add the kishk to the mixture in the pot. Stir for 2 minutes and add the water.',
    'Cook over low heat until the soup starts boiling.',
    'Serve hot.',
  ],
  recipeUrl: 'https://example.com/kishk-lebanese-soup-recipe', // Add the recipe URL
  videoUrl: null, // Add a video URL if available
};

//Salads
const caesarSalad = {
  name: 'Caesar Salad',
  type: 'recipe',
  image: 'https://link-to-caesar-salad-image.jpg',
  description: 'A classic Caesar salad with lettuce, croutons, and Caesar dressing.',
  tags: ['salad', 'vegetarian'],
  calories: 300,
  servingSize: {
    value: 1,
    unit: 'plate',
  },
  macros: {
    carbs: 15,
    protein: 8,
    fats: 22,
  },
  sugar: 3,
  fiber: 5,
  sodium: 600,
  caffeine: 34,
  cholesterol: 10,
  saturatedFats: 5,
  unsaturatedFats: 15,
  ingredients: [
    { name: 'Romaine lettuce', amount: '2 cups', calories: 10 },
    { name: 'Croutons', amount: '1/2 cup', calories: 100 },
    { name: 'Caesar dressing', amount: '3 tbsp', calories: 190 },
  ],
  recipeSteps: [
    'Wash and chop the lettuce.',
    'Toss the lettuce with croutons and dressing.',
  ],
  recipeUrl: 'https://link-to-caesar-recipe.com',
  videoUrl: 'https://link-to-caesar-video.com',
};

const grilledChickenBreast = {
  name: 'Grilled Chicken Breast',
  type: 'simple',
  image: 'https://link-to-chicken-image.jpg',
  description: 'A lean and healthy grilled chicken breast.',
  tags: ['protein', 'main course'],
  calories: 200,
  servingSize: {
    value: 1,
    unit: 'breast',
  },
  macros: {
    carbs: 0,
    protein: 40,
    fats: 5,
  },
  sugar: 0,
  fiber: 0,
  sodium: 100,
  cholesterol: 70,
  saturatedFats: 1,
  unsaturatedFats: 4,
  ingredients: [
    { name: 'Chicken breast', amount: '1 piece (200g)', calories: 200 },
  ],
  recipeUrl: null,
  videoUrl: null,
};

// List of all meals
const meals = [
  pepsi,
  caesarSalad,
  grilledChickenBreast,
  // Add more meals here
];

// Seed the meals
const seedMeals = async () => {
  try {
    // Iterate through the meals array and save each meal
    for (let mealData of meals) {
      const meal = new Meal(mealData);
      await meal.save();
    }
    console.log('Meals seeded successfully!');
  } catch (err) {
    console.error('Error seeding meals:', err);
  }
};

// Connect to MongoDB and seed data
mongoose
  .connect('mongodb://localhost:27017/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    seedMeals();
  })
  .ca









//Meals List




//Seeding Functions
async function seedCategories() {
  try {
    // Ensure the database connection is established
    await database.connectToDatabase();
    // Check if any categories already exist
    const existingCategories = await Category.find({});
    if (existingCategories.length === 0) {
      // If no categories exist, add them
      for (let categoryName of categories) {
        const category = await Category.create({ name: categoryName });
        console.log(`${categoryName} category added successfully!`);
      }
    } else {
      console.log("Categories already exist. Skipping category seeding.");
    }
  } catch (err) {
    console.error("Error seeding categories:", err);
  }
}

async function seedProducts(products) {
  try {
    await database.connectToDatabase();

  /*   // Delete all existing products in the collection
    await Product.deleteMany({});
    console.log("Existing products deleted."); */

    // Drop all indexes (except the default _id index)
    await Product.collection.dropIndexes();
    console.log("Indexes dropped.");

    // Loop through each product and insert it individually
    for (let product of products) {
      await Product.create(product);
      console.log(`Product ${product.name} added successfully!`);
    }

    await mongoose.connection.close();
    console.log("Database connection closed.");

    process.exit(0); // Ensure script exits properly
  } catch (err) {
    console.error("Error seeding products:", err);
    await mongoose.connection.close();
    process.exit(1); // Exit with failure code
  }
}



// Call the function to seed categories and products
async function seed() {
  await seedCategories(chairs);
  //await seedProducts(rugs);
  
}
seed();



