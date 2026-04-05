import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    };

    return (
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="font-black text-2xl tracking-tighter text-black flex flex-col leading-[0.8] hover:opacity-80 transition-opacity">
                            <span>Rupee</span>
                            <span className="text-[#00e659]">AndRisk.</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-10 sm:flex sm:space-x-10 items-center">
                        <Link
                            to="/deep-dives"
                            className={`text-sm font-bold uppercase tracking-widest transition-colors relative group py-2 ${isActive('/deep-dives') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Deep Dives
                            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#00e659] transform origin-left transition-transform duration-300 ${isActive('/deep-dives') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </Link>
                        <Link
                            to="/earnings"
                            className={`text-sm font-bold uppercase tracking-widest transition-colors relative group py-2 ${isActive('/earnings') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Earnings
                            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#00e659] transform origin-left transition-transform duration-300 ${isActive('/earnings') && !location.pathname.includes('earnings-summary') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </Link>
                        <Link
                            to="/growth-triggers"
                            className={`text-sm font-bold uppercase tracking-widest transition-colors relative group py-2 ${isActive('/growth-triggers') ? 'text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Growth Triggers
                            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#00e659] transform origin-left transition-transform duration-300 ${isActive('/growth-triggers') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </Link>

                        <div className="pl-6 border-l border-gray-200">
                            <Link to="/pricing" className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 block whitespace-nowrap">
                                Pro Access
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
