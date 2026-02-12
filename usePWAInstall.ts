import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
    interface Window {
        deferredPrompt: BeforeInstallPromptEvent | null;
    }
}

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // 1. Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(ios);

        // 2. Check if already installed
        const installed = window.matchMedia('(display-mode: standalone)').matches;
        setIsInstalled(installed);

        // 3. Handle beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            // Store event globally and in state
            window.deferredPrompt = e as BeforeInstallPromptEvent;
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            if (!installed) {
                setIsInstallable(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if event was already captured (e.g., before component mount)
        if (window.deferredPrompt && !installed) {
            setDeferredPrompt(window.deferredPrompt);
            setIsInstallable(true);
        }

        // Always allow "install" (instructions) on iOS if not installed
        if (ios && !installed) {
            setIsInstallable(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const install = async (): Promise<'dismissed' | 'accepted' | 'ios_instructions' | 'failed'> => {
        if (isInstalled) return 'failed';

        if (isIOS) {
            return 'ios_instructions';
        }

        if (!deferredPrompt) {
            // Fallback: check global in case state is stale
            if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                const { outcome } = await window.deferredPrompt.userChoice;
                window.deferredPrompt = null;
                setDeferredPrompt(null);
                setIsInstallable(false);
                return outcome;
            }
            return 'failed';
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        // Clear prompt after use
        window.deferredPrompt = null;
        setDeferredPrompt(null);
        setIsInstallable(false);

        return outcome;
    };

    return { isInstallable, install, isIOS, isInstalled };
};
