import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ReceiptAnalysis {
  summary: string;
  medications?: {
    name: string;
    simpleName: string;
    purpose: string;
    dosage?: string;
  }[];
  diagnoses?: {
    medicalTerm: string;
    simpleExplanation: string;
  }[];
  procedures?: {
    medicalName: string;
    whatItMeans: string;
  }[];
  instructions?: string[];
  warnings?: string[];
}

const RECEIPT_ANALYZER_INSTRUCTION = `You are a Medical Receipt Analyzer AI. Your role is to analyze medical receipts, prescriptions, and medical documents to translate complex medical terminology into simple, easy-to-understand language for patients.

RESPONSIBILITIES:
1. Extract and identify key information from medical receipts:
   - Medications prescribed (with generic/brand names)
   - Medical diagnoses
   - Procedures performed
   - Doctor's instructions
   - Important warnings or precautions

2. Translate medical jargon into simple language:
   - Convert complex medical terms to everyday language
   - Explain what medications are for in simple terms
   - Clarify what diagnoses mean for the patient
   - Explain procedures in an understandable way

3. Provide clear, structured information:
   - Organize information logically
   - Highlight important instructions
   - Flag critical warnings (allergies, side effects, etc.)
   - Include dosage information when available

4. Be accurate and helpful:
   - Don't add information that's not in the receipt
   - If something is unclear, mention it
   - Always include a disclaimer that this is an AI analysis

FORMAT YOUR RESPONSE AS JSON with this structure:
{
  "summary": "A brief overview of the receipt in simple language",
  "medications": [
    {
      "name": "Medical/brand name",
      "simpleName": "Generic or common name",
      "purpose": "What this medication is for in simple terms",
      "dosage": "How much and how often (if available)"
    }
  ],
  "diagnoses": [
    {
      "medicalTerm": "The technical diagnosis",
      "simpleExplanation": "What this means in everyday language"
    }
  ],
  "procedures": [
    {
      "medicalName": "Technical procedure name",
      "whatItMeans": "Simple explanation of what was done"
    }
  ],
  "instructions": ["List of patient instructions in simple language"],
  "warnings": ["Important warnings or precautions"]
}

If any section is not applicable or not found in the receipt, use an empty array or omit it.`;

export class ReceiptAnalyzerService {
  private model: any;
  private visionModel: any;
  private genAI: GoogleGenerativeAI;
  private preferredLanguage: 'en' | 'hi' = 'en';

  constructor(apiKey: string, language: 'en' | 'hi' = 'en') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.preferredLanguage = language;
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: RECEIPT_ANALYZER_INSTRUCTION,
    });
    this.visionModel = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  setLanguage(language: 'en' | 'hi') {
    this.preferredLanguage = language;
  }

  async analyzeReceiptImage(imageFile: File, language?: 'en' | 'hi'): Promise<ReceiptAnalysis> {
    try {
      const responseLanguage = language || this.preferredLanguage;
      
      // Convert file to base64
      const base64Data = await this.fileToBase64(imageFile);
      
      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type,
          },
        },
      ];

      const languageInstruction = responseLanguage === 'hi'
        ? ' Provide all explanations in Hindi (हिंदी में). All text in the JSON response should be in Hindi language.'
        : '';

      const prompt = `Analyze this medical receipt/prescription and extract all relevant medical information. 
      Translate any medical jargon into simple, patient-friendly language.
      Provide the response in the JSON format specified in the system instructions.${languageInstruction}`;

      const result = await this.visionModel.generateContent([prompt, ...imageParts]);
      const responseText = result.response.text();
      
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[0];
        const analysis = JSON.parse(jsonString);
        return analysis as ReceiptAnalysis;
      }

      // Fallback if no structured JSON found
      return {
        summary: responseText,
        medications: [],
        diagnoses: [],
        procedures: [],
        instructions: [],
        warnings: [],
      };
    } catch (error) {
      console.error('Error analyzing receipt:', error);
      throw new Error('Failed to analyze receipt. Please try again.');
    }
  }

  async analyzeReceiptText(text: string, language?: 'en' | 'hi'): Promise<ReceiptAnalysis> {
    try {
      const responseLanguage = language || this.preferredLanguage;
      
      const languageInstruction = responseLanguage === 'hi'
        ? ' Provide all explanations in Hindi (हिंदी में). All text in the JSON response should be in Hindi language.'
        : '';

      const prompt = `Analyze this medical receipt/prescription text and extract all relevant medical information:

${text}

Translate any medical jargon into simple, patient-friendly language.
Provide the response in the JSON format specified in the system instructions.${languageInstruction}`;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[0];
        const analysis = JSON.parse(jsonString);
        return analysis as ReceiptAnalysis;
      }

      return {
        summary: responseText,
        medications: [],
        diagnoses: [],
        procedures: [],
        instructions: [],
        warnings: [],
      };
    } catch (error) {
      console.error('Error analyzing receipt text:', error);
      throw new Error('Failed to analyze receipt text. Please try again.');
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const initializeReceiptAnalyzerService = (apiKey: string, language: 'en' | 'hi' = 'en') => {
  return new ReceiptAnalyzerService(apiKey, language);
};
