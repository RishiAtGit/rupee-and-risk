import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Zap, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';

export default function HomePage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/companies/public`)
            .then(response => {
                setCompanies(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching companies:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-medium text-gray-400">Loading Alpha...</div>;
    if (companies.length === 0) return <div className="min-h-screen bg-black flex items-center justify-center font-medium text-gray-400">No data available.</div>;

    const heroCompany = companies[0];
    const bentoSmall1 = companies[1];
    const bentoSmall2 = companies[2];
    const recentCompanies = companies.slice(3);

    return (
        <div className="bg-[#fafafa] min-h-screen font-sans selection:bg-[#00e659]/30">

            {/* 
      =============================
      1. DARK PREMIUM HERO SECTION
      ============================= */}
            <section className="relative bg-[#050505] text-white pt-24 pb-32 overflow-hidden border-b border-white/5 rounded-b-[3rem] shadow-2xl">
                {/* Glows and Grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '3rem 3rem' }}></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at top, #00e659 0%, transparent 70%)' }}></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-12">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(0,230,89,0.1)]">
                        <Activity className="h-4 w-4 text-[#00e659] animate-pulse" />
                        <span className="text-sm font-bold tracking-widest uppercase text-gray-300">Live Earnings Intelligence</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.95] mb-8">
                        Trade on <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00e659] to-[#00a840]">Signal.</span><br />
                        Skip the Noise.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mb-12">
                        Institutional-grade deep dives, growth triggers, and earnings analysis extracted straight from management commentary.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/pricing" className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-black text-black uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3">
                            Unlock Pro Access <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/deep-dives" className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                            Explore Archives <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* CSS Ticker Tape Animation injected via global CSS block */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-white/5 border-t border-white/5 backdrop-blur-md py-4 pointer-events-none">
                    <div className="flex w-[200%] animate-pulse items-center text-gray-500 font-mono text-sm whitespace-nowrap overflow-x-hidden" style={{ animation: 'ticker 40s linear infinite' }}>
                        {[...companies, ...companies, ...companies, ...companies].map((c, i) => (
                            <div key={i} className="flex items-center mx-12">
                                <span className="font-bold text-white mr-2">{c.ticker}</span>
                                <span className={i % 2 === 0 ? "text-[#00e659]" : "text-red-500"}>
                                    {i % 2 === 0 ? "▲ +2.4%" : "▼ -1.2%"}
                                </span>
                                <span className="ml-8 text-white/20 whitespace-nowrap overflow-hidden text-[10px] tracking-widest uppercase">
                                    {i % 3 === 0 ? "NEW CAPEX TRIGGER" : i % 3 === 1 ? "MARGIN EXPANSION" : "REVENUE GUIDANCE"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 
      =============================
      2. INTELLIGENCE BENTO BOX
      ============================= */}
            <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-2">Latest Insights</h2>
                        <p className="text-gray-500 font-light text-xl">The newest deep dives straight to your dashboard.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[450px]">

                    {/* Main Hero Bento */}
                    {heroCompany && (
                        <Link to={`/deep-dives/${heroCompany.ticker}`} className="lg:col-span-2 h-full relative bg-white rounded-3xl border border-gray-100 overflow-hidden group shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:border-black/10 transition-all flex flex-col justify-end p-10">
                            {/* Background Image / Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 z-0 group-hover:scale-[1.02] transition-transform duration-700">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-black rounded-full blur-[100px] opacity-[0.02] filter mix-blend-multiply"></div>
                                <div className="absolute w-full h-full opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00e659] animate-pulse"></div> Live Deep Dive
                                    </span>
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Just Published</span>
                                </div>
                                <h3 className="text-6xl lg:text-[5.5rem] font-black text-black tracking-tighter leading-[0.9] mb-4 group-hover:text-[#00e659] transition-colors">{heroCompany.ticker}</h3>
                                <p className="text-xl text-gray-500 font-light max-w-xl line-clamp-2">Comprehensive strategic analysis breaking down management guidance, future capex plans, and margin expansion triggers entirely.</p>
                            </div>
                        </Link>
                    )}

                    {/* Side Small Bentos */}
                    <div className="grid grid-rows-2 gap-6 lg:col-span-1 h-full">
                        {bentoSmall1 && (
                            <Link to={`/deep-dives/${bentoSmall1.ticker}`} className="bg-black text-white rounded-3xl p-8 relative overflow-hidden group shadow-lg hover:shadow-2xl hover:shadow-black/20 transition-all flex flex-col justify-between h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e659] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative z-10 flex justify-between items-start mb-6">
                                    <Zap className="h-6 w-6 text-[#00e659]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00e659] bg-[#00e659]/10 px-2 py-0.5 rounded-sm">Earnings</span>
                                </div>
                                <div className="relative z-10 mt-auto">
                                    <h4 className="text-3xl font-black tracking-tighter mb-2 group-hover:translate-x-1 transition-transform">{bentoSmall1.ticker}</h4>
                                    <p className="text-gray-400 font-light text-sm line-clamp-2">Latest Q-on-Q growth signals and segment-wise revenue updates directly extracted.</p>
                                </div>
                            </Link>
                        )}
                        {bentoSmall2 && (
                            <Link to={`/deep-dives/${bentoSmall2.ticker}`} className="bg-white border border-gray-100 rounded-3xl p-8 relative overflow-hidden group shadow-lg shadow-gray-100 hover:shadow-2xl hover:border-black/10 transition-all flex flex-col justify-between h-full">
                                <div className="relative z-10 flex justify-between items-start mb-6">
                                    <TrendingUp className="h-6 w-6 text-gray-400 group-hover:text-black transition-colors" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-gray-100 px-2 py-0.5 rounded-sm">Analysis</span>
                                </div>
                                <div className="relative z-10 mt-auto">
                                    <h4 className="text-3xl font-black text-black tracking-tighter mb-2 group-hover:text-[#00e659] transition-colors">{bentoSmall2.ticker}</h4>
                                    <p className="text-gray-500 font-light text-sm line-clamp-2">Management commentary unpacked on future capital allocations and joint ventures.</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* 
      =============================
      3. FULL ARCHIVE GRID
      ============================= */}
            {recentCompanies.length > 0 && (
                <section className="bg-white py-24 border-t border-gray-100 rounded-t-[3rem]">
                    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-black text-black tracking-tighter flex items-center gap-3">
                                <BarChart3 className="h-8 w-8 text-[#00e659]" /> Recent Coverage
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {recentCompanies.map(company => (
                                <ArticleCard
                                    key={company.id}
                                    ticker={company.ticker}
                                    companyName={company.name}
                                    category="Archive"
                                    date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Global Style injection for CSS Ticker */}
            <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}
