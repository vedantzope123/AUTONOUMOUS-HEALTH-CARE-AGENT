import { GoogleGenerativeAI } from '@google/generative-ai';

export interface NurseResponse {
  message: string;
  isCritical: boolean;
  criticalAlert?: string;
  suggestions?: string[];
}

const NURSE_SYSTEM_INSTRUCTION = `You are AuraHealth - a compassionate and knowledgeable AI Nurse Assistant. Your role is to provide first-aid advice, suggest non-prescription remedies, and help users understand their health conditions.

CRITICAL RESPONSIBILITIES:
1. Always maintain a professional, empathetic tone
2. If the user mentions symptoms like chest pain, severe bleeding, difficulty breathing, loss of consciousness, severe allergic reactions, or other life-threatening conditions, immediately:
   - Label the response as "CRITICAL SITUATION"
   - Provide emergency life-saving tips
   - Urgently recommend calling emergency services (911 or local emergency number)
   - Suggest booking an emergency appointment

3. For regular health concerns:
   - Ask clarifying questions to understand the symptoms better
   - Provide first-aid advice where applicable
   - Suggest over-the-counter remedies (if appropriate)
   - Recommend dietary changes or rest
   - Track symptom patterns
   - Suggest when to see a doctor for non-emergency situations

4. NEVER provide medical diagnosis or prescribe medications
5. Always include a disclaimer that you are an AI assistant, not a licensed physician
6. Be supportive and non-judgmental

EXAMPLE CRITICAL KEYWORDS TO WATCH:
- Chest pain, heart attack, cardiac
- Severe bleeding, hemorrhage
- Difficulty breathing, choking, asphyxiation
- Loss of consciousness, fainting, collapsed
- Severe allergic reaction, anaphylaxis
- Poisoning, overdose, toxicity
- Severe injury, trauma
- Severe burns
- Any mention of severe/unbearable pain

Format your responses clearly with:
- A greeting if it's the start of conversation
- Acknowledgment of symptoms
- Immediate advice (if needed)
- Questions for clarification (if needed)
- Recommendations
- When to seek professional help

Remember: You are here to help users feel better and understand their health, but you are NOT a replacement for professional medical care.`;

export class GeminiNurseService {
  private client: GoogleGenerativeAI | null = null;
  private apiKey: string = '';
  private conversationHistory: Array<{ role: string; parts: string[] }> = [];
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 3000; // 3 seconds between requests
  private requestTimestamps: number[] = [];
  private preferredLanguage: 'en' | 'hi' = 'en';

  constructor(apiKey: string, language: 'en' | 'hi' = 'en') {
    this.apiKey = apiKey;
    this.preferredLanguage = language;
    this.initializeClient();
  }

