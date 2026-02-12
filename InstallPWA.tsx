import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const InstallPWA = () => {
    const { platform, isInstalled } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Don't show if already installed
    if (isInstalled || !isVisible) return null;

    return (
        <>
            <PWAInstallModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                platform={platform}
            />

            <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between z-50 animate-fade-in-up border border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Download size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Install FocusBoard</h3>
                        <p className="text-xs text-slate-400">Add to home screen for quick access</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                        Install
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};
