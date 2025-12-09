export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  description: string;
  voiceName: string;
  systemInstruction: string;
  primaryColor: string;
  avatarUrl: string;
}

export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

export interface AudioVolumeState {
  input: number;
  output: number;
}