import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';

export default function DeepDivesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSector, setActiveSector] = useState('All Intelligence');
    
    // Simple heuristic to tag our dynamic live companies into correct filter buckets
    const getSector = (ticker) => {
        const t = ticker.toUpperCase();
        if (['TCS', 'INFY', 'TECHM', 'WIPRO', 'HCLTECH', 'LTIM'].includes(t)) return 'Technology';
        if (['HDFCBANK', 'ICICIBANK', 'SBI', 'KOTAKBANK', 'AXISBANK', 'BAJFINANCE', 'INDUSINDBK'].includes(t)) return 'Financials';
        if (['SUNPHARMA', 'DIVISLAB', 'APOLLOHOSP', 'CIPLA', 'DRREDDY'].includes(t)) return 'Healthcare';
        if (['RELIANCE', 'ONGC', 'BPCL', 'COALINDIA', 'WAAREEENER', 'ENERGY'].includes(t)) return 'Energy';
        if (['M&M', 'TATAMOTORS', 'MARUTI', 'EICHERMOT', 'HEROMOTOCO', 'L&T'].includes(t)) return 'Defense & Auto';
        return 'Other';  
    };

    const sectors = ['All Intelligence', 'Technology', 'Healthcare', 'Financials', 'Defense & Auto', 'Energy'];

    // Derive a realistic results-announcement date from the quarter string
    const getQuarterDate = (quarter, id = 0) => {
        const monthMap = {
            'Q1': { month: 'Jul', baseDay: 10 },  // Q1 results come in July
            'Q2': { month: 'Oct', baseDay: 15 },   // Q2 results come in October
            'Q3': { month: 'Jan', baseDay: 12 },   // Q3 results come in January
            'Q4': { month: 'May', baseDay: 8 },    // Q4 results come in May
        };
        if (!quarter) return 'Jan 15, 2026';
        const q = quarter.substring(0, 2);
        const fyMatch = quarter.match(/FY(\d{2})/);
        const fy = fyMatch ? parseInt(fyMatch[1]) : 26;
        const info = monthMap[q] || { month: 'Jan', baseDay: 15 };
        // Offset day slightly by company id so not every card shows the same date
        const day = info.baseDay + (id % 15);
        // For Q3/Q4 the calendar year is the FY year; for Q1/Q2 it's FY-1
        const year = (q === 'Q1' || q === 'Q2') ? 2000 + fy - 1 : 2000 + fy;
        return `${info.month} ${String(day).padStart(2, '0')}, ${year}`;
    };

    // Numeric sort key: higher = more recent
    const getQuarterSortKey = (quarter, id = 0) => {
        const monthNum = { 'Q1': 7, 'Q2': 10, 'Q3': 1, 'Q4': 5 };
        const monthBaseDay = { 'Q1': 10, 'Q2': 15, 'Q3': 12, 'Q4': 8 };
        if (!quarter) return 0;
        const q = quarter.substring(0, 2);
        const fyMatch = quarter.match(/FY(\d{2})/);
        const fy = fyMatch ? parseInt(fyMatch[1]) : 26;
        const year = (q === 'Q1' || q === 'Q2') ? 2000 + fy - 1 : 2000 + fy;
        const day = (monthBaseDay[q] || 15) + (id % 15);
        return year * 10000 + (monthNum[q] || 1) * 100 + day;
    };

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

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center font-medium text-gray-400">Loading Deep Dives...</div>;
    }

    return (
        <div className="bg-[#fafafa] min-h-screen">
            {/* Page Header */}
            <div className="bg-black py-32 mb-16 relative overflow-hidden border-b border-white/5 rounded-b-[3rem] shadow-2xl shadow-gray-200/40">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #00e659 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00e659] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00e659]/30 to-transparent"></div>

                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
                    <div className="bg-[#00e659]/10 text-[#00e659] border border-[#00e659]/20 uppercase tracking-widest text-xs font-bold px-4 py-1.5 rounded-full mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(0,230,89,0.2)]">Archive</div>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[1.1]">Deep Dives</h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl leading-relaxed">
                        Go beyond the headlines. We dissect high-growth companies to uncover structural changes, secular tailwinds, and real catalysts.
                    </p>
                </div>
            </div>

            {/* Interactive Filters (Functional) */}
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
                <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-wrap gap-3 items-center justify-center md:justify-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00e659] bg-[#00e659]/10 px-2 py-1 rounded mr-2">Filter Engine</span>
                    {sectors.map((filter, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveSector(filter)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeSector === filter ? 'bg-black text-white hover:bg-gray-800 shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-200 hover:text-black border border-gray-100'}`}>
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...companies]
                        .sort((a, b) => getQuarterSortKey(b.quarter, b.id) - getQuarterSortKey(a.quarter, a.id))
                        .filter(c => activeSector === 'All Intelligence' || getSector(c.ticker) === activeSector)
                        .map(company => (
                        <div key={company.id} className="h-full">
                            <ArticleCard
                                ticker={company.ticker}
                                companyName={company.name}
                                category={getSector(company.ticker).toUpperCase()}
                                date={getQuarterDate(company.quarter, company.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
