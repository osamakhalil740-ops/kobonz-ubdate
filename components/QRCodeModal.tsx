import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '../hooks/useTranslation';

interface QRCodeModalProps {
    url: string;
    onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, onClose }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-medium mb-4">{t('qrCodeModal.title')}</h3>
                <QRCodeSVG value={url} size={256} />
                <p className="text-sm text-gray-500 mt-4 break-all">{url}</p>
                <button onClick={onClose} className="mt-6 bg-primary text-white font-bold py-2 px-4 rounded-md hover:opacity-90">
                    Close
                </button>
            </div>
        </div>
    );
};

export default QRCodeModal;
