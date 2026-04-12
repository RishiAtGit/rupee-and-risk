import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';

export default function EarningsPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeQuarter, setActiveQuarter] = useState('Latest Summaries');
    
    const quarters = ['Latest Summaries', 'Q4 FY25', 'Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26'];

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
        return <div className="min-h-[60vh] flex items-center justify-center font-medium text-gray-400">Loading Earnings...</div>;
    }

    return (
        <div className="bg-[#fafafa] min-h-screen">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-[#050505] via-[black] to-gray-900 py-32 mb-16 relative overflow-hidden rounded-b-[3rem] shadow-2xl shadow-gray-200/40">
                <div className="absolute inset-0 bg-[#00e659]/5 opacity-50 blur-3xl transform -skew-y-12"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
                    <div className="bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md uppercase tracking-widest text-xs font-bold px-4 py-1.5 rounded-full mb-8">Financials</div>
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tighter mb-6 leading-none">Earnings Summaries</h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light max-w-3xl leading-relaxed">
                        Distilled financial overviews and management guidance directly extracted from the latest quarterly earnings calls.
                    </p>
                </div>
            </div>

            {/* Interactive Filters (Functional) */}
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-16">
                <div className="bg-white rounded-2xl p-4 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-wrap gap-3 items-center justify-center md:justify-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded mr-2">Sort By Quarter</span>
                    {quarters.map((filter, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveQuarter(filter)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeQuarter === filter ? 'bg-[#00e659] text-black hover:bg-white border border-[#00e659] shadow-[0_0_15px_rgba(0,230,89,0.3)]' : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-black border border-gray-200'}`}>
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {companies
                        .filter(c => activeQuarter === 'Latest Summaries' || c.quarter === activeQuarter)
                        .map(company => (
                        <div key={company.id} className="h-full">
                            <ArticleCard
                                ticker={company.ticker}
                                companyName={company.name}
                                category={company.quarter || "Earnings"}
                                isEarnings={true}
                                date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
