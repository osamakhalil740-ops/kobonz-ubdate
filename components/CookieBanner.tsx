
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const CookieBanner: React.FC = () => {
    const { t } = useTranslation();
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setShowBanner(false);
    };
    
    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-dark-gray text-white p-4 shadow-lg z-50">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm">
                    {t('cookies.bannerText')} 
                    <a href="/#/legal" className="underline hover:text-primary ml-2">{t('cookies.learnMore')}</a>
                </p>
                <div className="flex gap-4">
                    <button onClick={handleDecline} className="text-sm px-4 py-2 rounded-md hover:bg-gray-700">{t('cookies.decline')}</button>
                    <button onClick={handleAccept} className="text-sm bg-primary px-4 py-2 rounded-md hover:opacity-90">{t('cookies.accept')}</button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
