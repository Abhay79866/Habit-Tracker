import React from 'react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="max-w-3xl mx-auto prose prose-indigo dark:prose-invert">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Terms of Service</h1>

                <p className="text-slate-600 dark:text-slate-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    By accessing and using FocusBoard, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">2. Use License</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    FocusBoard grants you a personal, non-transferable, non-exclusive license to use the software for personal, non-commercial use, subject to these terms.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">3. User Accounts</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    You are responsible for maintaining the confidentiality of your account and password. We reserve the right to terminate accounts that we determine, in our sole discretion, are being used for abusive or illegal purposes.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">4. Disclaimer</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    FocusBoard is provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">5. Governing Law</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
