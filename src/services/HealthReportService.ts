import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Symptom, HealthVitals } from '../types';

export interface HealthReportData {
  summary: string;
  trends: string;
  recommendations: string[];
  riskFactors: string[];
  positiveIndicators: string[];
}

const HEALTH_REPORT_SYSTEM_INSTRUCTION = `You are a thoughtful AI Health Analyst for AuraHealth. Your role is to synthesize health data and provide comprehensive wellness insights.

GUIDELINES:
1. Analyze patterns in health data over time
2. Identify trends (improving, declining, stable)
3. Provide actionable recommendations
4. Highlight risk factors clearly
5. Celebrate positive health indicators
6. Suggest preventive measures

FORMAT FOR ANALYSIS:
- Start with a clear overall health summary
- Analyze vital trends
- Identify patterns from symptoms
- Provide specific, actionable recommendations
- List lifestyle suggestions

IMPORTANT:
- Always remind users this is AI analysis, not medical diagnosis
- Recommend professional consultation for concerning trends
- Focus on positive reinforcement
- Be supportive and encouraging

Remember: Your goal is to help users understand their health journey and empower them to make better health decisions.`;

export class GeminiHealthReportService {
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

  async generateHealthReport(
    vitals: HealthVitals[],
    symptoms: Symptom[],
    additionalNotes?: string
  ): Promise<HealthReportData> {
    if (!this.client || !this.apiKey) {
      throw new Error('API key not configured. Please set your Gemini API key in settings.');
    }

    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        systemInstruction: HEALTH_REPORT_SYSTEM_INSTRUCTION,
      });

      // Prepare health data summary
      let prompt = `Generate a comprehensive health analysis based on the following data:

RECENT VITAL READINGS (Last entries):`;

      // Add latest vitals
      const latestVitals = vitals.slice(-5);
      latestVitals.forEach((vital) => {
        prompt += `
- Date: ${vital.date}
  BP: ${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}, HR: ${vital.heartRate}, Temp: ${vital.temperature}°F, Sugar: ${vital.bloodSugar}, O2: ${vital.oxygenSaturation}%`;
      });

      prompt += `

RECENT SYMPTOMS (Last entries):`;
      const latestSymptoms = symptoms.slice(-5);
      if (latestSymptoms.length > 0) {
        latestSymptoms.forEach((symptom) => {
          prompt += `
- Date: ${symptom.date}
  Symptoms: ${symptom.symptoms.join(', ')}
  Severity: ${symptom.severity}
  Description: ${symptom.description}`;
        });
      } else {
        prompt += `
- No symptoms reported`;
      }

      if (additionalNotes) {
        prompt += `\n\nADDITIONAL NOTES: ${additionalNotes}`;
      }

      prompt += `

Please provide:
1. An overall health summary (2-3 sentences)
2. Vital trends analysis
3. Symptom patterns (if any)
4. 4-5 specific recommendations for health improvement
5. Any risk factors to monitor
6. Positive health indicators to maintain
7. Lifestyle suggestions

Format with clear sections and bullet points.`;

      const result = await model.generateContent(prompt);

      // Extract text using the .text() method
      const responseText = result.response?.text() || '';

      if (!responseText || responseText.trim().length === 0) {
        throw new Error('No response received from the model');
      }

      return this.parseHealthReport(responseText);
    } catch (error) {
      console.error('Error generating health report:', error);
      throw new Error(
        `Failed to generate health report: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private parseHealthReport(response: string): HealthReportData {
    return {
      summary: this.extractSection(response, 'summary|overall'),
      trends: this.extractSection(response, 'trend|analysis'),
      recommendations: this.extractBulletPoints(response, 'recommend'),
      riskFactors: this.extractBulletPoints(response, 'risk'),
      positiveIndicators: this.extractBulletPoints(response, 'positive|maintain'),
    };
  }

  private extractSection(response: string, sectionName: string): string {
    const regex = new RegExp(`${sectionName}[^:]*:([^]*?)(?=^[\\d]|^[A-Z][^:]*:|$)`, 'im');
    const match = response.match(regex);

    if (match) {
      return match[1].trim();
    }

    return response.substring(0, 300);
  }

  private extractBulletPoints(response: string, section: string): string[] {
    const regex = new RegExp(`${section}[^:]*:([^]*?)(?=^[\\d]|^[A-Z][^:]*:|$)`, 'im');
    const match = response.match(regex);

    if (!match) return [];

    const points = match[1]
      .split('\n')
      .map((point) => point.replace(/^[-•*\d.]\s*/, '').trim())
      .filter((point) => point.length > 0 && point.length < 200);

    return points.slice(0, 6);
  }
}

// Export a singleton instance
let reportServiceInstance: GeminiHealthReportService | null = null;

export function getHealthReportService(apiKey?: string): GeminiHealthReportService {
  if (!reportServiceInstance && apiKey) {
    reportServiceInstance = new GeminiHealthReportService(apiKey);
  }
  return reportServiceInstance || new GeminiHealthReportService('');
}

export function initializeHealthReportService(apiKey: string): GeminiHealthReportService {
  reportServiceInstance = new GeminiHealthReportService(apiKey);
  return reportServiceInstance;
}
