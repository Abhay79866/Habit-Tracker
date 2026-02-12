import React from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { IOSInstallModal } from './IOSInstallModal';

export const InstallPWA = () => {
    const { isInstallable, install, isIOS } = usePWAInstall();
    const [isVisible, setIsVisible] = React.useState(false);
    const [showIOSModal, setShowIOSModal] = React.useState(false);

    React.useEffect(() => {
        if (isInstallable) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isInstallable]);

    const handleInstallClick = async () => {
        const result = await install();
        if (result === 'ios_instructions') {
            setShowIOSModal(true);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible && !showIOSModal) return null;

    return (
        <>
            <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />

            {/* Install Button (Floating) */}
            {!showIOSModal && isVisible && (
                <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between z-50 animate-fade-in-up border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Download size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Install FocusBoard</h3>
                            <p className="text-xs text-slate-400">
                                {isIOS ? "Tap to see instructions" : "Add to home screen for quick access"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleInstallClick}
                            className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                        >
                            {isIOS ? "Install" : "Install"}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