  setLanguage(language: 'en' | 'hi') {
    this.preferredLanguage = language;
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

  resetConversation() {
    this.conversationHistory = [];
  }

  async askNurse(userInput: string, language?: 'en' | 'hi'): Promise<NurseResponse> {
    if (!this.client || !this.apiKey) {
      throw new Error('API key not configured. Please set your Gemini API key in settings.');
    }

    if (!userInput || !userInput.trim()) {
      throw new Error('Please enter a message');
    }

    const responseLanguage = language || this.preferredLanguage;

    // Check rate limiting (free tier: limit to 1 request per 3 seconds)
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = Math.ceil((this.minRequestInterval - timeSinceLastRequest) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before sending another message (free tier rate limit).`);
    }

    // Clean up old timestamps (keep only last minute)
    this.requestTimestamps = this.requestTimestamps.filter(ts => now - ts < 60000);
    this.requestTimestamps.push(now);

    // Free tier limit: max 60 requests per minute
    if (this.requestTimestamps.length > 60) {
      throw new Error('Free tier quota exceeded. Please wait a moment and try again, or upgrade your API key.');
    }

    this.lastRequestTime = now;

    try {
      const languageInstruction = responseLanguage === 'hi' 
        ? '\n\nIMPORTANT: Respond in Hindi (हिंदी में जवाब दें). Provide all information, advice, and explanations in Hindi language only.'
        : '';

      const model = this.client.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        systemInstruction: NURSE_SYSTEM_INSTRUCTION + languageInstruction,
      });

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        parts: [userInput],
      });

      // Prepare conversation history for the model
      const contents = this.conversationHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.parts.join('') }],
      }));

      const response = await model.generateContent({
        contents,
      });

      // Check if we got a valid response
      if (!response || !response.response) {
        throw new Error('Empty response from Gemini API');
      }

      // Extract text from response
      const textContent = response.response.text();

      if (!textContent || textContent.trim().length === 0) {
        throw new Error('No text content in API response');
      }

      const responseText = textContent.trim();

      // Add response to history
      this.conversationHistory.push({
        role: 'assistant',
        parts: [responseText],
      });

      // Check for critical keywords in the response
      const isCritical = this.isCriticalSituation(responseText);
      const criticalAlert = isCritical
        ? this.extractCriticalAlert(responseText)
        : undefined;

      return {
        message: responseText,
        isCritical,
        criticalAlert,
        suggestions: this.extractSuggestions(responseText),
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Check if it's a quota error
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('Quota')) {
        throw new Error('Free tier quota exceeded. Please wait a moment or upgrade your API key for higher limits.');
      }
      
      throw new Error(`Failed to get nurse response: ${errorMsg}`);
    }
  }

  private isCriticalSituation(response: string): boolean {
    const criticalKeywords = [
      'CRITICAL',
      'EMERGENCY',
      'CALL 911',
      'SEEK IMMEDIATE',
      'LIFE-THREATENING',
      'EMERGENCY SERVICES',
      'CALL EMERGENCY',
      '911',
      'AMBULANCE',
      'HOSPITALIZE',
    ];

    const lowerResponse = response.toUpperCase();
    return criticalKeywords.some((keyword) => lowerResponse.includes(keyword));
  }

  private extractCriticalAlert(response: string): string {
    const criticalMatch = response.match(/CRITICAL[^.!?]*[.!?]/i);
    if (criticalMatch) {
      return criticalMatch[0];
    }
    const emergencyMatch = response.match(/EMERGENCY[^.!?]*[.!?]/i);
    if (emergencyMatch) {
      return emergencyMatch[0];
    }
    return 'This requires immediate medical attention. Contact emergency services.';
  }

  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];

    // Look for bullet points
    const bulletMatches = response.match(/[-•]\s+(.+?)(?=[-•]|$)/g);
    if (bulletMatches) {
      suggestions.push(...bulletMatches.map((m) => m.replace(/^[-•]\s+/, '').trim()));
    }

    // Look for numbered items
    const numberedMatches = response.match(/\d+\.\s+(.+?)(?=\d+\.|$)/g);
    if (numberedMatches) {
      suggestions.push(...numberedMatches.map((m) => m.replace(/^\d+\.\s+/, '').trim()));
    }

    return suggestions.slice(0, 5); // Return first 5 suggestions
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}

// Export a singleton instance
let nurseServiceInstance: GeminiNurseService | null = null;

export function getNurseService(apiKey?: string, language: 'en' | 'hi' = 'en'): GeminiNurseService {
  if (!nurseServiceInstance && apiKey) {
    nurseServiceInstance = new GeminiNurseService(apiKey, language);
  } else if (nurseServiceInstance) {
    nurseServiceInstance.setLanguage(language);
  }
  return nurseServiceInstance || new GeminiNurseService('', language);
}

export function initializeNurseService(apiKey: string, language: 'en' | 'hi' = 'en'): GeminiNurseService {
  nurseServiceInstance = new GeminiNurseService(apiKey, language);
  return nurseServiceInstance;
}
