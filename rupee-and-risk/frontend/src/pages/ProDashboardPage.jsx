import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import {
    Database, Search, Filter, ArrowUpDown, Download, Settings, CreditCard,
    LayoutTemplate, LogOut, Code, Activity, TrendingUp, X, ExternalLink,
    ShieldAlert, Cpu, MessageSquare, Send, FileText, Star, Bookmark,
    BarChart2, ChevronRight, Loader2, CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function ProDashboardPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'heatmap' | 'screeners' | 'transcript'
    const [sidebarTab, setSidebarTab] = useState('overview'); // 'overview' | 'chat' | 'pdf'
    const [transcriptData, setTranscriptData] = useState(null);
    const [transcriptLoading, setTranscriptLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // AI Chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Saved Screeners state
    const [savedScreeners, setSavedScreeners] = useState([
        { id: 1, name: 'Defence + Stage 2', filters: 'Sector: Defence, Stage: 2', count: 3 },
        { id: 2, name: 'High RS > 85', filters: 'RS Rating: > 85', count: 5 },
    ]);
    const [screenerName, setScreenerName] = useState('');

    // PDF generation state
    const [pdfGenerating, setPdfGenerating] = useState(false);
    const [pdfDone, setPdfDone] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!token) return;
        
        axios.get(`${API}/api/companies`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => { setCompanies(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [token]);

    // Reset chat when switching company
    useEffect(() => {
        if (selectedCompany) {
            setChatMessages([{
                role: 'assistant',
                text: `Hello! I'm your AI Analyst for **${selectedCompany.name}**. Ask me anything about their ${selectedCompany.quarter || 'latest'} earnings — triggers, risks, management guidance, or strategy.`
            }]);
            setSidebarTab('overview');
            setPdfDone(false);
            setIsSidebarOpen(true);
            if (activeTab === 'transcript') setActiveTab('grid');
            setTranscriptData(null);
        }
    }, [selectedCompany?.id]);

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // ---- Helpers ----
    const getTriggers = (triggerText, truncateLength = 47) => {
        if (!triggerText) return [];
        const rawLines = triggerText.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('**Stage'));
        const tags = rawLines.map(l => {
            const clean = l.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim();
            if (truncateLength === -1) return clean;
            return clean.length > truncateLength ? clean.substring(0, truncateLength) + '...' : clean;
        });
        return tags.slice(0, 4);
    };

    const getStage = (triggerText) => {
        if (!triggerText) return 'Stage 2';
        const m = triggerText.match(/Stage\s*\d/i);
        return m ? m[0] : 'Stage 2';
    };

    const getIndustry = (ticker) => {
        const hash = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const ind = ['Aerospace & Defence', 'FMCG - Personal Care', 'Capital Goods', 'IT - Software', 'Banks - Small Finance', 'Textiles', 'Metals'];
        return ind[hash % ind.length];
    };

    const getRS = (ticker) => {
        const hash = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return 65 + (hash % 35);
    };

    const getMCap = (ticker) => {
        const hash = ticker.split('').reduce((a, b) => a * b.charCodeAt(0), 1);
        return ((hash % 80000) + 1200).toLocaleString('en-IN') + '.00';
    };

    const getSentiment = (ticker) => {
        const h = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return [
            { q: 'Q1 FY25', s: 55 + (h % 20) },
            { q: 'Q2 FY25', s: 60 + (h % 18) },
            { q: 'Q3 FY25', s: 65 + (h % 22) },
            { q: 'Q4 FY25', s: 70 + (h % 25) },
            { q: 'Q1 FY26', s: 75 + (h % 20) },
        ];
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ---- AI Chat ----
    const sendChat = async () => {
        if (!chatInput.trim() || chatLoading || !selectedCompany) return;
        const userMsg = { role: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setChatLoading(true);
        try {
            const res = await axios.post(`${API}/api/chat/${selectedCompany.ticker}`, 
                { question: chatInput },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChatMessages(prev => [...prev, { role: 'assistant', text: res.data.answer }]);
        } catch {
            setChatMessages(prev => [...prev, { role: 'assistant', text: '⚠️ AI Analyst temporarily unavailable. Please ensure the backend is running.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    const loadTranscript = async () => {
        setActiveTab('transcript');
        setIsSidebarOpen(false); // Collapse sidebar immediately for larger view
        setTranscriptLoading(true);
        try {
            const res = await axios.get(`${API}/api/company/${selectedCompany.ticker}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTranscriptData(res.data);
        } catch (e) {
            console.error(e);
            alert("Failed to load transcript.");
        } finally {
            setTranscriptLoading(false);
        }
    };

    // ---- PDF Tear Sheet ----
    const generatePDF = () => {
        if (!selectedCompany) return;
        setPdfGenerating(true);
        setPdfDone(false);
        // Build a printable HTML blob and open print dialog
        setTimeout(() => {
            const triggers = getTriggers(selectedCompany.growth_triggers);
            const sentiment = getSentiment(selectedCompany.ticker);
            const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${selectedCompany.name} — Rupee And Risk Tear Sheet</title>
<style>
  body { font-family: 'Arial', sans-serif; background: #fff; color: #111; margin: 0; padding: 32px; }
  h1 { font-size: 28px; margin: 0; } h2 { font-size: 13px; color: #555; margin-top: 4px; font-weight: normal; }
  .header { border-bottom: 3px solid #00e659; padding-bottom: 16px; margin-bottom: 24px; display:flex; justify-content:space-between; align-items:flex-end; }
  .badge { background: #00e659; color: #000; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 20px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .stat { background: #f8f8f8; border-radius: 8px; padding: 14px; }
  .stat-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .stat-value { font-size: 20px; font-weight: bold; margin-top: 4px; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  .tag { display: inline-block; background: #e8f8f0; color: #006b2e; border: 1px solid #b7e6cc; border-radius: 4px; padding: 3px 9px; font-size: 11px; font-weight: bold; margin: 3px; }
  p { font-size: 13px; line-height: 1.7; color: #333; }
  .sentiment { display:flex; gap:8px; align-items:flex-end; }
  .bar { width: 36px; border-radius: 4px 4px 0 0; background: #00e659; }
  .bar-label { font-size: 9px; text-align:center; color:#888; margin-top:4px; }
  .footer { margin-top: 32px; border-top: 1px solid #eee; padding-top: 12px; font-size: 10px; color: #aaa; display:flex; justify-content:space-between; }
</style></head><body>
<div class="header">
  <div><h1>${selectedCompany.name}</h1><h2>${selectedCompany.ticker} · NSE · ${selectedCompany.quarter || 'Q3 FY26'}</h2></div>
  <div><span class="badge">RUPEE AND RISK PRO</span></div>
</div>
<div class="grid">
  <div class="stat"><div class="stat-label">Market Cap</div><div class="stat-value">₹${getMCap(selectedCompany.ticker)} Cr</div></div>
  <div class="stat"><div class="stat-label">RS Rating</div><div class="stat-value" style="color:#00a048">${getRS(selectedCompany.ticker)} / 99</div></div>
  <div class="stat"><div class="stat-label">Industry</div><div class="stat-value" style="font-size:15px">${getIndustry(selectedCompany.ticker)}</div></div>
</div>
<div class="section"><div class="section-title">Business Overview</div><p>${selectedCompany.summary || 'Not available.'}</p></div>
<div class="section"><div class="section-title">Extracted Growth Catalysts</div>${triggers.map(t => `<span class="tag">${t}</span>`).join('')}</div>
<div class="section"><div class="section-title">Historical Sentiment Tracker</div>
<div class="sentiment">${sentiment.map(s => `<div><div class="bar" style="height:${s.s * 0.7}px"></div><div class="bar-label">${s.q.replace(' F', '<br>F')}<br>${s.s}</div></div>`).join('')}</div></div>
<div class="section"><div class="section-title">Key Risks</div><p>• Margin compression from raw material volatility.<br>• Capacity expansion delays affecting top-line guidance.</p></div>
<div class="footer"><span>Generated by Rupee And Risk PRO · rupee-and-risk.com</span><span>${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
</body></html>`;
            const w = window.open('', '_blank');
            if (w) { w.document.write(html); w.document.close(); w.print(); }
            setPdfGenerating(false);
            setPdfDone(true);
        }, 1200);
    };

    // ---- Saved Screeners ----
    const saveScreener = () => {
        if (!screenerName.trim()) return;
        setSavedScreeners(prev => [...prev, {
            id: Date.now(),
            name: screenerName,
            filters: `Search: "${searchQuery || 'All'}"`,
            count: filteredCompanies.length
        }]);
        setScreenerName('');
    };

    // ===========================
    // RENDER
    // ===========================
    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#00e659]/30">

            {/* ── LEFT SIDEBAR ── */}
            <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full flex-shrink-0 relative z-20">
                <div className="absolute top-0 left-0 w-full h-32 bg-[#00e659] opacity-[0.03] blur-2xl pointer-events-none" />

                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-white/5 relative z-10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-[#00e659] text-black w-7 h-7 rounded flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(0,230,89,0.3)] group-hover:shadow-[0_0_25px_rgba(0,230,89,0.5)] transition-shadow">R</div>
                        <span className="font-bold tracking-tight text-white group-hover:text-[#00e659] transition-colors">Rupee And Risk <span className="text-[#00e659] ml-1">PRO</span></span>
                    </Link>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 relative z-10">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest px-3 mb-4 mt-2">Intelligence</div>

                    {[
                        { id: 'grid', icon: <Database className="h-4 w-4" />, label: 'Intelligence Grid', color: 'text-[#00e659]' },
                        { id: 'heatmap', icon: <Activity className="h-4 w-4" />, label: 'Sector Aggregation', color: 'text-blue-400' },
                        { id: 'screeners', icon: <LayoutTemplate className="h-4 w-4" />, label: 'Saved Screeners', color: 'text-purple-400' },
                    ].map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-white/5 text-white border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <span className={activeTab === item.id ? item.color : ''}>{item.icon}</span>
                            <span className="text-sm font-semibold">{item.label}</span>
                        </button>
                    ))}

                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest px-3 mb-4 mt-8">Developer</div>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Code className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-semibold">API Access <span className="ml-2 text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Beta</span></span>
                    </button>
                </div>

                {/* Bottom */}
                <div className="p-4 border-t border-white/5 relative z-10">
                    <div onClick={() => alert("Preferences module coming in Phase 5.")} className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white cursor-pointer transition-colors"><Settings className="h-4 w-4" /><span className="text-sm font-semibold">Preferences</span></div>
                    <Link to="/pricing" className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white cursor-pointer transition-colors"><CreditCard className="h-4 w-4" /><span className="text-sm font-semibold">Billing</span></Link>
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors mt-2">
                        <LogOut className="h-4 w-4" /><span className="text-sm font-semibold">Exit Terminal</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN AREA ── */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505] relative">

                {/* Top Bar */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur-xl shrink-0 z-10">
                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        Global Growth Triggers
                        <span className="bg-[#00e659]/10 border border-[#00e659]/20 text-[#00e659] px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest">{companies.length} Records</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="text" placeholder="Search ticker or company..."
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-1.5 bg-[#111111] border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00e659] focus:ring-1 focus:ring-[#00e659] transition-all w-64" />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors">
                            <Filter className="h-4 w-4" /> Filter
                        </button>
                    </div>
                </header>

                {/* Sub-tabs */}
                <div className="h-10 border-b border-gray-800 bg-[#0f0f0f] flex items-center px-4 gap-6 shrink-0 z-10 overflow-x-auto select-none">
                    <div className="flex items-center gap-2 font-bold text-white border-b-2 border-[#00e659] h-full px-2 text-xs cursor-pointer">
                        {activeTab === 'grid' ? '⊞ Master Grid' : activeTab === 'heatmap' ? '📊 Macro Sector Heatmap' : '🔖 Saved Screeners'}
                    </div>
                    {activeTab === 'grid' && (<>
                        <div onClick={() => setSearchQuery('Capex')} className="flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-300 transition-colors h-full px-2 text-xs cursor-pointer">Capex Expansion</div>
                        <div onClick={() => setSearchQuery('Leverage')} className="flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-300 transition-colors h-full px-2 text-xs cursor-pointer">Operating Leverage</div>
                        <div onClick={() => setSearchQuery('Stage 2')} className="flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-300 transition-colors h-full px-2 text-xs cursor-pointer">Stage 2 Trackers</div>
                    </>)}
                    <div onClick={() => { setSearchQuery(searchQuery); /* mock refresh */ }} className="flex items-center gap-2 font-semibold text-purple-500 hover:text-purple-400 transition-colors h-full px-2 text-xs cursor-pointer ml-auto active:scale-95">
                        <TrendingUp className="h-3 w-3" /> Real-time Sync Active
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto relative bg-[#050505] p-6 lg:p-8">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <div className="w-10 h-10 border-4 border-gray-800 border-t-[#00e659] rounded-full animate-spin mb-4" />
                            <p className="font-mono text-xs uppercase tracking-widest">Querying Intelligence Pipeline...</p>
                        </div>
                    ) : (<>

                        {/* ── Intelligence Grid ── */}
                        {activeTab === 'grid' && (
                            <div className="bg-[#0a0a0a] rounded-2xl border border-gray-800 shadow-2xl overflow-x-auto min-w-full">
                                {/* Header Row */}
                                <div className="flex text-[11px] uppercase tracking-widest text-gray-500 font-bold bg-[#111111] border-b border-gray-800 sticky top-0 z-20 w-max min-w-full">
                                    <div className="w-14 shrink-0 py-3 border-r border-gray-800 flex items-center justify-center">#</div>
                                    <div className="w-48 shrink-0 px-4 py-3 flex items-center border-r border-gray-800 cursor-pointer hover:text-white group">Company <ArrowUpDown className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100" /></div>
                                    <div className="w-28 shrink-0 px-4 py-3 flex items-center justify-end border-r border-gray-800">Market Cap (Cr)</div>
                                    <div className="w-40 shrink-0 px-4 py-3 flex items-center border-r border-gray-800">Industry</div>
                                    <div className="w-20 shrink-0 px-4 py-3 flex items-center justify-center border-r border-gray-800">RS</div>
                                    <div className="w-28 shrink-0 px-4 py-3 flex items-center border-r border-gray-800 cursor-pointer hover:text-white group">Stage <ArrowUpDown className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100" /></div>
                                    <div className="w-60 shrink-0 px-4 py-3 flex items-center border-r border-gray-800">Business Overview</div>
                                    <div className="w-48 shrink-0 px-4 py-3 flex items-center border-r border-gray-800">Catalysts</div>
                                    <div className="flex-1 min-w-[280px] px-4 py-3 flex items-center">Triggers</div>
                                </div>
                                {/* Body */}
                                <div className="flex flex-col min-w-full w-max">
                                    {filteredCompanies.length === 0 ? (
                                        <div className="p-12 text-center text-gray-500 text-sm">No companies found for "{searchQuery}"</div>
                                    ) : filteredCompanies.map((company, idx) => (
                                        <div key={company.id} className="flex border-b border-gray-800/50 hover:bg-[#111111] transition-colors group">
                                            <div className="w-14 shrink-0 border-r border-gray-800/50 flex items-center justify-center text-gray-600 font-mono text-[10px]">{idx + 1}</div>

                                            <div className="w-48 shrink-0 px-4 py-4 flex flex-col justify-center border-r border-gray-800/50 cursor-pointer group/n" onClick={() => setSelectedCompany(company)}>
                                                <span className="font-bold text-white group-hover/n:text-[#00e659] transition-colors truncate">{company.name}</span>
                                                <div className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-2 mt-1">
                                                    <span>{company.ticker}</span><span className="w-1 h-1 rounded-full bg-gray-700" /><span>NSE</span>
                                                </div>
                                            </div>

                                            <div className="w-28 shrink-0 px-4 py-4 flex items-center justify-end border-r border-gray-800/50">
                                                <span className="text-gray-400 font-mono text-[11px]">{getMCap(company.ticker)}</span>
                                            </div>
                                            <div className="w-40 shrink-0 px-4 py-4 flex items-center border-r border-gray-800/50">
                                                <span className="text-gray-400 text-xs truncate">{getIndustry(company.ticker)}</span>
                                            </div>
                                            <div className="w-20 shrink-0 px-4 py-4 flex items-center justify-center border-r border-gray-800/50">
                                                <span className="text-gray-400 font-mono text-[11px]">{getRS(company.ticker)}</span>
                                            </div>
                                            <div className="w-28 shrink-0 px-4 py-4 flex items-center border-r border-gray-800/50">
                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 flex items-center gap-1.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {getStage(company.growth_triggers)}
                                                </span>
                                            </div>
                                            <div className="w-60 shrink-0 px-4 py-4 border-r border-gray-800/50 flex items-center">
                                                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{company.summary}</p>
                                            </div>
                                            <div className="w-48 shrink-0 px-4 py-4 flex flex-col justify-center gap-1.5 border-r border-gray-800/50">
                                                {getTriggers(company.growth_triggers).slice(0, 2).map((t, i) => (
                                                    <span key={i} className={`px-2 py-0.5 rounded border text-[9px] font-bold tracking-wide truncate w-full ${i === 0 ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'}`}>{t}</span>
                                                ))}
                                            </div>
                                            <div className="flex-1 min-w-[280px] px-4 py-4 flex items-center">
                                                <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed border-l-[3px] border-[#00e659]/30 pl-3">
                                                    {company.growth_triggers ? company.growth_triggers.replace(/[*#]/g, '').trim() : 'No trigger data available.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Sector Aggregation Heatmap ── */}
                        {activeTab === 'heatmap' && (
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">Sector Aggregation Matrix</h2>
                                    <p className="text-gray-500 text-sm mt-1">Live macro-level intelligence grouping by industry and trend velocity.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(
                                        filteredCompanies.reduce((acc, c) => {
                                            const ind = getIndustry(c.ticker);
                                            if (!acc[ind]) acc[ind] = { count: 0, rsSum: 0, companies: [] };
                                            acc[ind].count += 1;
                                            acc[ind].rsSum += getRS(c.ticker);
                                            acc[ind].companies.push(c);
                                            return acc;
                                        }, {})
                                    ).map(([ind, data], i) => (
                                        <div key={i} className="bg-[#0a0a0a] rounded-2xl border border-gray-800 p-6 flex flex-col group hover:border-[#00e659]/30 transition-all cursor-pointer">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{ind}</h3>
                                                <span className="text-xs font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">{data.count} Filings</span>
                                            </div>
                                            <div className="flex items-center gap-4 mb-6 pt-4 border-t border-gray-800/50">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">Avg RS</span>
                                                    <span className="text-lg font-bold text-[#00e659]">{Math.round(data.rsSum / data.count)}</span>
                                                </div>
                                                <div className="flex flex-col border-l border-gray-800 pl-4">
                                                    <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">Catalysts</span>
                                                    <span className="text-sm font-bold text-amber-500 pt-1">{Math.max(1, Math.round(data.count * 0.4))} Major</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-auto">
                                                {data.companies.slice(0, 3).map((c, j) => (
                                                    <div key={j} className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-400 truncate w-32">{c.name}</span>
                                                        <span className="text-[10px] font-mono text-gray-600 uppercase bg-gray-900 px-1 rounded">{getStage(c.growth_triggers)}</span>
                                                    </div>
                                                ))}
                                                {data.count > 3 && <div className="text-[10px] text-gray-500 mt-1 italic text-center">+ {data.count - 3} more</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Saved Screeners ── */}
                        {activeTab === 'screeners' && (
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">Sentinel Screeners</h2>
                                    <p className="text-gray-500 text-sm mt-1">Save complex filter combinations and get alerted when new companies match.</p>
                                </div>

                                {/* Save new screener */}
                                <div className="bg-[#0a0a0a] rounded-2xl border border-gray-800 p-6 mb-6">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bookmark className="w-4 h-4 text-purple-400" /> Save Current View as Screener</h3>
                                    <div className="flex gap-3">
                                        <input type="text" placeholder='e.g. "Defence + High RS + Stage 2"'
                                            value={screenerName} onChange={e => setScreenerName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && saveScreener()}
                                            className="flex-1 bg-[#111111] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
                                        <button onClick={saveScreener}
                                            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2">
                                            <Star className="w-4 h-4" /> Save
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">Will save: {filteredCompanies.length} companies matching current search filter.</p>
                                </div>

                                <div className="space-y-4">
                                    {savedScreeners.map(s => (
                                        <div key={s.id} className="bg-[#0a0a0a] rounded-2xl border border-gray-800 p-5 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                                    <LayoutTemplate className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-purple-300 transition-colors">{s.name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{s.filters}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-mono text-gray-400">{s.count} matches</span>
                                                <button className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1">Run <ChevronRight className="w-3 h-3" /></button>
                                                <button onClick={() => setSavedScreeners(prev => prev.filter(x => x.id !== s.id))} className="text-gray-600 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Dynamic Article Transcript Viewer ── */}
                        {activeTab === 'transcript' && selectedCompany && (
                            <div className="max-w-4xl mx-auto pb-32">
                                <div className="mb-8 flex items-center justify-between">
                                    <div>
                                        <button onClick={() => setActiveTab('grid')} className="text-[#00e659] text-xs font-bold flex items-center gap-1 hover:underline mb-4">← Back to Master Grid</button>
                                        <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-2">{selectedCompany.name}</h2>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-[10px]">{selectedCompany.ticker}</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-300 font-semibold">{selectedCompany.quarter}</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-[#00e659]/80 font-mono text-xs">AI SYNTHESIS ACTIVE</span>
                                        </div>
                                    </div>
                                    {!isSidebarOpen && (
                                        <button onClick={() => setIsSidebarOpen(true)} className="px-5 py-2.5 bg-[#111] hover:bg-[#1a1a1a] shadow-lg border border-gray-800 rounded-xl text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 transition-all group shrink-0">
                                            <MessageSquare className="w-4 h-4 text-[#00e659] group-hover:animate-pulse" /> Pop-out AI Window
                                        </button>
                                    )}
                                </div>

                                {transcriptLoading ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#00e659] mb-4" />
                                        <p className="font-mono text-xs uppercase tracking-widest">Decrypting Institutional Filing...</p>
                                    </div>
                                ) : transcriptData && (
                                    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-[#00e659]">
                                        {/* Bottom Line */}
                                        {transcriptData.key_takeaway && (
                                            <div className="p-6 bg-[#00e659]/5 border border-[#00e659]/20 rounded-xl mb-10 relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00e659]"></div>
                                                <h3 className="text-xs text-[#00e659] font-bold mb-2 uppercase tracking-widest m-0">The Bottom Line</h3>
                                                <p className="text-lg font-medium text-white m-0 leading-relaxed">{transcriptData.key_takeaway}</p>
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold flex items-center gap-2 mt-12 mb-6"><div className="w-1.5 h-6 bg-[#00e659] rounded-sm"></div> Financial Overview</h3>
                                        {transcriptData.financials && transcriptData.financials.length > 0 ? (
                                            <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0a0a0a]">
                                                <table className="w-full text-left text-sm m-0">
                                                    <thead>
                                                        <tr className="bg-[#111] border-b border-gray-800">
                                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metric</th>
                                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Value</th>
                                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commentary</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-800/50">
                                                        {transcriptData.financials.map((item, i) => (
                                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                                <td className="py-4 px-6 font-semibold text-gray-200">{item.metric_name}</td>
                                                                <td className="py-4 px-6 font-bold text-[#00e659]">{item.value}</td>
                                                                <td className="py-4 px-6 text-gray-400 leading-relaxed text-sm">{item.commentary}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : <p className="text-gray-500 italic text-sm">No financials available.</p>}

                                        <h3 className="text-xl font-bold flex items-center gap-2 mt-12 mb-6"><div className="w-1.5 h-6 bg-[#00e659] rounded-sm"></div> Guidance & Outlook</h3>
                                        {transcriptData.guidance && transcriptData.guidance.length > 0 ? (
                                            <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0a0a0a]">
                                                <table className="w-full text-left text-sm m-0">
                                                    <thead>
                                                        <tr className="bg-[#111] border-b border-gray-800">
                                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metric</th>
                                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outlook</th>
                                                            <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Context</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-800/50">
                                                        {transcriptData.guidance.map((item, i) => (
                                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                                <td className="py-4 px-6 font-semibold text-gray-200">{item.metric}</td>
                                                                <td className="py-4 px-6 font-bold text-white">{item.outlook}</td>
                                                                <td className="py-4 px-6 text-gray-400 leading-relaxed text-sm">{item.commentary}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : <p className="text-gray-500 italic text-sm">No guidance provided.</p>}

                                        <h3 className="text-xl font-bold flex items-center gap-2 mt-12 mb-6"><div className="w-1.5 h-6 bg-amber-500 rounded-sm"></div> Key Risks & Headwinds</h3>
                                        {transcriptData.risks && transcriptData.risks.length > 0 ? (
                                            <div className="grid gap-4">
                                                {transcriptData.risks.map((item, i) => (
                                                    <div key={i} className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/20 flex gap-4">
                                                        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-bold text-amber-50 text-base mb-1 m-0">{item.risk}</h4>
                                                            <p className="text-amber-100/60 leading-relaxed m-0 text-sm">{item.context}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-gray-500 italic text-sm">No risks documented.</p>}

                                        <h3 className="text-xl font-bold flex items-center gap-2 mt-12 mb-6"><div className="w-1.5 h-6 bg-[#00e659] rounded-sm"></div> Strategic & Geographic Focus</h3>
                                        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 text-sm space-y-4">
                                            {transcriptData.strategic_commentary && transcriptData.strategic_commentary.split('\n').filter(Boolean).map((l, i) => (
                                                <div key={'s'+i} className="flex gap-3 items-start text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />{l.replace(/^[-•*]\s*/, '')}</div>
                                            ))}
                                            {transcriptData.geographic_commentary && transcriptData.geographic_commentary.split('\n').filter(Boolean).map((l, i) => (
                                                <div key={'g'+i} className="flex gap-3 items-start text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />{l.replace(/^[-•*]\s*/, '')}</div>
                                            ))}
                                        </div>

                                        <h3 className="text-xl font-bold flex items-center gap-2 mt-12 mb-6"><div className="w-1.5 h-6 bg-blue-500 rounded-sm"></div> Q&A Highlights</h3>
                                        {transcriptData.qa_highlights ? (
                                            <div className="bg-[#0a0a0a] p-6 rounded-xl border border-gray-800 text-sm space-y-4 text-gray-400 leading-relaxed">
                                                {transcriptData.qa_highlights.split('\n').filter(Boolean).map((l, i) => (
                                                    <div key={i} className="flex gap-3 items-start"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />{l.replace(/^[-•*]\s*/, '')}</div>
                                                ))}
                                            </div>
                                        ) : <p className="text-gray-500 italic text-sm">No Q&A tracked.</p>}
                                    </div>
                                )}
                            </div>
                        )}

                    </>)}
                </div>

                {/* ── EXPANDING RIGHT SIDEBAR ── */}
                {selectedCompany && isSidebarOpen && (
                    <div className="absolute top-0 right-0 w-[460px] h-full bg-[#0a0a0a] border-l border-gray-800 shadow-[0_0_60px_rgba(0,0,0,0.9)] z-50 flex flex-col">

                        {/* Sidebar Header */}
                        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-5 shrink-0 bg-[#0f0f0f]">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedCompany(null)} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                <h2 className="text-base font-bold text-white truncate max-w-[200px]">{selectedCompany.name}</h2>
                            </div>
                            <div className="flex items-center gap-1">
                                {[
                                    { id: 'overview', icon: <BarChart2 className="w-4 h-4" />, label: 'Overview' },
                                    { id: 'chat', icon: <MessageSquare className="w-4 h-4" />, label: 'AI Chat' },
                                    { id: 'pdf', icon: <FileText className="w-4 h-4" />, label: 'Tear Sheet' },
                                ].map(t => (
                                    <button key={t.id} onClick={() => setSidebarTab(t.id)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${sidebarTab === t.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
                                        {t.icon} {t.label}
                                    </button>
                                ))}
                                <Link to={`/deep-dives/${selectedCompany.ticker}`} className="p-1.5 hover:bg-[#00e659]/10 text-[#00e659] rounded-lg transition-colors ml-1"><ExternalLink className="w-4 h-4" /></Link>
                            </div>
                        </div>

                        {/* ── Overview Tab ── */}
                        {sidebarTab === 'overview' && (
                            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-[#111111] border border-gray-800">
                                        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">Market Cap</span>
                                        <div className="text-sm font-bold text-white font-mono mt-1">₹{getMCap(selectedCompany.ticker)} Cr</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#111111] border border-gray-800">
                                        <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">RS Rating</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-[#00e659] animate-pulse" />
                                            <span className="text-sm font-bold text-[#00e659] font-mono">{getRS(selectedCompany.ticker)} / 99</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Business Overview */}
                                <div>
                                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-2 flex items-center gap-2"><Database className="w-3 h-3 text-purple-400" /> Business Overview</h3>
                                    <p className="text-sm text-gray-300 leading-relaxed bg-[#111111]/50 p-4 rounded-xl border border-gray-800/50">{selectedCompany.summary || 'Summary not available.'}</p>
                                </div>

                                {/* Catalysts */}
                                <div>
                                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-2 flex items-center gap-2"><Cpu className="w-3 h-3 text-blue-400" /> Extracted Catalysts</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {getTriggers(selectedCompany.growth_triggers, -1).map((t, i) => (
                                            <div key={i} className="px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[11px] font-bold tracking-wide">{t}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Triggers */}
                                <div>
                                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-2 flex items-center gap-2"><TrendingUp className="w-3 h-3 text-[#00e659]" /> Live Growth Triggers</h3>
                                    <div className="bg-[#111111]/50 p-4 rounded-xl border border-gray-800/50 space-y-2">
                                        {selectedCompany.growth_triggers ? selectedCompany.growth_triggers.split('\n').map((line, i) => {
                                            if (!line.trim()) return null;
                                            if (line.includes('**')) return <p key={i} className="text-sm font-bold text-white">{line.replace(/\*\*/g, '').trim()}</p>;
                                            return <p key={i} className="text-xs text-gray-400 border-l-2 border-gray-700 pl-3 leading-relaxed">{line.replace(/^[-*•]\s*/, '').trim()}</p>;
                                        }) : <p className="text-xs text-gray-500 italic">No triggers recorded.</p>}
                                    </div>
                                </div>

                                {/* Historical Sentiment Tracker */}
                                <div>
                                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-3 flex items-center gap-2"><BarChart2 className="w-3 h-3 text-amber-400" /> Historical Sentiment Tracker</h3>
                                    <div className="bg-[#111111]/50 p-4 rounded-xl border border-gray-800/50">
                                        <div className="flex items-end gap-3 h-20">
                                            {getSentiment(selectedCompany.ticker).map((s, i) => (
                                                <div key={i} className="flex flex-col items-center flex-1 gap-1">
                                                    <span className="text-[10px] font-mono text-[#00e659] font-bold">{s.s}</span>
                                                    <div className="w-full rounded-t-sm bg-[#00e659]/80 transition-all" style={{ height: `${(s.s / 100) * 52}px` }} />
                                                    <span className="text-[8px] text-gray-600 text-center leading-tight">{s.q.replace(' F', '\nF')}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-2 text-center">Management Bullishness Score (0-100)</p>
                                    </div>
                                </div>

                                {/* Key Risks */}
                                <div>
                                    <h3 className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-2 flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-amber-500" /> Key Risks</h3>
                                    <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-xs text-amber-100/70 leading-relaxed space-y-1.5">
                                        <p className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" /> Margin compression due to raw material volatility over next 2 quarters.</p>
                                        <p className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" /> Capacity expansion delays impacting the guided top-line trajectory.</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-800 text-center">
                                    <button onClick={loadTranscript} className="text-xs text-[#00e659] font-bold flex items-center justify-center gap-1 w-full p-2 hover:bg-[#00e659]/10 rounded transition-all">Read Full Transcript Analysis <ChevronRight className="w-3 h-3" /></button>
                                </div>
                            </div>
                        )}

                        {/* ── AI Chat Tab ── */}
                        {sidebarTab === 'chat' && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Chat messages */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role === 'assistant' && (
                                                <div className="w-7 h-7 rounded-full bg-[#00e659]/20 border border-[#00e659]/30 flex items-center justify-center shrink-0 mr-2 mt-1">
                                                    <span className="text-[10px] font-black text-[#00e659]">AI</span>
                                                </div>
                                            )}
                                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#00e659]/10 border border-[#00e659]/20 text-white rounded-tr-sm' : 'bg-[#111111] border border-gray-800 text-gray-300 rounded-tl-sm'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="flex justify-start">
                                            <div className="w-7 h-7 rounded-full bg-[#00e659]/20 border border-[#00e659]/30 flex items-center justify-center shrink-0 mr-2">
                                                <span className="text-[10px] font-black text-[#00e659]">AI</span>
                                            </div>
                                            <div className="bg-[#111111] border border-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 text-gray-500">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Analysing...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                                {/* Quick prompts */}
                                <div className="px-5 pb-2 flex flex-wrap gap-2">
                                    {['What are the key growth drivers?', 'What risks did management highlight?', 'Summarise guidance in one line'].map(q => (
                                        <button key={q} onClick={() => { setChatInput(q); }}
                                            className="text-[10px] px-2.5 py-1 bg-gray-900 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                                            {q}
                                        </button>
                                    ))}
                                </div>
                                {/* Input */}
                                <div className="p-4 border-t border-gray-800 flex gap-3">
                                    <input type="text" placeholder="Ask the AI Analyst anything..."
                                        value={chatInput} onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendChat()}
                                        className="flex-1 bg-[#111111] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00e659] transition-colors" />
                                    <button onClick={sendChat} disabled={chatLoading}
                                        className="p-2.5 bg-[#00e659] hover:bg-[#00ff66] text-black rounded-xl transition-colors disabled:opacity-50">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── PDF Tear Sheet Tab ── */}
                        {sidebarTab === 'pdf' && (
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-gray-800 flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Institutional Tear Sheet</h3>
                                    <p className="text-gray-500 text-sm mt-2 max-w-xs">Generate a beautiful 1-page branded PDF with financial metrics, catalysts, sentiment chart, and key risks for <span className="text-white font-bold">{selectedCompany.name}</span>.</p>
                                </div>
                                <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-5 w-full text-sm space-y-3">
                                    {['Company Overview & Business Summary', 'Market Cap · RS Rating · Industry', 'Extracted Growth Catalysts (Tags)', 'Historical Sentiment Chart', 'Key Risks', 'Rupee And Risk PRO Branding'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-400">
                                            <CheckCircle2 className="w-4 h-4 text-[#00e659] shrink-0" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={generatePDF} disabled={pdfGenerating}
                                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 ${pdfDone ? 'bg-[#00e659]/20 border border-[#00e659]/30 text-[#00e659]' : 'bg-[#00e659] hover:bg-[#00ff66] text-black shadow-[0_0_30px_rgba(0,230,89,0.3)]'} disabled:opacity-60`}>
                                    {pdfGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> :
                                        pdfDone ? <><CheckCircle2 className="w-5 h-5" /> Tear Sheet Ready!</> :
                                            <><Download className="w-5 h-5" /> Generate & Download PDF</>}
                                </button>
                                {pdfDone && <p className="text-xs text-gray-600 text-center">Your browser's print dialog opened. Select "Save as PDF" to download.</p>}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
