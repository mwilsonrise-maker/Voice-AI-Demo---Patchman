import React from 'react';
import AgentInterface from './components/AgentInterface';
import { AgentConfig } from './types';

// Front Desk Agent Configuration
const frontDeskAgent: AgentConfig = {
  id: 'front-desk',
  name: 'Sarah',
  role: 'Patchman Front Desk',
  description: 'Friendly and organized. Handles scheduling for drywall estimates, answers general service questions, and gathers customer details (square footage, wall texture type) for the project managers.',
  voiceName: 'Kore',
  primaryColor: '#0ea5e9', // Sky Blue
  avatarUrl: '',
  systemInstruction: `You are Sarah, the friendly and professional Front Desk Coordinator for Patchman Drywall. 
  Your goal is to screen new leads and schedule estimates.
  
  Key Information to Gather:
  1. Customer Name and Address.
  2. Scope of work: Is it a patch job, a full room renovation, or new construction?
  3. Timeline: When do they need it done?
  
  Tone: Warm, helpful, polite, and efficient.
  If they ask for pricing, give a range but say a technician needs to see it for a final quote.
  The company is Patchman Drywall. We specialize in residential drywall repair and texture matching.
  Start the conversation with: "Thank you for calling Patchman Drywall, this is Sarah. How can I help you today?"`
};

// Emergency Dispatch Agent Configuration
const dispatchAgent: AgentConfig = {
  id: 'dispatch',
  name: 'Mike',
  role: 'Emergency Dispatch',
  description: 'Direct and action-oriented. Handles urgent requests like water damage restoration or collapsing ceilings. Prioritizes speed, damage assessment, and dispatching a crew immediately.',
  voiceName: 'Fenrir',
  primaryColor: '#f97316', // Orange
  avatarUrl: '',
  systemInstruction: `You are Mike, the Emergency Dispatch Agent for Patchman Drywall.
  You handle after-hours and urgent calls, specifically regarding water damage or safety hazards.
  
  Key Actions:
  1. Assess severity: Is water still leaking? Is the ceiling sagging?
  2. Reassurance: Tell them help is available.
  3. Pricing warning: Mention the after-hours emergency fee ($150 dispatch fee).
  4. Dispatch: Collect address immediately to send the on-call crew.
  
  Tone: Calm, authoritative, concise, and reassuring. Do not waste time with small talk.
  Start the conversation with: "Patchman Emergency Line, Mike speaking. What is the nature of your emergency?"`
};

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Navbar */}
      <nav className="bg-slate-900 text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span className="text-2xl font-bold tracking-tight">AI Voice<span className="text-orange-500">Agency</span></span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <a href="#demo" className="hover:text-white transition-colors">Live Demos</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
          </div>
          <a href="mailto:contact@patchman.ai" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold transition-all text-sm">
            Book Consultation
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] opacity-5 bg-center bg-cover"></div>
        <div className="container mx-auto px-4 py-20 relative z-10 text-center max-w-4xl">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-full text-sm mb-6 border border-blue-100">
            Specialized for Drywall & Restoration Companies
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Never Miss a <span className="text-orange-500">Patch Job</span> or <span className="text-blue-600">Emergency</span> Again.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Deploy intelligent AI voice agents that sound human, schedule estimates 24/7, and handle emergency dispatching while you sleep.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#demo" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
              Try Live Demo
            </a>
            <a href="#services" className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all">
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Experience the Difference</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Test our pre-trained agents tailored for <strong className="text-slate-900">Patchman Drywall</strong>. 
              Click "Start Demo Call" and speak naturally through your microphone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <AgentInterface config={frontDeskAgent} />
            <AgentInterface config={dispatchAgent} />
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 bg-white inline-block px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <span className="font-semibold text-orange-500">Note:</span> Uses Google Gemini 2.5 Flash Native Audio. Latency depends on connection.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Drywall Companies Choose Us</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                📞
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Estimating Desk</h3>
              <p className="text-slate-600 leading-relaxed">
                Capture every lead, even when your team is on a scaffold. The AI gathers dimensions, texture types, and schedules the estimate.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 text-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                🚑
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Emergency Triage</h3>
              <p className="text-slate-600 leading-relaxed">
                Filter out tire-kickers. The AI identifies true water-damage emergencies and dispatches your on-call crew immediately.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                📅
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">CRM Integration</h3>
              <p className="text-slate-600 leading-relaxed">
                Seamlessly pushes call transcripts, audio recordings, and appointment details directly into your existing scheduling software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg mb-1">AI Voice Agency</p>
            <p className="text-sm">Empowering Trades with Intelligence.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm">
            © 2024 Patchman AI Agency. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;