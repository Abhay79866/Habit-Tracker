import { useState, useEffect } from 'react';

type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

export const usePWAInstall = () => {
    const [platform, setPlatform] = useState<Platform>('desktop');
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // 1. Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();

        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        } else {
            setPlatform('desktop');
        }

        // 2. Check if already installed
        const installed = window.matchMedia('(display-mode: standalone)').matches;
        setIsInstalled(installed);
    }, []);

    return { platform, isInstalled };
};
