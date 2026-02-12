import React from 'react';
import { X, Share, MoreVertical, PlusSquare, Download, Monitor } from 'lucide-react';

interface PWAInstallModalProps {
    isOpen: boolean;
    onClose: () => void;
    platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose, platform }) => {
    if (!isOpen) return null;

    const renderContent = () => {
        switch (platform) {
            case 'ios':
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Share className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Install on iPhone</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                            Follow these simple steps:
                        </p>
                        <ol className="text-left space-y-4 mb-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <li className="flex items-center gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">1</span>
                                <span>Tap the <span className="font-bold text-slate-900 dark:text-white">Share</span> button <Share className="inline w-4 h-4 mx-1" /> below.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">2</span>
                                <span>Scroll down and select <span className="font-bold text-slate-900 dark:text-white">Add to Home Screen</span> <PlusSquare className="inline w-4 h-4 mx-1" />.</span>
                            </li>
                        </ol>
                    </div>
                );
            case 'android':
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Download className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Install on Android</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                            Follow these simple steps:
                        </p>
                        <ol className="text-left space-y-4 mb-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                            <li className="flex items-center gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">1</span>
                                <span>Tap the <span className="font-bold text-slate-900 dark:text-white">3 Dots</span> <MoreVertical className="inline w-4 h-4 mx-1" /> at the top right.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">2</span>
                                <span>Select <span className="font-bold text-slate-900 dark:text-white">Install App</span> or <span className="font-bold text-slate-900 dark:text-white">Add to Home Screen</span>.</span>
                            </li>
                        </ol>
                    </div>
                );
            default: // Desktop
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Monitor className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Install on Desktop</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                            Look for the install icon in your browser's address bar.
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <span>Click the</span>
                            <Download className="w-4 h-4" />
                            <span className="font-bold text-slate-900 dark:text-white">Install</span>
                            <span>icon in the URL bar (top right).</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative border border-slate-100 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {renderContent()}

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};
