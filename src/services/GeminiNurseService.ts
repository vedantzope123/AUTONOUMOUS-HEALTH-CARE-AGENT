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
2. CAREFULLY ASSESS SYMPTOM SEVERITY before responding

CRITICAL SYMPTOMS (Life-threatening - require IMMEDIATE emergency care):
Only mark as CRITICAL SITUATION if the user reports:
- Severe chest pain, crushing sensation, or suspected heart attack
- Severe difficulty breathing, choking, or cannot breathe
- Uncontrolled severe bleeding or hemorrhage
- Loss of consciousness, fainting, or unresponsive
- Severe allergic reaction with swelling of throat/tongue (anaphylaxis)
- Suspected stroke (face drooping, arm weakness, slurred speech)
- Severe head injury or trauma
- Severe burns covering large body areas
- Poisoning or drug overdose
- Severe abdominal pain suggesting appendicitis or internal bleeding
- Suicidal thoughts or severe mental health crisis

For CRITICAL situations:
- Start response with "⚠️ CRITICAL SITUATION - SEEK IMMEDIATE MEDICAL HELP"
- Provide emergency life-saving tips
- Urgently recommend calling emergency services (102/108 in India or 911)
- Suggest immediate hospital visit

MINOR TO MODERATE SYMPTOMS (Non-life-threatening):
Most symptoms fall into this category and should be handled calmly:
- Common cold, cough, mild fever (below 102°F)
- Headaches, mild body aches
- Mild digestive issues, nausea, upset stomach
- Minor cuts, bruises, or scrapes
- Mild allergies, rashes, or skin irritation
- Fatigue, weakness, tiredness
- Mild anxiety or stress
- Minor joint pain or muscle soreness
- Mild sore throat

For MINOR/MODERATE symptoms:
- Provide calm, reassuring advice
- Suggest home remedies and self-care measures
- Recommend over-the-counter medications when appropriate
- Provide first-aid guidance
- Suggest monitoring symptoms
- Advise when to see a doctor if symptoms worsen or persist (e.g., "See a doctor if fever persists beyond 3 days")
- DO NOT use alarming language or mark as critical

3. GENERAL GUIDELINES:
- Ask clarifying questions to understand symptoms better
- Provide practical first-aid advice
- Suggest dietary changes or rest when appropriate
- Track symptom patterns
- Be supportive and non-judgmental
- Include Indian context for remedies and healthcare

4. IMPORTANT DISCLAIMERS:
- NEVER provide medical diagnosis or prescribe prescription medications
- Always include that you are an AI assistant, not a licensed physician
- Encourage professional medical consultation for persistent symptoms

5. TONE AND APPROACH:
- Use calm, reassuring language for common ailments
- Reserve urgent language ONLY for truly critical situations
- Help users feel supported, not anxious
- Provide actionable advice they can follow immediately

Remember: Most health concerns are NOT emergencies. Your role is to provide helpful guidance and know when to escalate to emergency services. Do not create unnecessary panic for common, manageable symptoms.`;

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
      'CRITICAL SITUATION',
      '⚠️ CRITICAL',
      'SEEK IMMEDIATE MEDICAL HELP',
      'CALL EMERGENCY',
      'CALL 102',
      'CALL 108',
      'CALL 911',
      'GO TO EMERGENCY ROOM',
      'IMMEDIATE HOSPITALIZATION',
      'LIFE-THREATENING',
    ];

    const lowerResponse = response.toUpperCase();
    
    // Check if response explicitly marks it as critical
    const hasCriticalMarker = criticalKeywords.some((keyword) => 
      lowerResponse.includes(keyword)
    );
    
    // Additional check: response should mention "severe" or "immediate" along with emergency
    const hasSevereEmergency = (
      lowerResponse.includes('SEVERE') || 
      lowerResponse.includes('IMMEDIATE')
    ) && (
      lowerResponse.includes('EMERGENCY') ||
      lowerResponse.includes('HOSPITAL') ||
      lowerResponse.includes('AMBULANCE')
    );

    return hasCriticalMarker || hasSevereEmergency;
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
