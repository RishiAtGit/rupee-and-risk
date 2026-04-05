import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronRight } from 'lucide-react';

export default function ArticlePage() {
    const { ticker } = useParams();
    const [searchParams] = useSearchParams();
    const companyTicker = ticker || searchParams.get('company');

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sidebar state
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all companies for the sidebar
        axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/companies/public`)
            .then(response => {
                setCompanies(response.data);
            })
            .catch(error => {
                console.error("Error fetching companies list:", error);
            });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!companyTicker) {
            setLoading(false);
            return;
        }
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/company/public/${companyTicker}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching details:", error);
                setLoading(false);
            });
    }, [companyTicker]);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderList = (text) => {
        if (!text) return null;
        return (
            <ul className="space-y-4 my-8 pl-2 border-l-2 border-gray-100">
                {text.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e659] mt-2.5 flex-shrink-0"></span>
                        <p className="text-gray-700 leading-relaxed font-light">{line.replace(/^[-•*]\s*/, '')}</p>
                    </li>
                ))}
            </ul>
        );
    };

    if (loading && !data) return <div className="min-h-screen flex items-center justify-center text-gray-400 font-medium">Loading analysis...</div>;
    if (!data && !loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 font-medium">Article not found.</div>;

    const isEarningsRoute = window.location.pathname.includes('earnings-summary');

    return (
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-12">

            {/* Main Article Content */}
            <article className="flex-1 min-w-0 pb-20">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[#00e659] text-xl font-bold">✦</span>
                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{isEarningsRoute ? 'Earnings Summary' : 'Deep Dives'}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400 text-xs font-semibold">{data.quarter}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tighter leading-[1.05] mb-6">
                        {data.company_name}: Earnings & Key Takeaways
                    </h1>
                    <p className="text-xl text-gray-500 leading-relaxed font-light">
                        {data.summary}
                    </p>
                </header>

                <div className="w-full h-[300px] md:h-[400px] bg-black rounded-[3rem] mb-16 relative overflow-hidden flex items-center justify-center shadow-2xl shadow-gray-200/50 group">
                    <div className="absolute inset-0 opacity-20 transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: 'radial-gradient(circle at center, #00e659 1px, transparent 1px)', backgroundSize: '1.5rem 1.5rem' }}></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e659] rounded-full blur-[120px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700"></div>
                    <span className="text-8xl md:text-[12rem] font-black text-white/5 tracking-tighter select-none">{data.ticker}</span>
                    <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-white font-medium border border-white/10 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00e659] animate-pulse"></div>
                        <span className="tracking-widest uppercase text-xs font-bold">Live Intelligence</span>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none prose-p:font-light prose-p:text-gray-600 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black">
                    {data.key_takeaway && (
                        <div className="my-10 p-8 bg-white shadow-lg shadow-gray-100/50 rounded-2xl border border-gray-100 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00e659]"></div>
                            <h3 className="text-sm text-gray-400 font-bold mb-3 uppercase tracking-widest">The Bottom Line</h3>
                            <p className="text-xl font-medium text-gray-900 leading-relaxed m-0">
                                {data.key_takeaway}
                            </p>
                        </div>
                    )}

                    <h2 className="text-2xl mt-12 mb-6 flex items-center gap-2"><div className="w-1.5 h-6 bg-black rounded-sm"></div> Participants & Overview</h2>
                    <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line font-light bg-gray-50 p-6 rounded-xl">{data.participants}</p>
                </div>

                <div className="relative mt-8">
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[#fafafa] pointer-events-none"></div>
                    <div className="absolute inset-0 top-1/4 z-20 flex flex-col items-start justify-start pt-10 pointer-events-auto items-center">
                        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-2xl flex flex-col items-center text-center max-w-sm">
                            <div className="w-16 h-16 bg-[#00e659]/10 text-[#00e659] rounded-2xl flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h3 className="text-2xl font-black text-black mb-3 text-balance">Premium Intelligence</h3>
                            <p className="text-gray-500 font-light mb-8 text-sm">You've reached the limit of our public research. Upgrade to Pro to unlock the full institutional transcript analysis, financial tracking, and actionable intelligence.</p>
                            <Link to="/pricing" className="bg-black hover:bg-gray-800 text-white font-bold tracking-widest uppercase text-xs px-8 py-4 rounded-full transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 duration-200">
                                Unlock Pro Terminal <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="prose prose-lg max-w-none prose-p:font-light prose-p:text-gray-600 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black filter blur-[6px] opacity-30 select-none pointer-events-none">

                    <h2 className="text-2xl mt-14 mb-6 flex items-center gap-2"><div className="w-1.5 h-6 bg-black rounded-sm"></div> Financial Overview</h2>
                    {data.financials && data.financials.length > 0 ? (
                        <div className="my-6 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse text-sm m-0">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/4">Metric</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/4">Value</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/2">Commentary</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {data.financials.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6 font-semibold text-gray-900">{item.metric_name}</td>
                                            <td className="py-5 px-6 font-bold text-[#00e659] text-base">{item.value}</td>
                                            <td className="py-5 px-6 text-gray-500 font-light leading-relaxed">{item.commentary}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (<p className="text-gray-400 italic text-sm">No detailed financials available.</p>)}

                    <h2 className="text-2xl mt-14 mb-6 flex items-center gap-2"><div className="w-1.5 h-6 bg-black rounded-sm"></div> Strategic & Geographic Updates</h2>
                    {renderList(data.strategic_commentary)}
                    {renderList(data.geographic_commentary)}

                    <h2 className="text-2xl mt-14 mb-6 flex items-center gap-2"><div className="w-1.5 h-6 bg-black rounded-sm"></div> Guidance & Outlook</h2>
                    {data.guidance && data.guidance.length > 0 ? (
                        <div className="my-6 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse text-sm m-0">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/4">Metric</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/4">Outlook</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/2">Context</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {data.guidance.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-5 px-6 font-semibold text-gray-900">{item.metric}</td>
                                            <td className="py-5 px-6 font-bold text-black text-base">{item.outlook}</td>
                                            <td className="py-5 px-6 text-gray-500 font-light leading-relaxed">{item.commentary}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (<p className="text-gray-400 italic text-sm">No forward-looking guidance provided.</p>)}

                    <h2 className="text-2xl mt-14 mb-6 flex items-center gap-2"><div className="w-1.5 h-6 bg-black rounded-sm"></div> Risks & Headwinds</h2>
                    {data.risks && data.risks.length > 0 ? (
                        <div className="grid gap-4 my-8">
                            {data.risks.map((item, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl border border-red-100 hover:border-red-300 hover:shadow-md transition-all flex gap-5 group">
                                    <div className="text-red-500 mt-0.5 bg-red-50 p-2 rounded-full h-fit group-hover:bg-red-500 group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base mb-1">{item.risk}</h4>
                                        <p className="text-gray-500 font-light leading-relaxed m-0 text-sm">{item.context}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (<p className="text-gray-400 italic text-sm">No significant risks noted.</p>)}

                    <h2 className="text-2xl mt-14 mb-6 flex items-center gap-2"><div className="w-1.5 h-6 bg-[#00e659] rounded-sm"></div> Q&A Highlights</h2>
                    <div className="bg-gray-900 text-white p-8 md:p-10 rounded-3xl my-10 shadow-xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800 to-black">
                        {data.qa_highlights ? (
                            <ul className="space-y-6">
                                {data.qa_highlights.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e659] mt-2.5 flex-shrink-0"></span>
                                        <p className="text-gray-300 leading-relaxed text-base font-light">{line.replace(/^[-•*]\s*/, '')}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (<p className="text-gray-500 italic text-sm">No Q&A data.</p>)}
                    </div>
                    </div>
                </div>
            </article>

            {/* Right Sidebar - Company Search & Scrollable List */}
            <aside className="w-full lg:w-96 flex-shrink-0">
                <div className="sticky top-24 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 flex flex-col h-[calc(100vh-8rem)]">

                    {/* Header & Search */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-lg text-black mb-4">Explore Companies</h3>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or ticker..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent text-sm font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Scrollable Company List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map(c => {
                                const isActive = c.ticker === companyTicker;
                                return (
                                    <Link
                                        key={c.id}
                                        to={isEarningsRoute ? `/earnings-summary/?company=${c.ticker}` : `/deep-dives/${c.ticker}`}
                                        className={`group flex items-center justify-between p-4 rounded-xl transition-all ${isActive ? 'bg-black text-white shadow-md' : 'hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-100'}`}
                                    >
                                        <div className="flex flex-col min-w-0 pr-4">
                                            <span className={`font-bold truncate ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-black'}`}>{c.name}</span>
                                            <span className={`text-xs mt-0.5 tracking-wider uppercase font-semibold ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>{c.ticker}</span>
                                        </div>
                                        <ChevronRight className={`h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-[#00e659] opacity-100' : 'text-gray-300'}`} />
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-gray-400 text-sm">No companies found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}
