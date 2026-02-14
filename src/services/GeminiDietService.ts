import { GoogleGenerativeAI } from '@google/generative-ai';
import type { HealthVitals } from '../types';

export interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export interface DietResponse {
  mealPlan: MealPlan;
  explanation: string;
  tips: string[];
  foods: {
    avoid: string[];
    recommended: string[];
  };
}

const DIET_SYSTEM_INSTRUCTION = `You are a knowledgeable AI Nutritionist Assistant for AuraHealth. Your role is to provide personalized meal recommendations based on the user's current health status, symptoms, and vital signs.

IMPORTANT: All meal recommendations should be based on INDIAN CUISINE and dietary practices common in India.

GUIDELINES:
1. Analyze the user's current health condition and vital readings
2. Suggest Indian meals that are easy to prepare and commonly available in India
3. Focus on:
   - Traditional Indian foods suitable for their condition
   - Regional Indian dishes that aid recovery
   - Indian foods to avoid based on symptoms
   - Hydration recommendations (water, coconut water, buttermilk, etc.)
   - Meal timing as per Indian eating habits

4. For each meal type (breakfast, lunch, dinner, snacks), provide 2-3 healthy Indian options
5. Include foods that are:
   - Budget-friendly and available in Indian markets
   - Seasonally available in India
   - Easy to digest (if needed)
   - Rich in necessary nutrients
   - Traditional Indian preparations (dal, roti, sabzi, rice, etc.)

6. Suggest Indian ingredients and spices known for health benefits:
   - Turmeric, ginger, garlic, cumin, coriander
   - Traditional remedies like tulsi, ajwain, jeera water
   - Indian superfoods like millets, dal, ghee, curd

7. Consider Indian dietary preferences:
   - Vegetarian options as primary
   - Non-vegetarian options when appropriate
   - Regional variations (North Indian, South Indian, etc.)
   - Traditional Ayurvedic principles when relevant

8. Always include a disclaimer that this is general nutritional advice, not medical nutrition therapy
9. Recommend consulting with a registered dietitian for specific conditions

EXAMPLE INDIAN FOODS:
- Breakfast: Poha, Upma, Idli, Dosa, Paratha, Daliya, Sprouts
- Lunch/Dinner: Dal-Chawal, Roti-Sabzi, Khichdi, Sambar-Rice, Curd Rice
- Snacks: Chana chaat, Fruit, Nuts, Mathri, Dhokla, Roasted makhana
- Drinks: Buttermilk, Coconut water, Herbal tea, Turmeric milk

Remember: Focus on practical, achievable Indian meal recommendations that the user can implement immediately with ingredients available in India.`;

