import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, access_token } = response.data;
      setAuth(user, access_token);
      localStorage.setItem('access_token', access_token);
      
      // Redirect based on user status
      if (user.status === 'PENDING_VALIDATION') {
        navigate('/register');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface">
      <div className="w-full max-w-md p-lg">
        <div className="card">
          <div className="text-center mb-lg">
            <h1 className="text-h1 font-bold text-primary mb-sm">DebitManager</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary">
              Connectez-vous à votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div>
              <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-md text-center">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
              Pas encore inscrit ?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary font-medium hover:underline"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
