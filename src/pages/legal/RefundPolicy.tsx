import React from 'react';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="max-w-3xl mx-auto prose prose-indigo dark:prose-invert">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Refund & Cancellation Policy</h1>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600 p-6 rounded-r-xl mb-8">
                    <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-2">Digital Goods Policy</p>
                    <p className="text-indigo-800 dark:text-indigo-200">
                        Since FocusBoard offers non-tangible, irrevocable digital goods, we do not provide refunds after the product is purchased, which you acknowledge prior to purchasing any product on the website.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Technical Issues</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    If you experience technical issues that prevent you from using the software, please contact our support team. We will work with you to resolve the issue. If the issue is determined to be a fault in our software that we cannot fix within a reasonable timeframe, a refund may be declared at our sole discretion.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Contact Support</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Please contact support if you experience technical issues or have questions about your subscription.
                </p>
            </div>
        </div>
    );
};

export default RefundPolicy;