export class GeminiDietService {
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string = '';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.initializeClient();
  }

  private initializeClient() {
    if (this.apiKey) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.initializeClient();
  }

  async generateDietPlan(
    symptoms: string[],
    vitals: HealthVitals | null,
    additionalContext?: string
  ): Promise<DietResponse> {
    if (!this.client || !this.apiKey) {
      throw new Error('API key not configured. Please set your Gemini API key in settings.');
    }

    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        systemInstruction: DIET_SYSTEM_INSTRUCTION,
      });

      // Build the prompt with health information
      let prompt = `Based on the following health information, suggest a balanced meal plan for today:

SYMPTOMS: ${symptoms.join(', ') || 'None reported'}`;

      if (vitals) {
        prompt += `

VITAL SIGNS:
- Blood Pressure: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg
- Heart Rate: ${vitals.heartRate} bpm
- Temperature: ${vitals.temperature}°F
- Blood Sugar: ${vitals.bloodSugar} mg/dL
- Oxygen Saturation: ${vitals.oxygenSaturation}%`;
      }

      if (additionalContext) {
        prompt += `\n\nADDITIONAL CONTEXT: ${additionalContext}`;
      }

      prompt += `

Please provide:
1. Breakfast options (2 items)
2. Lunch options (2 items)
3. Dinner options (2 items)
4. Healthy snack options (2 items)
5. Foods to avoid in bullet points
6. Recommended foods in bullet points
7. Tips for following this diet
8. A brief explanation of why these meals help with the current condition

Format the response clearly with sections.`;

      const result = await model.generateContent(prompt);

      // Extract text using the .text() method
      const responseText = result.response?.text() || '';

      if (!responseText || responseText.trim().length === 0) {
        throw new Error('No response received from the model');
      }

      // Parse the response
      const dietResponse = this.parseDietResponse(responseText);
      return dietResponse;
    } catch (error) {
      console.error('Error calling Gemini API for diet planning:', error);
      throw new Error(
        `Failed to generate diet plan: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async generateCustomDietPlan(userQuery: string): Promise<DietResponse> {
    if (!this.client || !this.apiKey) {
      throw new Error('API key not configured. Please set your Gemini API key in settings.');
    }

    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        systemInstruction: DIET_SYSTEM_INSTRUCTION,
      });

      const prompt = `${userQuery}

Please provide a meal plan with:
1. Breakfast options
2. Lunch options
3. Dinner options
4. Healthy snack options
5. Foods to avoid
6. Recommended foods
7. Tips for implementation
8. Nutritional benefits explanation`;

      const result = await model.generateContent(prompt);

      // Extract text using the .text() method
      const responseText = result.response?.text() || '';

      if (!responseText || responseText.trim().length === 0) {
        throw new Error('No response received from the model');
      }

      return this.parseDietResponse(responseText);
    } catch (error) {
      console.error('Error calling Gemini API for custom diet:', error);
      throw new Error(
        `Failed to generate custom diet plan: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private parseDietResponse(response: string): DietResponse {
    const mealPlan: MealPlan = {
      breakfast: this.extractMealItems(response, 'breakfast'),
      lunch: this.extractMealItems(response, 'lunch'),
      dinner: this.extractMealItems(response, 'dinner'),
      snacks: this.extractMealItems(response, 'snack'),
    };

    const foods = {
      avoid: this.extractBulletPoints(response, 'avoid'),
      recommended: this.extractBulletPoints(response, 'recommend'),
    };

    const tips = this.extractBulletPoints(response, 'tip');

    return {
      mealPlan,
      explanation: this.extractExplanation(response),
      tips,
      foods,
    };
  }

  private extractMealItems(response: string, mealType: string): string[] {
    const regex = new RegExp(`${mealType}[^:]*:([^\\n]*(?:\\n(?!^[A-Z])[^\\n]*)*)`, 'im');
    const match = response.match(regex);

    if (!match) return [];

    const items = match[1]
      .split(/[\n,]/)
      .map((item) => item.replace(/^[-•*]\s*/, '').trim())
      .filter((item) => item.length > 0)
      .slice(0, 3);

    return items;
  }

  private extractBulletPoints(response: string, section: string): string[] {
    const regex = new RegExp(`${section}[^:]*:([^\\n]*(?:\\n(?!^[A-Z])[^\\n]*)*)`, 'im');
    const match = response.match(regex);

    if (!match) return [];

    const points = match[1]
      .split('\n')
      .map((point) => point.replace(/^[-•*]\s*/, '').trim())
      .filter((point) => point.length > 0);

    return points;
  }

  private extractExplanation(response: string): string {
    const explanationMatch = response.match(
      /explanation[^:]*:([^]*?)(?=^[A-Z][^:]*:|$)/m
    );
    if (explanationMatch) {
      return explanationMatch[1].trim();
    }

    // Fallback: take the last paragraph
    const paragraphs = response.split('\n\n');
    return paragraphs[paragraphs.length - 1].trim();
  }
}

// Export a singleton instance
let dietServiceInstance: GeminiDietService | null = null;

export function getDietService(apiKey?: string): GeminiDietService {
  if (!dietServiceInstance && apiKey) {
    dietServiceInstance = new GeminiDietService(apiKey);
  }
  return dietServiceInstance || new GeminiDietService('');
}

export function initializeDietService(apiKey: string): GeminiDietService {
  dietServiceInstance = new GeminiDietService(apiKey);
  return dietServiceInstance;
}
