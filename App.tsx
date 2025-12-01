import React, { useState, useRef, useEffect } from 'react';
import { Activity, Brain, Hexagon, Network, MessageSquare, Send, Sparkles, Info, X } from 'lucide-react';
import TopologyCanvas from './components/TopologyCanvas';
import EngramSphere from './components/EngramSphere';
import { CorrelationChart, LeakageChart } from './components/DashboardPanels';
import { streamDivotAnalysis } from './services/geminiService';
import { ChatMessage, ChatSender } from './types';

// --- Info Content Data ---
const INFO_CONTENT = {
  A: {
    title: "Quantum Phase Field",
    text: "This visualization renders the 'Tiled Valley' topology of memory formation. The geometric structure illustrates the thermodynamic energy landscape where memory engrams settle. The peaks (lighter meshes) represent high-entropy states of instability, while the valleys (darker regions) act as low-energy Attractor Basins where memories stabilize. The z-axis modulation (z = sin(3x)cos(3y)) simulates the dynamic interference patterns of neural oscillations during the encoding phase."
  },
  B: {
    title: "Criticality Hypothesis",
    text: "This graph demonstrates the 'Goldilocks Zone' in neural networks. Efficient memory systems require a balance between order and chaos. The curve peaks at ρ ≈ 0.5, the Criticality Point. Below this threshold (ρ < 0.2), the system is too stochastic to retain structure. Above it (ρ > 0.8), the system becomes rigidly locked (seizure-like). The chart highlights that maximum information integration occurs exactly at the phase transition between these two states."
  },
  C: {
    title: "Cluster Stability Metric",
    text: "This metric analyzes stability against 'Paternal Leakage'—the intrusion of external noise into established memory traces. As leakage increases (x-axis), the number of viable memory clusters (bars) collapses. The Green Zone represents healthy segregation. The Red Zone indicates a catastrophic phase transition where distinct memories merge into indistinguishable noise, modeling the entropic decay observed in neurodegenerative conditions."
  },
  D: {
    title: "Engram Self-Organization",
    text: "The Engram Sphere visualizes the physical formation of a memory trace in 3D neural space. The central Lime Node represents the primary engram seed. The surrounding Cyan Nodes depict associated neural connections. The rotating projection demonstrates the network's self-organization around new information, minimizing free energy. As the system evolves, connections stabilize into a cohesive manifold, illustrating the physical architecture of a 'thought'."
  }
};

const PanelInfoOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}> = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center animate-in fade-in duration-200 rounded-xl">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">{title}</h3>
      <p className="text-slate-300 leading-relaxed text-sm sm:text-base max-w-md border-t border-slate-800 pt-4">
        {description}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 text-slate-200 rounded-full text-sm transition-all border border-slate-700 flex items-center gap-2 group"
      >
        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        Close Analysis
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeInfoPanel, setActiveInfoPanel] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: ChatSender.AI,
      text: 'Greetings. I am your Divot Theory analyst. I can interpret the quantum topology and correlation data displayed on the dashboard. What would you like to know?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: ChatSender.USER,
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const aiMsgId = (Date.now() + 1).toString();
    let fullText = '';

    // Optimistic AI message start
    setMessages(prev => [...prev, {
      id: aiMsgId,
      sender: ChatSender.AI,
      text: '',
      timestamp: Date.now()
    }]);

    await streamDivotAnalysis(userMsg.text, (chunk) => {
      fullText += chunk;
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId ? { ...msg, text: fullText } : msg
      ));
    });

    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Hexagon className="text-cyan-400 w-8 h-8 animate-pulse" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              DIVOT THEORY <span className="text-slate-500 font-mono text-sm ml-2">v1.0.4-beta</span>
            </span>
          </div>
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              chatOpen ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze</span>
          </button>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-8rem)] h-auto pb-8 lg:pb-0">
          
          {/* Panel A: Topology */}
          <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-1 overflow-hidden backdrop-blur-sm hover:border-cyan-500/50 transition-colors h-[400px] lg:h-auto">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <h2 className="flex items-center space-x-2 text-lg font-semibold text-slate-100">
                <Network className="w-5 h-5 text-indigo-400" />
                <span>(A) "Tiled Valley" Topology</span>
              </h2>
              <p className="text-xs text-indigo-300/70 mt-1 font-mono">QUANTUM PHASE FIELD</p>
            </div>
            <button 
              onClick={() => setActiveInfoPanel('A')}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-full backdrop-blur-md transition-all border border-slate-700/50"
            >
              <Info className="w-5 h-5" />
            </button>
            
            <PanelInfoOverlay 
              isOpen={activeInfoPanel === 'A'} 
              onClose={() => setActiveInfoPanel(null)} 
              title={INFO_CONTENT.A.title}
              description={INFO_CONTENT.A.text}
            />

            <div className="w-full h-full rounded-lg bg-slate-950/50 overflow-hidden relative">
                <TopologyCanvas />
                <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-600 pointer-events-none">
                    z = sin(3x)cos(3y)
                </div>
            </div>
          </div>

          {/* Panel B: Correlation */}
          <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-4 backdrop-blur-sm hover:border-purple-500/50 transition-colors flex flex-col h-[400px] lg:h-auto">
             <div className="mb-4 flex justify-between items-start">
              <div>
                <h2 className="flex items-center space-x-2 text-lg font-semibold text-slate-100">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>(B) The "Goldilocks" Zone</span>
                </h2>
                <p className="text-xs text-purple-300/70 mt-1 font-mono">OPTIMAL ρ=0.5</p>
              </div>
              <button 
                onClick={() => setActiveInfoPanel('B')}
                className="p-2 bg-slate-800/80 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 rounded-full backdrop-blur-md transition-all border border-slate-700/50"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
            
            <PanelInfoOverlay 
              isOpen={activeInfoPanel === 'B'} 
              onClose={() => setActiveInfoPanel(null)} 
              title={INFO_CONTENT.B.title}
              description={INFO_CONTENT.B.text}
            />

            <div className="flex-1 min-h-0">
              <CorrelationChart />
            </div>
          </div>

          {/* Panel C: Leakage */}
          <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-4 backdrop-blur-sm hover:border-orange-500/50 transition-colors flex flex-col h-[400px] lg:h-auto">
             <div className="mb-4 flex justify-between items-start">
              <div>
                <h2 className="flex items-center space-x-2 text-lg font-semibold text-slate-100">
                  <Activity className="w-5 h-5 text-orange-400 rotate-180" />
                  <span>(C) Paternal Leakage Collapse</span>
                </h2>
                <p className="text-xs text-orange-300/70 mt-1 font-mono">CLUSTER STABILITY METRIC</p>
              </div>
              <button 
                onClick={() => setActiveInfoPanel('C')}
                className="p-2 bg-slate-800/80 hover:bg-orange-500/20 text-slate-400 hover:text-orange-400 rounded-full backdrop-blur-md transition-all border border-slate-700/50"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            <PanelInfoOverlay 
              isOpen={activeInfoPanel === 'C'} 
              onClose={() => setActiveInfoPanel(null)} 
              title={INFO_CONTENT.C.title}
              description={INFO_CONTENT.C.text}
            />

            <div className="flex-1 min-h-0">
              <LeakageChart />
            </div>
          </div>

          {/* Panel D: Engram */}
          <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl p-1 overflow-hidden backdrop-blur-sm hover:border-lime-500/50 transition-colors h-[400px] lg:h-auto">
             <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <h2 className="flex items-center space-x-2 text-lg font-semibold text-slate-100">
                <Brain className="w-5 h-5 text-lime-400" />
                <span>(D) Memory Self-Organization</span>
              </h2>
              <p className="text-xs text-lime-300/70 mt-1 font-mono">ATTRACTOR BASIN FORMATION</p>
            </div>
            <button 
              onClick={() => setActiveInfoPanel('D')}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-lime-500/20 text-slate-400 hover:text-lime-400 rounded-full backdrop-blur-md transition-all border border-slate-700/50"
            >
              <Info className="w-5 h-5" />
            </button>

            <PanelInfoOverlay 
              isOpen={activeInfoPanel === 'D'} 
              onClose={() => setActiveInfoPanel(null)} 
              title={INFO_CONTENT.D.title}
              description={INFO_CONTENT.D.text}
            />

            <div className="w-full h-full rounded-lg bg-slate-950/50 overflow-hidden">
              <EngramSphere />
            </div>
          </div>

        </div>
      </main>

      {/* AI Chat Overlay */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-950 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-slate-100">Divot AI Analyst</h3>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white p-1">
                ✕
            </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === ChatSender.USER ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                        msg.sender === ChatSender.USER 
                        ? 'bg-cyan-900/30 text-cyan-100 border border-cyan-800' 
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isStreaming && (
                 <div className="flex justify-start">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150" />
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/30">
            <div className="relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the topology..." 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default App;