import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function ReportsPage() {
  const [dailyKPIs, setDailyKPIs] = useState<any>(null);
  const [weeklyKPIs, setWeeklyKPIs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const [daily, weekly] = await Promise.all([
        api.get('/reports/daily'),
        api.get('/reports/weekly'),
      ]);
      setDailyKPIs(daily.data);
      setWeeklyKPIs(weekly.data);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-xl">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-h1 font-bold mb-lg">Rapports & KPIs</h1>

      {dailyKPIs && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Commandes du jour</div>
            <div className="text-display font-bold text-primary">{dailyKPIs.totalOrders}</div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Revenu du jour</div>
            <div className="text-display font-bold text-success">{dailyKPIs.totalRevenue.toLocaleString()} XOF</div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Panier moyen</div>
            <div className="text-display font-bold">{Math.round(dailyKPIs.averageOrderValue).toLocaleString()} XOF</div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Flux de trésorerie</div>
            <div className={`text-display font-bold ${dailyKPIs.netCashFlow >= 0 ? 'text-success' : 'text-danger'}`}>
              {dailyKPIs.netCashFlow.toLocaleString()} XOF
            </div>
          </div>
        </div>
      )}

      {weeklyKPIs && (
        <div className="card mb-lg">
          <h2 className="text-h2 font-bold mb-md">Résumé hebdomadaire</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Revenu total</div>
              <div className="text-display font-bold text-success">{weeklyKPIs.totalRevenue.toLocaleString()} XOF</div>
            </div>
            <div>
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Total commandes</div>
              <div className="text-display font-bold">{weeklyKPIs.totalOrders}</div>
            </div>
          </div>
        </div>
      )}

      {dailyKPIs && (
        <div className="card">
          <h2 className="text-h2 font-bold mb-md">Statuts des commandes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
            {Object.entries(dailyKPIs.ordersByStatus).map(([status, count]) => (
              <div key={status} className="p-sm border rounded-sm">
                <div className="text-xs text-text-secondary dark:text-dark-text-secondary">{status}</div>
                <div className="font-bold">{count as number}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
