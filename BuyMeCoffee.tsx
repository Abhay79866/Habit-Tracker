import React, { useState } from 'react';
import { Coffee, X } from 'lucide-react';

export const BuyMeCoffee = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Wrapper for positioning to avoid conflict with animation transform */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] md:bottom-8 md:right-8 md:left-auto md:translate-x-0">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-bold animate-fade-in-up border-2 border-yellow-300 ring-4 ring-yellow-400/20"
                    aria-label="Buy me a coffee"
                >
                    <Coffee size={24} className="stroke-2" />
                    <span className="font-black whitespace-nowrap">Buy me a Coffee</span>
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div
                        className="relative bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] shadow-2xl w-full max-w-[90vw] md:max-w-2xl animate-scale-in border border-white/20 ring-1 ring-black/5 mx-auto transform transition-all overflow-y-auto md:overflow-visible scrollbar-hide"
                        style={{ maxHeight: 'calc(100vh - 200px)' }}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors hover:rotate-90 duration-300 z-10"
                        >
                            <X size={20} className="stroke-3" />
                        </button>

                        <div className="flex flex-col md:flex-row md:items-center md:gap-10">
                            {/* Left Side: Content */}
                            <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
                                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6 shadow-lg shadow-yellow-100 dark:shadow-none">
                                    <Coffee size={32} className="stroke-2" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Support the Dev</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
                                    Fuel the focus engine. <br className="hidden md:block" />
                                    Every coffee helps keep the servers running!
                                </p>
                            </div>

                            {/* Right Side: QR Code */}
                            <div className="flex-1">
                                <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-inner">
                                    <img
                                        src="/images/qr-code.jpeg"
                                        alt="Buy me a coffee QR Code"
                                        className="w-full h-auto rounded-2xl shadow-sm"
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scan to Pay via UPI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Backdrop click to close */}
                    <div className="absolute inset-0 -z-10 cursor-pointer" onClick={() => setIsOpen(false)} />
                </div>
            )}
        </>
    );
};
