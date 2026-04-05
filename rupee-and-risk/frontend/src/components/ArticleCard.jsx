import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ArticleCard({ ticker, companyName, category, date, summary, isEarnings = false }) {
    const linkTo = isEarnings ? `/earnings-summary/?company=${ticker}` : `/deep-dives/${ticker}`;
    const categoryLabel = category || (isEarnings ? 'Earnings' : 'Deep Dive');

    return (
        <Link to={linkTo} className="group block h-full">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 h-full flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300 relative overflow-hidden transform hover:-translate-y-1">

                {/* Top bar: Category + Date */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00e659] animate-pulse"></div>
                        <span className="text-gray-600 uppercase tracking-widest text-[10px] font-bold">{categoryLabel}</span>
                    </div>
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">{date}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-[28px] font-black text-black group-hover:text-[#00e659] transition-colors tracking-tighter leading-tight mb-4 pr-4">
                    {companyName} {isEarnings && category && category !== 'Latest' && category !== 'Earnings' ? `(${category})` : ''}
                </h3>

                {/* Summary */}
                <p className="text-gray-500 font-light leading-relaxed line-clamp-3 mb-8 flex-grow">
                    {summary || `Comprehensive analysis and breakdown of ${companyName}'s latest performance, triggers, and strategic guidance.`}
                </p>

                {/* Bottom CTA */}
                <div className="flex items-center gap-2 mt-auto font-bold text-sm uppercase tracking-widest text-black group-hover:text-[#00e659] transition-colors">
                    Read Analysis
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full opacity-50 pointer-events-none group-hover:from-[#00e659]/5 transition-colors"></div>
            </div>
        </Link>
    );
}
