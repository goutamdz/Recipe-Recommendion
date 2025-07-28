import { useState } from 'react'
import axios from 'axios'
import './App.css'

const TASTE_PROFILES = ['spicy', 'savory', 'sweet']

function App() {
  const [selectedProfile, setSelectedProfile] = useState('spicy')
  const [mealPlans, setMealPlans] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchMealPlans = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get('http://localhost:3000/meal-plan')
      setMealPlans(res.data)
    } catch (err) {
      setError('Failed to fetch meal plans')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Select Taste Profile</h1>
      <div className="flex gap-4 mb-6">
        {TASTE_PROFILES.map(profile => (
          <button
            key={profile}
            className={`px-4 py-2 rounded ${
              selectedProfile === profile
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedProfile(profile)}
          >
            {profile.charAt(0).toUpperCase() + profile.slice(1)}
          </button>
        ))}
        <button
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
          onClick={fetchMealPlans}
        >
          Fetch Meals
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {mealPlans && mealPlans[selectedProfile] && (
        <div>
          <h2 className="text-2xl font-semibold mb-2 capitalize">{selectedProfile} Meals</h2>
          <ul className="space-y-4">
            {mealPlans[selectedProfile] &&
              Array.from({ length: Math.ceil(mealPlans[selectedProfile].length / 3) }).map((_, dayIdx) => {
                const dayMeals = mealPlans[selectedProfile].slice(dayIdx * 3, dayIdx * 3 + 3)
                const mealLabels = ['Breakfast', 'Lunch', 'Dinner']
                return (
                  <li key={dayIdx} className="border p-4 rounded shadow">
                    <div className="font-bold mb-2">Day {dayIdx + 1}</div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {dayMeals.map((meal, idx) => (
                        <div key={meal.combo_id} className="flex-1 border rounded p-3 bg-gray-50">
                          <div className="font-semibold mb-1">{mealLabels[idx] || `Meal ${idx + 1}`}</div>
                          <div className="font-semibold">{meal.main}</div>
                          <div>Side: {meal.side}</div>
                          <div>Drink: {meal.drink}</div>
                          <div>Calories: {meal.total_calories}</div>
                          <div>Popularity: {meal.popularity_score}</div>
                          <div className="text-sm text-gray-500">{meal.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
