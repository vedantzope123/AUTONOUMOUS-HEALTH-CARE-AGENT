export type SupportedLanguage = 'en-US' | 'hi-IN';

export interface VoiceSettings {
  speechLanguage: SupportedLanguage;
  voiceLanguage: SupportedLanguage;
  rate: number; // 0.5 to 2
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
}

export class VoiceAssistantService {
  private recognition: any | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private settings: VoiceSettings;

  constructor(settings?: Partial<VoiceSettings>) {
    this.settings = {
      speechLanguage: settings?.speechLanguage || 'en-US',
      voiceLanguage: settings?.voiceLanguage || 'en-US',
      rate: settings?.rate || 1,
      pitch: settings?.pitch || 1,
      volume: settings?.volume || 1,
    };

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  updateSettings(settings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...settings };
    if (this.recognition) {
      this.recognition.lang = this.settings.speechLanguage;
    }
  }

  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  isSupported(): boolean {
    return this.recognition !== null && this.synthesis !== null;
  }

  async startListening(): Promise<string> {
    if (!this.recognition) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    if (this.isListening) {
      throw new Error('Already listening');
    }

    return new Promise((resolve, reject) => {
      this.recognition.lang = this.settings.speechLanguage;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, language?: SupportedLanguage): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis is not supported in this browser'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language || this.settings.voiceLanguage;
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      // Try to find a voice for the specified language
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(utterance.lang.split('-')[0])
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) {
      return [];
    }
    return this.synthesis.getVoices();
  }

  // Helper to get voices for a specific language
  getVoicesForLanguage(language: SupportedLanguage): SpeechSynthesisVoice[] {
    const allVoices = this.getAvailableVoices();
    const langCode = language.split('-')[0];
    return allVoices.filter(voice => voice.lang.startsWith(langCode));
  }

  // Translate and speak (if you want to add translation later)
  async speakInPreferredLanguage(text: string): Promise<void> {
    // For now, just speak in the preferred language
    // You can add translation API integration here if needed
    return this.speak(text, this.settings.voiceLanguage);
  }
}

let voiceAssistantInstance: VoiceAssistantService | null = null;

export const getVoiceAssistant = (settings?: Partial<VoiceSettings>): VoiceAssistantService => {
  if (!voiceAssistantInstance) {
    voiceAssistantInstance = new VoiceAssistantService(settings);
  } else if (settings) {
    voiceAssistantInstance.updateSettings(settings);
  }
  return voiceAssistantInstance;
};

export const resetVoiceAssistant = () => {
  if (voiceAssistantInstance) {
    voiceAssistantInstance.stopListening();
    voiceAssistantInstance.stopSpeaking();
  }
  voiceAssistantInstance = null;
};
