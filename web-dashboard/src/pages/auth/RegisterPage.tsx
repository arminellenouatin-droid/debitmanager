import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'TENANT_STAFF',
  });
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/otp/verify', {
        phone: formData.phone,
        code: otpCode,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Code OTP invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post('/auth/otp/send', { phone: formData.phone });
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface">
      <div className="w-full max-w-md p-lg">
        <div className="card">
          {step === 1 ? (
            <>
              <div className="text-center mb-lg">
                <h1 className="text-h1 font-bold text-primary mb-sm">Créer un compte</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  Rejoignez DebitManager
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-md">
                <div className="grid grid-cols-2 gap-sm">
                  <div>
                    <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Jean"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+225 07 00 00 00 00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <div className="p-sm bg-danger/10 text-danger rounded-sm text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </form>

              <div className="mt-md text-center">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  Déjà inscrit ?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-primary font-medium hover:underline"
                  >
                    Se connecter
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-lg">
                <h1 className="text-h1 font-bold text-primary mb-sm">Vérification</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                  Entrez le code OTP envoyé au {formData.phone}
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-md">
                <div>
                  <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                    Code OTP
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="input-field text-center text-2xl tracking-widest"
                    placeholder="••••"
                    maxLength={4}
                    required
                  />
                </div>

                {error && (
                  <div className="p-sm bg-danger/10 text-danger rounded-sm text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Vérification...' : 'Vérifier'}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="w-full text-sm text-primary font-medium hover:underline"
                >
                  Renvoyer le code
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
