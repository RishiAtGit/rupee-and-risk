import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Activity, Layers, ArrowRight, CheckCircle2, Factory, TrendingUp, Zap, BarChart3, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function GrowthTriggersPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00e659]/30">

            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden pt-32 pb-40">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at top, #00e659 0%, transparent 60%)' }}></div>
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #00e659 1px, transparent 1px), linear-gradient(to bottom, #00e659 1px, transparent 1px)', backgroundSize: '3rem 3rem' }}></div>
                </div>

                <div className="relative z-10 max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-16">
                    {/* Left Content */}
                    <div className="lg:w-1/2 max-w-xl text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                            <Sparkles className="h-4 w-4 text-[#00e659]" />
                            <span className="text-sm font-semibold tracking-widest uppercase text-gray-300">Premium Intelligence</span>
                        </div>

                        <h1 className="text-6xl md:text-[80px] font-black tracking-tighter leading-[1.05] mb-8">
                            Growth <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e659] via-emerald-400 to-teal-500">
                                Triggers
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-400 font-light mb-8 max-w-xl">
                            Signals that drive earnings growth.
                        </p>

                        <p className="text-lg text-gray-500 leading-relaxed font-light mb-10 max-w-xl">
                            Growth catalysts, management guidance, and forward-looking triggers, extracted and organized across <strong className="font-bold text-white">1000+ Indian companies.</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                            <Link to="/pricing" className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-[#00e659] px-10 py-5 text-xl font-bold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_#00e659]">
                                <span className="relative flex items-center justify-center gap-3">
                                    Get Access <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center gap-3 justify-center lg:justify-start text-xs font-mono font-medium text-gray-500 uppercase tracking-widest mt-8">
                            <span className="w-2 h-2 rounded-full bg-[#00e659] animate-pulse"></span>
                            <p>Trusted by <strong className="text-white">150+ investors</strong> for their research</p>
                        </div>
                    </div>

                    {/* Right Side Glassmorphic Computer/Grid Demo */}
                    <div className="lg:w-1/2 relative flex justify-center lg:justify-end w-full">
                        <div className="relative w-full max-w-[600px] aspect-[4/3] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-[0_0_50px_rgba(0,230,89,0.1)] p-1 flex border border-gray-800">
                            <div className="w-full h-full bg-[#0a0a0a] rounded-xl flex flex-col overflow-hidden relative border border-gray-800/50">
                                
                                {/* Grid Header */}
                                <div className="h-10 border-b border-gray-800 bg-[#0f0f0f] flex items-center px-4 justify-between">
                                    <div className="flex items-center gap-2">
                                        <Database className="h-4 w-4 text-[#00e659]" />
                                        <span className="font-mono text-xs text-gray-300">rupee_risk_db</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                        <div className="w-2 h-2 rounded-full bg-[#00e659]"></div>
                                    </div>
                                </div>

                                {/* Animated Grid Rows */}
                                <div className="flex-1 p-4 flex flex-col gap-3 relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10"></div>
                                    {[
                                        { name: "Avanti Feeds", ind: "FMCG - Shrimp", tag: "Margin Expansion", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                        { name: "Hindustan Copper", ind: "Metals", tag: "Capex Cycle", color: "text-[#00e659] bg-[#00e659]/10 border-[#00e659]/20" },
                                        { name: "MTAR Technologies", ind: "Aerospace", tag: "New Contracts", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                                        { name: "Cupid", ind: "Contraceptives", tag: "Acquisitions", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                                        { name: "SEAMEC Ltd", ind: "Shipping", tag: "Acquisitions", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                                        { name: "Lumax Industries", ind: "Auto Ancillaries", tag: "Margin Expansion", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between border-b border-gray-800/50 pb-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-gray-200">{row.name}</span>
                                                <span className="text-[10px] font-mono text-gray-500 uppercase">{row.ind}</span>
                                            </div>
                                            <div className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border ${row.color}`}>
                                                {row.tag}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                        {/* Floating Accents */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00e659] opacity-20 blur-3xl rounded-full"></div>
                        <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* 2. TICKER TAPE BANNER */}
            <div className="w-full bg-[#0a0a0a] border-y border-white/5 py-4 flex justify-center text-[#00e659] font-mono text-sm tracking-widest font-bold">
                <span className="opacity-90">1000+ Companies  <span className="mx-6 text-gray-600 font-light">/</span>  100+ Industries  <span className="mx-6 text-gray-600 font-light">/</span>  Q3 FY26 Latest Data</span>
            </div>

            {/* 3. WHAT YOU GET SECTION (Dark Glassmorphism) */}
            <section className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center mb-20 relative">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">What You Get</h2>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">The institutional-grade intelligence edge you've been looking for.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-white/10 hover:border-[#00e659]/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e659]/5 blur-3xl rounded-full group-hover:bg-[#00e659]/10 transition-colors"></div>
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8">
                            <Target className="h-8 w-8 text-[#00e659]" />
                        </div>
                        <h3 className="text-[28px] font-bold leading-none tracking-tight mb-8 text-white">Company<br/>Triggers</h3>
                        <p className="font-light text-gray-400 leading-relaxed group">
                            10-12 forward-looking growth triggers per company. Extracted from the latest 4 quarters of earnings calls. Get insights about what will drive the growth for the company.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-white/10 hover:border-[#00e659]/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8">
                            <Layers className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-[28px] font-bold leading-none tracking-tight mb-8 text-white">Catalyst<br/>Tags</h3>
                        <p className="font-light text-gray-400 leading-relaxed group">
                            Every company tagged with growth catalysts: capex, margin expansion, geographic expansion, new products, acquisitions, operating leverage. Filter perfectly to match your thesis.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-white/10 hover:border-[#00e659]/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/10 transition-colors"></div>
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8">
                            <Activity className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-[28px] font-bold leading-none tracking-tight mb-8 text-white">Industry<br/>Intelligence</h3>
                        <p className="font-light text-gray-400 leading-relaxed group">
                            Industry-wide triggers covering what's happening in any particular industry. Get up to speed about any industry in minutes, not hours.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. PRODUCT DEMO NATIVE VIEW (Dark Airtable Replica) */}
            <section className="relative py-32 border-y border-white/5 bg-black">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
                        Product Demo
                    </h2>
                    <p className="font-light text-gray-400 text-lg max-w-3xl leading-relaxed mb-16">
                        Take a look at 21 companies from our database. We cover 1000+ companies with crisp triggers, stage analysis, relative strength, key risks and much more. Look at the data exactly how our premium subscribers see it.
                    </p>

                    {/* Airtable Embed Wrapper */}
                    <div className="bg-[#050505] rounded-2xl shadow-[0_0_80px_rgba(0,230,89,0.05)] border border-white/10 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500 relative">
                        {/* Fake Header Top to blend the iframe seamlessly */}
                        <div className="h-12 border-b border-gray-800 flex items-end absolute top-0 w-full z-10 pointer-events-none opacity-0"></div>

                        <iframe 
                            className="w-full h-[650px] md:h-[750px] bg-transparent"
                            src="https://airtable.com/embed/appINUEhJguZHPqli/shrVyZzSgno3T83Km/tblZEwPg3U7vgB2Pw/viwzbIVG7XLeTiJue?backgroundColor=green"
                            frameBorder="0"
                            width="100%"
                            height="100%"
                            style={{ background: 'transparent' }}
                            title="Growth Triggers Database Demo"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* 5. INDUSTRY WIDE TRIGGERS (Premium Dark Card) */}
            <section className="max-w-[70rem] mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
                    Industry Wide Triggers
                </h2>
                <p className="font-light text-gray-400 text-lg max-w-2xl leading-relaxed mb-16">
                    What's driving the growth in any industry. Get a quick top-down view of any industry without reading through 50 individual reports.
                </p>

                <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,230,89,0.1)] relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00e659]/5 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/10 pb-6 mb-10 relative z-10 gap-4">
                        <div className="flex items-center gap-3">
                            <Cpu className="h-8 w-8 text-[#00e659]" />
                            <h3 className="text-3xl font-black text-white tracking-tight">Aerospace & Defence</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest text-gray-400">5 Companies</span>
                            <span className="bg-[#00e659]/10 border border-[#00e659]/20 text-[#00e659] px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest">Q3 FY26</span>
                        </div>
                    </div>

                    <ul className="space-y-8 mb-12 relative z-10">
                        <li className="flex gap-6 items-start">
                            <div className="flex flex-col items-center mt-1">
                                <span className="text-[#00e659] font-black text-sm tracking-widest bg-[#00e659]/10 px-2 py-0.5 rounded border border-[#00e659]/20">5/5</span>
                            </div>
                            <span className="text-gray-300 font-light leading-relaxed text-lg">Defence capex outlay raised 10% for FY26; "other equipment" radar/EW/missile line item up 23%. Incredible tailwinds for local assembly units.</span>
                        </li>
                        <li className="flex gap-6 items-start">
                            <div className="flex flex-col items-center mt-1">
                                <span className="text-[#00e659] font-black text-sm tracking-widest bg-[#00e659]/10 px-2 py-0.5 rounded border border-[#00e659]/20">5/5</span>
                            </div>
                            <span className="text-gray-300 font-light leading-relaxed text-lg">QRSAM, Nirbhay, Kusha, MGC, ACS projects to drive <strong className="text-white font-semibold">₹30-35k cr fresh orders</strong> each year over next 3 years across the supply chain.</span>
                        </li>
                        <li className="flex gap-6 items-start">
                            <div className="flex flex-col items-center mt-1">
                                <span className="text-amber-500 font-black text-sm tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">4/5</span>
                            </div>
                            <span className="text-gray-300 font-light leading-relaxed text-lg">Aeronautical Development Agency fast-tracking LCA-Mk2, AMCA; cockpit/EW suites 100% indigenisation mandate pushing local R&D margins.</span>
                        </li>
                        <li className="flex gap-6 items-start">
                            <div className="flex flex-col items-center mt-1">
                                <span className="text-orange-500 font-black text-sm tracking-widest bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">3/5</span>
                            </div>
                            <span className="text-gray-300 font-light leading-relaxed text-lg">Navy ship modernisation push opens repeat radar/IRST/EW upgrade niche for Indian systems. Rapid deployment requested by High Command.</span>
                        </li>
                        <li className="flex gap-6 items-start">
                            <div className="flex flex-col items-center mt-1">
                                <span className="text-red-500 font-black text-sm tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">2/5</span>
                            </div>
                            <span className="text-gray-300 font-light leading-relaxed text-lg">Export opportunity unlocked by EU-India FTA and US duty cut; Europe/NATO OEMs seeking second-source alternatives.</span>
                        </li>
                    </ul>

                    <div className="flex justify-center mt-16 relative z-10">
                        <Link to="/pricing" className="group flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-[#00e659] transition-colors tracking-tight">
                            Get Full Industry Analysis <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. 100+ INDUSTRIES TABLE (Dark Glass) */}
            <section className="bg-[#050505] border-t border-white/5 py-32 relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">
                        100+ Industries Covered
                    </h2>
                    <p className="font-light text-gray-400 text-lg max-w-2xl leading-relaxed mb-16">
                        Large cap, mid cap, small cap. If a listed company reports an earnings call, our AI parses the triggers instantly.
                    </p>

                    <div className="w-full bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["Aerospace & Defence", "Alcoholic Beverages", "Auto Ancillaries", "Automobiles"],
                                        ["Banking - Private", "Banking - PSU", "Building Materials", "Capital Goods"],
                                        ["Cement", "Chemicals", "Consumer Electronics", "Consumer Food"],
                                        ["Dairy", "Diamond & Jewellery", "Electric Vehicles", "Electrical Equipment"],
                                        ["EPC & Construction", "Fertilizers", "FMCG", "Healthcare"],
                                        ["Hotels & Tourism", "Housing Finance", "Insurance", "IT Services"],
                                        ["Logistics", "Media & Entertainment", "Metals & Mining", "Microfinance"],
                                        ["NBFC", "Oil & Gas", "Paints", "Paper"],
                                        ["Pharma - API", "Pharma - CDMO", "Pharma - Formulations", "Power Generation"],
                                        ["Real Estate", "Renewable Energy", "Retail", "Shipping"],
                                        ["Solar Energy", "Speciality Chemicals", "Steel", "Sugar"],
                                        ["Telecom", "Textiles", "Tyres", "Water Treatment"],
                                    ].map((row, rIdx) => (
                                        <tr key={rIdx} className="divide-x divide-white/5 hover:bg-white/[0.02] transition-colors">
                                            {row.map((cell, cIdx) => (
                                                <td key={cIdx} className="p-6 text-sm font-mono text-gray-400 hover:text-[#00e659] transition-colors cursor-pointer w-1/4">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. HOW WE BUILT THIS */}
            <section className="py-32 bg-black border-t border-white/5 relative z-10">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-black text-center mb-6 tracking-tighter text-white">How We Built This</h2>
                    <p className="text-xl text-gray-400 font-light text-center max-w-3xl mx-auto mb-20">The proprietary architecture powering Rupee And Risk's automated intelligence.</p>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Read Transcripts', desc: 'Our swarm of agents parses the last 4 quarters of earnings calls for each company.', icon: BarChart3 },
                            { step: '02', title: 'Extract Guidance', desc: 'Identifies targets, capex plans, capacity expansions, and margin trajectories. Past noise is ignored.', icon: Target },
                            { step: '03', title: 'Tag Catalysts', desc: 'Funnels data into strict tags like acquisition, margin expansion, or product introduction.', icon: Layers },
                            { step: '04', title: 'Cross-Reference', desc: 'Maps triggers across competing companies within industries for top-down insight.', icon: Activity }
                        ].map((item, i) => (
                            <div key={i} className="relative p-8 bg-[#0a0a0a] rounded-3xl border border-white/10 hover:border-[#00e659]/30 transition-colors group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e659]/5 blur-3xl rounded-full group-hover:bg-[#00e659]/10 transition-colors pointer-events-none"></div>
                                <span className="text-7xl font-black text-white/5 absolute -top-4 -right-2 font-mono z-0 group-hover:text-[#00e659]/5 transition-colors">{item.step}</span>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6">
                                        <item.icon className="h-7 w-7 text-[#00e659]" />
                                    </div>
                                    <h4 className="text-2xl font-bold mb-4 text-white">{item.title}</h4>
                                    <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. TARGET AUDIENCE */}
            <section className="py-32 bg-[#050505] border-t border-white/5">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-white tracking-tighter">Built for aggressive growth hunters.</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#111111] p-10 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#00e659] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Fundamental Investors</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Looking for the next compounder? Start with companies that have real, management-stated growth catalysts. Skip the noise. Go straight to what management is building towards.</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#0a0a0a] to-blue-900/10 p-10 rounded-3xl border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] relative overflow-hidden group">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Portfolio Managers</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Monitor your holdings' forward guidance without reading 200 transcripts a quarter. Catch early signals. A margin expansion trigger that wasn't in the analyst note, or a buried capex plan.</p>
                        </div>
                        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#111111] p-10 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Research Analysts</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Industry-level frequency counts for sector reports. When you need to know how many auto ancillary companies are guiding for EV content expansion, the answer is here in seconds.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. PRICING CTA */}
            <section className="py-32 bg-black border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00e659]/5 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to edge the market?</h2>
                    <p className="text-2xl text-gray-400 font-light mb-16">Get instant access to thousands of compiled growth catalysts.</p>

                    <div className="bg-[#0a0a0a] border border-[#00e659]/20 rounded-[3rem] p-12 relative overflow-hidden shadow-[0_0_50px_rgba(0,230,89,0.1)] backdrop-blur-xl">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="uppercase tracking-widest font-bold text-xs text-[#00e659] mb-6 bg-[#00e659]/10 border border-[#00e659]/20 px-4 py-2 rounded-full">Pro Access</div>
                            <div className="flex items-baseline justify-center gap-2 mb-10">
                                <span className="text-6xl font-black text-white">₹4,999</span>
                                <span className="text-xl text-gray-500 font-mono">/quarter</span>
                            </div>

                            <ul className="mb-12 text-left space-y-5 max-w-sm w-full mx-auto">
                                {['1000+ Indian companies covered', '10-12 growth triggers per company', 'Industry-level pattern analysis', 'Quarterly data updates included'].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-4">
                                        <div className="bg-[#00e659]/10 p-1 rounded-full"><CheckCircle2 className="text-[#00e659] h-5 w-5" /></div>
                                        <span className="text-lg font-light text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/pricing" className="w-full max-w-sm bg-[#00e659] text-black font-bold text-xl py-5 rounded-full hover:bg-white transition-colors tracking-tight block text-center shadow-[0_0_20px_rgba(0,230,89,0.3)]">
                                Subscribe Now
                            </Link>
                            
                            <p className="text-gray-500 text-xs font-mono tracking-widest mt-8 flex items-center justify-center gap-2 uppercase">
                                Secure payment via Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
