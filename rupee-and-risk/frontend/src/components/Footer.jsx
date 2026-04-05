import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#050505] text-white py-20 mt-auto">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-black tracking-tighter text-3xl flex flex-col leading-[0.8] mb-6">
                            <span>Rupee</span>
                            <span className="text-[#00e659]">AndRisk.</span>
                        </span>
                        <p className="text-gray-400 font-light leading-relaxed max-w-sm mb-8">
                            Institutional-grade intelligence and earnings call analysis for aggressive growth hunters in the Indian market.
                        </p>
                        <div className="flex items-center gap-4">
                            {/* Social links */}
                            <a href="https://x.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-gray-400 hover:text-white">X</a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-gray-400 hover:text-white">in</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-tight">Features</h4>
                        <ul className="space-y-4">
                            <li><Link to="/deep-dives" className="text-gray-400 hover:text-white transition-colors font-light">Deep Dives</Link></li>
                            <li><Link to="/earnings" className="text-gray-400 hover:text-white transition-colors font-light">Earnings Summaries</Link></li>
                            <li><Link to="/growth-triggers" className="text-gray-400 hover:text-[#00e659] transition-colors font-light flex items-center gap-2">Growth Triggers <span className="bg-[#00e659]/20 text-[#00e659] text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">Pro</span></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 tracking-tight">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link to="/legal" className="text-gray-400 hover:text-white transition-colors font-light">Terms & Conditions</Link></li>
                            <li><Link to="/legal" className="text-gray-400 hover:text-white transition-colors font-light">Privacy Policy</Link></li>
                            <li><Link to="/legal" className="text-gray-400 hover:text-white transition-colors font-light">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-light">
                    <p>© {new Date().getFullYear()} RupeeAndRisk Intelligence. All rights reserved.</p>
                    <p className="mt-4 md:mt-0 flex items-center gap-2">Built with <span className="text-red-500">♥</span> for investors.</p>
                </div>
            </div>
        </footer>
    );
}
