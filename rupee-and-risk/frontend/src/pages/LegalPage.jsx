import { useEffect } from 'react';

export default function LegalPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-black pt-32 pb-24 rounded-b-[3rem] shadow-2xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">Legal & Policies</h1>
                    <p className="text-xl text-gray-400 font-light">Transparency and trust are at our core.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40">
                <div className="prose prose-lg prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#00e659] max-w-none text-gray-600 font-light leading-relaxed">
                    <h2 className="text-3xl text-black mb-6">Terms & Conditions</h2>
                    <p className="mb-4">Effective Date: March 24, 2026</p>
                    <p className="mb-4">Welcome to RupeeAndRisk. By accessing our platform, you agree to be bound by these Terms and Conditions. These terms govern your use of our premium financial analysis, deep dives, and earnings summaries.</p>
                    <p className="mb-4">All content provided is for informational purposes only and does not constitute financial advice. Subscribers are responsible for their own investment decisions.</p>

                    <hr className="my-16 border-gray-100" />

                    <h2 className="text-3xl text-black mb-6">Privacy Policy</h2>
                    <p className="mb-4">We take your privacy seriously. We only collect essential information required to provide you with an optimal reading experience and manage your premium subscription.</p>
                    <ul className="mb-4 list-disc pl-6 space-y-2">
                        <li>We do not sell your personal data to third parties.</li>
                        <li>Payment information is processed securely via our payment partners.</li>
                        <li>We use cookies solely, to remember your session and preferences.</li>
                    </ul>

                    <hr className="my-16 border-gray-100" />

                    <h2 className="text-3xl text-black mb-6">Refund Policy</h2>
                    <p className="mb-4">If you are not entirely satisfied with your Pro Access subscription, we offer a hassle-free 7-day money-back guarantee for your initial purchase. Simply contact our support team within 7 days of your first payment to request a full refund.</p>
                    <p className="mb-4">Subsequent renewals are non-refundable, but you may cancel your subscription at any time to prevent future charges to your account.</p>
                </div>
            </div>
        </div>
    );
}
