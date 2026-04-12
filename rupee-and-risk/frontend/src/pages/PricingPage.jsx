import { CheckCircle2, Lock, Zap } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function PricingPage() {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePayment = async (amount) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert("Failed to load secure payment gateway. Please check your connection.");
                setIsProcessing(false);
                return;
            }

            // 1. Create order on backend
            const orderRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/payments/create-order`, {
                amount: amount * 100, // paise
                currency: "INR"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const order = orderRes.data;

            // 2. Configure Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SYjRGjnF6OnRWp", // Must be fetched dynamically usually, but test mode handles it
                amount: order.amount,
                currency: order.currency,
                name: "Rupee And Risk",
                description: "Pro Access Subscription",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/payments/verify`, {
                            razorpay_order_id: response.razorpay_order_id || order.id,
                            razorpay_payment_id: response.razorpay_payment_id || "pay_dummy_123",
                            razorpay_signature: response.razorpay_signature || "sig_dummy_123"
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        
                        if (verifyRes.data.is_pro_member) {
                            // Update local user state
                            user.is_pro_member = true;
                            navigate('/pro-dashboard');
                        }
                    } catch (error) {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.full_name,
                    email: user.email,
                },
                theme: {
                    color: "#00e659",
                },
            };

            // If we are given the backend dummy order, we simulate a successful transaction natively
            if (order.id.startsWith("order_dummy_")) {
                options.handler({
                    razorpay_payment_id: "pay_test_bypass",
                    razorpay_order_id: order.id,
                    razorpay_signature: "sig_test_bypass"
                });
                return;
            }

            const rzp = new window.Razorpay(options);
            
            rzp.on("payment.failed", function (response) {
                alert("Payment Focus Closed: " + response.error.description);
            });

            rzp.open();
        } catch (error) {
            console.error("Order creation failed", error);
            alert("Could not initialize checkout. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00e659]/10 text-[#00e659] border border-[#00e659]/20 font-bold uppercase tracking-widest text-xs mb-8">
                        <Zap className="h-4 w-4" /> Pro Access
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-[1] mb-6">
                        Invest with an unfair advantage.
                    </h1>
                    <p className="text-xl text-gray-500 font-light leading-relaxed">
                        Upgrade to Pro to unlock every deep dive, exclusive growth triggers, and our full earnings database.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Monthly Plan */}
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-shadow relative overflow-hidden flex flex-col">
                        <h3 className="text-2xl font-bold text-black mb-2">Monthly Pass</h3>
                        <p className="text-gray-500 font-light text-sm mb-8">Flexible access to all premium intelligence.</p>
                        <div className="flex items-baseline gap-2 mb-10">
                            <span className="text-6xl font-black text-black tracking-tighter">₹199</span>
                            <span className="text-gray-400 font-medium">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-12 flex-1">
                            {['Full access to all Deep Dives', 'Daily Earnings Summaries', 'Curated Growth Triggers Database', 'Cancel anytime'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 bg-gray-100 p-1 rounded-full"><CheckCircle2 className="h-4 w-4 text-black" /></div>
                                    <span className="text-gray-600 font-medium leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => handlePayment(199)} 
                            disabled={isProcessing}
                            className="w-full bg-black text-white font-bold text-lg py-5 rounded-full hover:bg-gray-800 transition-colors tracking-tight flex items-center justify-center gap-2">
                            {isProcessing ? 'Processing Securely...' : 'Start Monthly Plan'}
                        </button>
                    </div>

                    {/* Quarterly Plan (Most Popular) */}
                    <div className="bg-black text-white rounded-[3rem] p-10 border border-black shadow-2xl shadow-gray-400/50 hover:shadow-gray-400/80 transition-shadow relative overflow-hidden flex flex-col transform md:-translate-y-4">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e659] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

                        <div className="absolute top-8 right-8 bg-[#00e659] text-black text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                            Most Popular
                        </div>

                        <h3 className="text-2xl font-bold mb-2 relative z-10">Quarterly Edge</h3>
                        <p className="text-gray-400 font-light text-sm mb-8 relative z-10">Save 16% with our continuous tracking plan.</p>
                        <div className="flex items-baseline gap-2 mb-10 relative z-10">
                            <span className="text-6xl font-black tracking-tighter flex items-center gap-3">
                                <span className="text-gray-500 line-through text-4xl">₹597</span> ₹549
                            </span>
                            <span className="text-gray-400 font-medium">/qtr</span>
                        </div>

                        <ul className="space-y-4 mb-12 flex-1 relative z-10">
                            {['Full access to all Deep Dives', 'Daily Earnings Summaries', 'Curated Growth Triggers Database', 'Priority email support & request ticker', 'Early access to sector reports'].map((feature, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="mt-1 bg-[#00e659]/20 p-1 rounded-full"><CheckCircle2 className="h-4 w-4 text-[#00e659]" /></div>
                                    <span className="text-gray-200 font-medium leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={() => handlePayment(549)}
                            disabled={isProcessing}
                            className="w-full bg-[#00e659] text-black font-bold text-lg py-5 rounded-full hover:bg-white transition-colors tracking-tight flex items-center justify-center shadow-[0_0_30px_rgba(0,230,89,0.3)] relative z-10">
                            {isProcessing ? 'Loading Terminal Securely...' : 'Subscribe Now'}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-2 relative z-10">
                            Secure 256-bit encryption <Lock className="h-3 w-3" />
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
