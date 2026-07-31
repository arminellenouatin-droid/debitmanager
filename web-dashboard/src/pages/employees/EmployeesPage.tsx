import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  role: 'SERVER' | 'BARTENDER' | 'COOK' | 'CLEANER' | 'SECURITY' | 'MANAGER';
  status: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    role: 'SERVER' as const,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/employees', formData);
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const roleLabels: Record<string, string> = {
    SERVER: 'Serveur',
    BARTENDER: 'Barman',
    COOK: 'Cuisinier',
    CLEANER: 'Agent d\'entretien',
    SECURITY: 'Sécurité',
    MANAGER: 'Manager',
  };

  if (loading) {
    return <div className="text-center py-xl">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-h1 font-bold">Personnel</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Nouvel employé
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {employees.map((employee) => (
          <div key={employee.id} className="card">
            <div className="flex justify-between items-start mb-sm">
              <h3 className="font-bold">{employee.firstName} {employee.lastName}</h3>
              <span className="px-sm py-xs rounded-sm text-xs font-medium bg-primary/10 text-primary">
                {roleLabels[employee.role]}
              </span>
            </div>
            {employee.phone && (
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary mb-sm">
                {employee.phone}
              </div>
            )}
            {employee.email && (
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary mb-sm">
                {employee.email}
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className={employee.status === 'ACTIVE' ? 'text-success' : 'text-danger'}>
                {employee.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md p-lg">
            <h2 className="text-h2 font-bold mb-md">Nouvel employé</h2>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="input-field"
                  required
                >
                  <option value="SERVER">Serveur</option>
                  <option value="BARTENDER">Barman</option>
                  <option value="COOK">Cuisinier</option>
                  <option value="CLEANER">Agent d'entretien</option>
                  <option value="SECURITY">Sécurité</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
              <div className="flex gap-sm">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
