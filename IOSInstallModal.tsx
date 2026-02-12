import React from 'react';
import { X, Share } from 'lucide-react';

interface IOSInstallModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                    <X size={24} />
                </button>
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Share className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Install for iPhone</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                        To install FocusBoard, tap the <span className="font-bold text-slate-900 dark:text-white">Share</span> button below and select <span className="font-bold text-slate-900 dark:text-white">"Add to Home Screen"</span>.
                    </p>
                    <div className="flex justify-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 py-3 rounded-xl">
                        <span>Tap</span>
                        <Share size={18} />
                        <span>then "Add to Home Screen"</span>
                    </div>
                </div>
                {/* Pointing arrow visual */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 rotate-45"></div>
            </div>
        </div>
    );
};
