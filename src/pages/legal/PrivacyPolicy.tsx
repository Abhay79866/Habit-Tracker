import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="max-w-3xl mx-auto prose prose-indigo dark:prose-invert">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Privacy Policy</h1>

                <p className="text-slate-600 dark:text-slate-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                    We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                    <li><strong>Personal Information:</strong> Name and Email address (via Google Authentication).</li>
                    <li><strong>Usage Data:</strong> Information about how you use our habit tracking features, including created habits, completion status, and streaks.</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                    We use the information we collect to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                    <li>Provide, maintain, and improve FocusBoard.</li>
                    <li>Process transactions and send related information.</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. Third-Party Services</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                    We use trusted third-party services to help us operate our business:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 mb-6">
                    <li><strong>Firebase (Google):</strong> For authentication and database services.</li>
                    <li><strong>Razorpay:</strong> For payment processing. We do not store your payment card details.</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Data Protection</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                </p>
                <p className="text-slate-600 dark:text-slate-300 mb-6 font-bold">
                    We do NOT sell your personal data to third parties.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Contact Us</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                    If you have any questions about this Privacy Policy, please contact us at support@focusboard.com.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
