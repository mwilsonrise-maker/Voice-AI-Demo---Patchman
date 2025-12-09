import React, { useState, useRef, useEffect } from 'react';
import { AgentConfig, ConnectionStatus } from '../types';
import { LiveClient } from '../services/liveClient';
import Waveform from './Waveform';

interface AgentInterfaceProps {
  config: AgentConfig;
}

const AgentInterface: React.FC<AgentInterfaceProps> = ({ config }) => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [volume, setVolume] = useState(0);
  const clientRef = useRef<LiveClient | null>(null);

  const toggleConnection = async () => {
    if (status === ConnectionStatus.CONNECTED || status === ConnectionStatus.CONNECTING) {
      handleDisconnect();
    } else {
      handleConnect();
    }
  };

  const handleConnect = async () => {
    try {
      setStatus(ConnectionStatus.CONNECTING);
      
      const client = new LiveClient();
      clientRef.current = client;

      // Hook up volume visualizer
      client.onVolumeChange = (vol) => {
        // Smooth volume for visuals
        setVolume(prev => prev * 0.8 + vol * 0.2); 
      };

      client.onDisconnect = () => {
        setStatus(ConnectionStatus.DISCONNECTED);
        setVolume(0);
      };

      await client.connect(config.systemInstruction, config.voiceName);
      setStatus(ConnectionStatus.CONNECTED);

    } catch (error) {
      console.error("Failed to connect:", error);
      setStatus(ConnectionStatus.ERROR);
      // Reset after error
      setTimeout(() => setStatus(ConnectionStatus.DISCONNECTED), 3000);
    }
  };

  const handleDisconnect = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setStatus(ConnectionStatus.DISCONNECTED);
    setVolume(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col h-full transform transition-all hover:scale-[1.01] hover:shadow-2xl">
      {/* Header */}
      <div className={`p-6 text-white`} style={{ backgroundColor: config.primaryColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border-2 border-white/50">
              {config.name[0]}
            </div>
            <div>
              <h3 className="text-xl font-bold">{config.name}</h3>
              <p className="text-sm opacity-90 font-medium">{config.role}</p>
            </div>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md uppercase tracking-wider">
            {config.voiceName} Voice
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
        <div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {config.description}
          </p>

          <div className="bg-slate-50 rounded-xl border border-slate-100 p-2 shadow-inner">
             <Waveform 
                isActive={status === ConnectionStatus.CONNECTED} 
                volume={volume} 
                color={config.primaryColor}
             />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center gap-4">
            {status === ConnectionStatus.ERROR && (
                <span className="text-red-500 text-sm font-semibold animate-pulse">Connection Failed. Check API Key or Mic Permissions.</span>
            )}
            {status === ConnectionStatus.CONNECTING && (
                <span className="text-slate-500 text-sm font-semibold animate-pulse">Establishing secure line...</span>
            )}
             {status === ConnectionStatus.CONNECTED && (
                <span className="text-green-600 text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live & Listening
                </span>
            )}

          <button
            onClick={toggleConnection}
            disabled={status === ConnectionStatus.CONNECTING}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2
              ${status === ConnectionStatus.CONNECTED 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === ConnectionStatus.CONNECTED ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  End Call
                </>
            ) : (
                <>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                  {status === ConnectionStatus.CONNECTING ? 'Connecting...' : 'Start Demo Call'}
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentInterface;