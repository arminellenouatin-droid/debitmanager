import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      setPlans(response.data);
    } catch (err: any) {
      setError('Erreur lors du chargement des plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Veuillez sélectionner un plan');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const amount = plans.plans[selectedPlan][selectedPeriod];
      const response = await api.post('/subscriptions', {
        plan: selectedPlan,
        companyId: 'current', // TODO: Get from user context
        amount,
        currency: plans.currency,
        paymentMethod: 'CASH',
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la souscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartTrial = async () => {
    setSubmitting(true);
    try {
      await api.post('/subscriptions/trial/start', { companyId: 'current' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du démarrage de l\'essai');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-dark-surface">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-sm text-text-secondary dark:text-dark-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface py-xl">
      <div className="max-w-4xl mx-auto px-lg">
        <div className="text-center mb-xl">
          <h1 className="text-h1 font-bold text-primary mb-sm">Choisissez votre plan</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary">
            Sélectionnez le plan adapté à votre activité
          </p>
        </div>

        <div className="mb-lg text-center">
          <button
            onClick={handleStartTrial}
            disabled={submitting}
            className="btn-secondary"
          >
            {submitting ? 'Démarrage...' : 'Démarrer l\'essai gratuit (14 jours)'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {plans && Object.entries(plans.plans).map(([plan, pricing]: [string, any]) => (
            <div
              key={plan}
              className={`card cursor-pointer transition-all ${
                selectedPlan === plan ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="text-center mb-md">
                <h3 className="text-h3 font-bold mb-xs">{plan}</h3>
                <p className="text-display font-bold text-primary">
                  {pricing[selectedPeriod]} {plans.currency}
                </p>
                <p className="text-caption text-text-secondary dark:text-dark-text-secondary">
                  / {selectedPeriod === 'monthly' ? 'mois' : selectedPeriod === 'quarterly' ? 'trimestre' : selectedPeriod === 'semiannual' ? 'semestre' : 'an'}
                </p>
              </div>

              <div className="space-y-xs">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  ✓ Gestion des produits
                </p>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  ✓ Prise de commandes
                </p>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  ✓ Paiements espèces
                </p>
                {plan !== 'BASE' && (
                  <>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      ✓ Paiements mobile money
                    </p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      ✓ Gestion du personnel
                    </p>
                  </>
                )}
                {plan === 'SUPREME' && (
                  <>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      ✓ Gestion de la paie
                    </p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      ✓ Comptabilité
                    </p>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      ✓ KPI avancés
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-lg">
          <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
            Période de facturation
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field"
          >
            <option value="monthly">Mensuel</option>
            <option value="quarterly">Trimestriel</option>
            <option value="semiannual">Semestriel</option>
            <option value="annual">Annuel</option>
          </select>
        </div>

        {error && (
          <div className="mt-md p-sm bg-danger/10 text-danger rounded-sm text-sm">
            {error}
          </div>
        )}

        <div className="mt-lg">
          <button
            onClick={handleSubscribe}
            disabled={submitting || !selectedPlan}
            className="btn-primary w-full"
          >
            {submitting ? 'Souscription...' : 'Souscrire'}
          </button>
        </div>
      </div>
    </div>
  );
}
