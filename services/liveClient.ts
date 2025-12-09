import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createPcmBlob, base64ToUint8Array, decodeAudioData, PCM_SAMPLE_RATE, OUTPUT_SAMPLE_RATE } from './audioUtils';

export class LiveClient {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  
  private nextStartTime: number = 0;
  private scheduledSources: Set<AudioBufferSourceNode> = new Set();
  
  public onVolumeChange: (vol: number) => void = () => {};
  public onDisconnect: () => void = () => {};

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async connect(systemInstruction: string, voiceName: string) {
    // Initialize Audio Contexts
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: PCM_SAMPLE_RATE });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });
    
    // Get Microphone Stream
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Setup Audio Processing for Input (Mic -> Model)
    this.source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
    this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
    
    const outputNode = this.outputAudioContext.createGain();
    outputNode.connect(this.outputAudioContext.destination);

    // Initialize Gemini Live Session
    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
        systemInstruction: systemInstruction,
      },
      callbacks: {
        onopen: () => {
          console.log('Gemini Live Session Opened');
          this.startAudioProcessing();
        },
        onmessage: async (message: LiveServerMessage) => {
          this.handleServerMessage(message, outputNode);
        },
        onclose: () => {
          console.log('Gemini Live Session Closed');
          this.disconnect();
        },
        onerror: (err) => {
          console.error('Gemini Live Session Error', err);
          this.disconnect();
        }
      }
    });

    return this.sessionPromise;
  }

  private startAudioProcessing() {
    if (!this.processor || !this.source || !this.inputAudioContext) return;

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // Calculate generic volume level for visualization
      let sum = 0;
      for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
      const rms = Math.sqrt(sum / inputData.length);
      this.onVolumeChange(rms);

      const pcmBlob = createPcmBlob(inputData);
      
      this.sessionPromise?.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  private async handleServerMessage(message: LiveServerMessage, outputNode: AudioNode) {
    const serverContent = message.serverContent;
    
    if (serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
      const base64Audio = serverContent.modelTurn.parts[0].inlineData.data;
      
      if (this.outputAudioContext) {
        // Ensure playback timing is continuous
        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);

        const audioBuffer = await decodeAudioData(
          base64ToUint8Array(base64Audio),
          this.outputAudioContext
        );

        const source = this.outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputNode);
        
        source.addEventListener('ended', () => {
          this.scheduledSources.delete(source);
        });

        source.start(this.nextStartTime);
        this.scheduledSources.add(source);
        
        this.nextStartTime += audioBuffer.duration;
      }
    }

    if (serverContent?.interrupted) {
      console.log('Model interrupted by user');
      this.scheduledSources.forEach((source) => {
        try { source.stop(); } catch(e) {}
      });
      this.scheduledSources.clear();
      this.nextStartTime = 0;
    }
  }

  disconnect() {
    this.sessionPromise?.then(session => session.close()).catch(() => {}); // Attempt to close session
    
    this.source?.disconnect();
    this.processor?.disconnect();
    this.mediaStream?.getTracks().forEach(track => track.stop());
    
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();

    this.scheduledSources.forEach(s => {
      try { s.stop(); } catch(e){}
    });
    this.scheduledSources.clear();

    this.sessionPromise = null;
    this.onDisconnect();
  }
}