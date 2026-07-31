import { useState } from 'react';
import api from '../../lib/api';

export default function QRCodePage() {
  const [selectedType, setSelectedType] = useState<'order' | 'table' | 'company'>('table');
  const [id, setId] = useState('');
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await api.get(`/qrcode/${selectedType}/${id}`);
      setQrCode(response.data);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${selectedType}-${id}.png`;
    link.click();
  };

  return (
    <div>
      <h1 className="text-h1 font-bold mb-lg">QR Code</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="card">
          <h2 className="text-h2 font-bold mb-md">Générer un QR Code</h2>
          <div className="space-y-md">
            <div>
              <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                Type de QR Code
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="input-field"
              >
                <option value="table">Table</option>
                <option value="order">Commande</option>
                <option value="company">Entreprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="input-field"
                placeholder="Entrez l'ID..."
              />
            </div>
            <button
              onClick={generateQRCode}
              disabled={loading || !id}
              className="btn-primary w-full"
            >
              {loading ? 'Génération...' : 'Générer'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-h2 font-bold mb-md">Aperçu</h2>
          {qrCode ? (
            <div className="flex flex-col items-center">
              <img src={qrCode} alt="QR Code" className="mb-md" />
              <button
                onClick={downloadQRCode}
                className="btn-secondary"
              >
                Télécharger
              </button>
            </div>
          ) : (
            <p className="text-text-secondary dark:text-dark-text-secondary text-center py-xl">
              Le QR Code apparaîtra ici
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
