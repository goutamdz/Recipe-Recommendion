import express from 'express';
import cors from 'cors';

const app = express();
const PORT =3000;
app.use(cors());

const data = [
  { item_name: "Paneer Butter Masala", category: "main", calories: 450, taste_profile: "spicy", popularity_score: 0.9 },
  { item_name: "Chicken Biryani", category: "main", calories: 600, taste_profile: "spicy", popularity_score: 0.95 },
  { item_name: "Vegetable Pulao", category: "main", calories: 400, taste_profile: "savory", popularity_score: 0.7 },
  { item_name: "Rajma Chawal", category: "main", calories: 500, taste_profile: "savory", popularity_score: 0.8 },
  { item_name: "Chole Bhature", category: "main", calories: 650, taste_profile: "spicy", popularity_score: 0.85 },
  { item_name: "Masala Dosa", category: "main", calories: 480, taste_profile: "savory", popularity_score: 0.88 },
  { item_name: "Grilled Sandwich", category: "main", calories: 370, taste_profile: "savory", popularity_score: 0.6 },

  { item_name: "Garlic Naan", category: "side", calories: 200, taste_profile: "savory", popularity_score: 0.9 },
  { item_name: "Mixed Veg Salad", category: "side", calories: 150, taste_profile: "sweet", popularity_score: 0.75 },
  { item_name: "French Fries", category: "side", calories: 350, taste_profile: "savory", popularity_score: 0.8 },
  { item_name: "Curd Rice", category: "side", calories: 250, taste_profile: "savory", popularity_score: 0.7 },
  { item_name: "Papad", category: "side", calories: 100, taste_profile: "savory", popularity_score: 0.65 },
  { item_name: "Paneer Tikka", category: "side", calories: 300, taste_profile: "spicy", popularity_score: 0.85 },

  { item_name: "Masala Chaas", category: "drink", calories: 100, taste_profile: "spicy", popularity_score: 0.8 },
  { item_name: "Sweet Lassi", category: "drink", calories: 220, taste_profile: "sweet", popularity_score: 0.9 },
  { item_name: "Lemon Soda", category: "drink", calories: 90, taste_profile: "savory", popularity_score: 0.7 },
  { item_name: "Cold Coffee", category: "drink", calories: 180, taste_profile: "sweet", popularity_score: 0.75 },
  { item_name: "Coconut Water", category: "drink", calories: 60, taste_profile: "sweet", popularity_score: 0.6 },
  { item_name: "Iced Tea", category: "drink", calories: 120, taste_profile: "sweet", popularity_score: 0.78 }
];

function generate21CombosPerTasteProfile() {
  const mains = data.filter(item => item.category === 'main');
  const sides = data.filter(item => item.category === 'side');
  const drinks = data.filter(item => item.category === 'drink');

  const allCombos = [];

  for (const main of mains) {
    for (const side of sides) {
      for (const drink of drinks) {
        const totalCalories = main.calories + side.calories + drink.calories;
        const popularity = (main.popularity_score + side.popularity_score + drink.popularity_score).toFixed(2);

        const tastes = [main.taste_profile, side.taste_profile, drink.taste_profile];
        const tasteCounts = tastes.reduce((acc, taste) => {
          acc[taste] = (acc[taste] || 0) + 1;
          return acc;
        }, {});

        let tasteProfile = Object.keys(tasteCounts).reduce((a, b) =>
          tasteCounts[a] > tasteCounts[b] ? a : b
        );

        // In case of tie, choose main's taste
        const values = Object.values(tasteCounts);
        const isTie = values.filter(v => v === Math.max(...values)).length > 1;
        if (isTie) tasteProfile = main.taste_profile;

        let reasoning = [];
        if (totalCalories >= 530 && totalCalories <= 580) {
          reasoning.push("Calorie target met");
        } else {
          reasoning.push("Calorie range exceeded or under");
        }

        if (main.taste_profile === side.taste_profile || main.taste_profile === drink.taste_profile) {
          reasoning.push("Taste profile alignment");
        }

        if (parseFloat(popularity) >= 2.3) {
          reasoning.push("Highly popular combo");
        }

        allCombos.push({
          main: main.item_name,
          side: side.item_name,
          drink: drink.item_name,
          total_calories: totalCalories,
          popularity_score: parseFloat(popularity),
          reasoning: reasoning.join(", "),
          taste_profile: tasteProfile
        });
      }
    }
  }

  // Shuffle helper
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Prepare final structure with 21 combos per taste
  const tasteProfiles = ["spicy", "savory", "sweet"];
  const output = {};

  for (const taste of tasteProfiles) {
    const combos = allCombos.filter(c => c.taste_profile === taste);
    const preferred = combos.filter(c => c.total_calories >= 530 && c.total_calories <= 580);
    const finalCombos = shuffle(preferred.length >= 21 ? preferred : combos).slice(0, 21);

    output[taste] = finalCombos.map((combo, index) => ({
      combo_id: index + 1,
      ...combo
    }));
  }

  return output;
}


app.get('/meal-plan',(req,res)=>{
    const mealPlan = generate21CombosPerTasteProfile();
    res.json(mealPlan);
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
