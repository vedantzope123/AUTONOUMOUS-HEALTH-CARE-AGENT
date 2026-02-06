import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { DietRecommendation } from '../types';
import { generateId, formatDate } from '../utils/helpers';
import { initializeDietService } from '../services/GeminiDietService';
import { FiClock, FiLoader } from 'react-icons/fi';

export const DietPlan: React.FC = () => {
  const { apiKey, vitals, symptoms, dietRecommendations, addDietRecommendation, setIsLoading } =
    useAppContext();

  const [customQuery, setCustomQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);

  const handleGeneratePlan = async () => {
    if (!apiKey) {
      alert('API key not configured');
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);

    try {
      const dietService = initializeDietService(apiKey);

      // Get current context
      const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : null;
      const recentSymptoms = symptoms
        .slice(-3)
        .map((s) => s.symptoms.join(', '))
        .join('; ');

      let query = customQuery;
      if (!query) {
        query = `Generate a meal plan based on these vitals and symptoms. Vitals: Blood Pressure ${latestVitals?.bloodPressureSystolic}, Heart Rate ${latestVitals?.heartRate}, Temperature ${latestVitals?.temperature}. Recent symptoms: ${recentSymptoms || 'None'}`;
      }

      const plan = await dietService.generateCustomDietPlan(query);
      setCurrentPlan(plan);

      // Save to history
      const recommendation: DietRecommendation = {
        id: generateId(),
        date: formatDate(new Date()),
        meals: plan.mealPlan,
        reason: customQuery || 'AI Generated',
        notes: plan.explanation,
      };
      addDietRecommendation(recommendation);

      setCustomQuery('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate diet plan');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="md:ml-64 min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8 flex items-center gap-3">
          <FiClock size={32} className="text-orange-500" />
          Diet & Meal Planner
        </h1>

        {/* Generator */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-900 mb-4">AI-Powered Meal Planning</h2>

          <div className="space-y-4">
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Tell me about your dietary needs, preferences, or any specific conditions..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500"
            />

            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="animate-spin" /> Generating Plan...
                </>
              ) : (
                <>Generate Meal Plan</>
              )}
            </button>

            <p className="text-sm text-primary-600">
              💡 The AI will consider your health vitals, reported symptoms, and preferences to create a personalized meal plan.
            </p>
          </div>
        </div>

        {/* Current Plan */}
        {currentPlan && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Meals */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-4">📅 Today's Meal Plan</h3>

                <div className="space-y-3">
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => (
                    <div key={mealType} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-bold text-primary-900 capitalize mb-1">
                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                      </h4>
                      <ul className="space-y-1">
                        {currentPlan.mealPlan[mealType as keyof typeof currentPlan.mealPlan].map(
                          (item: string, idx: number) => (
                            <li key={idx} className="text-sm text-primary-700">
                              • {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-4">✅ Recommended Foods</h3>
                <ul className="space-y-2">
                  {currentPlan.foods.recommended.map((food: string, idx: number) => (
                    <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-4">❌ Foods to Avoid</h3>
                <ul className="space-y-2">
                  {currentPlan.foods.avoid.map((food: string, idx: number) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="text-red-500 font-bold">✕</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-primary-900 mb-4">💡 Tips</h3>
                <ul className="space-y-2">
                  {currentPlan.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="text-sm text-primary-700 flex items-start gap-2">
                      <span className="text-primary-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        {dietRecommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4">📚 Meal Plan History</h2>
            <div className="space-y-4">
              {[...dietRecommendations].reverse().map((rec) => (
                <div key={rec.id} className="p-4 border border-primary-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-primary-900">{rec.reason}</h4>
                    <span className="text-xs text-primary-500">{rec.date}</span>
                  </div>
                  <p className="text-sm text-primary-700 line-clamp-2">{rec.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!currentPlan && dietRecommendations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FiClock size={48} className="text-primary-300 mx-auto mb-4" />
            <p className="text-primary-600 font-semibold">No meal plans yet</p>
            <p className="text-primary-500 text-sm">Generate your first personalized meal plan above</p>
          </div>
        )}
      </div>
    </div>
  );
};
