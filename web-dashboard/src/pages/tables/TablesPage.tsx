import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  location?: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tables', {
        ...formData,
        capacity: parseInt(formData.capacity),
      });
      setShowModal(false);
      fetchTables();
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const handleStatusChange = async (tableId: string, status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED') => {
    try {
      await api.patch(`/tables/${tableId}/status`, { status });
      fetchTables();
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-xl">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-h1 font-bold">Tables</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Nouvelle table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {tables.map((table) => (
          <div key={table.id} className="card">
            <div className="flex justify-between items-start mb-sm">
              <h3 className="font-bold">{table.name}</h3>
              <span className={`px-sm py-xs rounded-sm text-xs font-medium ${
                table.status === 'AVAILABLE' ? 'bg-success/10 text-success' :
                table.status === 'OCCUPIED' ? 'bg-danger/10 text-danger' :
                'bg-warning/10 text-warning'
              }`}>
                {table.status}
              </span>
            </div>
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary mb-sm">
              Capacité: {table.capacity} personnes
            </div>
            {table.location && (
              <div className="text-sm text-text-secondary dark:text-dark-text-secondary mb-sm">
                {table.location}
              </div>
            )}
            <div className="flex gap-xs">
              <button
                onClick={() => handleStatusChange(table.id, 'AVAILABLE')}
                className="btn-secondary text-xs px-sm py-xs"
              >
                Libre
              </button>
              <button
                onClick={() => handleStatusChange(table.id, 'OCCUPIED')}
                className="btn-danger text-xs px-sm py-xs"
              >
                Occupée
              </button>
              <button
                onClick={() => handleStatusChange(table.id, 'RESERVED')}
                className="btn-warning text-xs px-sm py-xs"
              >
                Réservée
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md p-lg">
            <h2 className="text-h2 font-bold mb-md">Nouvelle table</h2>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Capacité
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Emplacement
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                />
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
