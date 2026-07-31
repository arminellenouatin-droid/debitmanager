import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Payroll {
  id: string;
  employeeId: string;
  employee?: { firstName: string; lastName: string };
  startDate: string;
  endDate: string;
  baseSalary: number;
  hoursWorked: number;
  overtimeHours: number;
  grossPay: number;
  netPay: number;
  status: 'PENDING' | 'APPROVED' | 'PAID';
}

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchPayrolls();
    fetchSummary();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await api.get('/payroll');
      setPayrolls(response.data);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get('/payroll/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/payroll/${id}/approve`);
      fetchPayrolls();
    } catch (error) {
      console.error('Error approving payroll:', error);
    }
  };

  const handlePay = async (id: string) => {
    try {
      await api.patch(`/payroll/${id}/pay`);
      fetchPayrolls();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-xl">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-h1 font-bold mb-lg">Paie</h1>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Net</div>
            <div className="text-display font-bold text-success">{summary.totalNetPay.toLocaleString()} XOF</div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">En attente</div>
            <div className="text-display font-bold text-warning">{summary.pending}</div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Approuvés</div>
            <div className="text-display font-bold text-primary">{summary.approved}</div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Payés</div>
            <div className="text-display font-bold text-success">{summary.paid}</div>
          </div>
        </div>
      )}

      <div className="space-y-md">
        {payrolls.map((payroll) => (
          <div key={payroll.id} className="card">
            <div className="flex justify-between items-start mb-sm">
              <div>
                <h3 className="font-bold">
                  {payroll.employee?.firstName} {payroll.employee?.lastName}
                </h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  {new Date(payroll.startDate).toLocaleDateString('fr-FR')} - {new Date(payroll.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className={`px-sm py-xs rounded-sm text-xs font-medium ${
                payroll.status === 'PAID' ? 'bg-success/10 text-success' :
                payroll.status === 'APPROVED' ? 'bg-primary/10 text-primary' :
                'bg-warning/10 text-warning'
              }`}>
                {payroll.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-sm mb-sm">
              <div>
                <div className="text-xs text-text-secondary dark:text-dark-text-secondary">Heures</div>
                <div className="font-medium">{payroll.hoursWorked}h</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary dark:text-dark-text-secondary">Supp.</div>
                <div className="font-medium">{payroll.overtimeHours}h</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary dark:text-dark-text-secondary">Brut</div>
                <div className="font-medium">{payroll.grossPay.toLocaleString()} XOF</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary dark:text-dark-text-secondary">Net</div>
                <div className="font-bold text-success">{payroll.netPay.toLocaleString()} XOF</div>
              </div>
            </div>
            <div className="flex gap-xs">
              {payroll.status === 'PENDING' && (
                <button
                  onClick={() => handleApprove(payroll.id)}
                  className="btn-primary text-xs px-sm py-xs"
                >
                  Approuver
                </button>
              )}
              {payroll.status === 'APPROVED' && (
                <button
                  onClick={() => handlePay(payroll.id)}
                  className="btn-success text-xs px-sm py-xs"
                >
                  Payer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
