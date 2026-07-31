import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  description: string;
  category?: string;
  transactionDate: string;
}

export default function TreasuryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'INCOME' as const,
    amount: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/treasury/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await api.get('/treasury/balance');
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/treasury/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setShowModal(false);
      fetchTransactions();
      fetchBalance();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-xl">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-h1 font-bold">Trésorerie</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Nouvelle transaction
        </button>
      </div>

      {balance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Solde</div>
            <div className={`text-display font-bold ${balance.balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {balance.balance.toLocaleString()} XOF
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Entrées</div>
            <div className="text-display font-bold text-success">
              {balance.totalIncome.toLocaleString()} XOF
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Sorties</div>
            <div className="text-display font-bold text-danger">
              {balance.totalExpenses.toLocaleString()} XOF
            </div>
          </div>
        </div>
      )}

      <div className="space-y-md">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{transaction.description}</h3>
                {transaction.category && (
                  <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                    {transaction.category}
                  </p>
                )}
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  {new Date(transaction.transactionDate).toLocaleString('fr-FR')}
                </p>
              </div>
              <span className={`text-display font-bold ${
                transaction.type === 'INCOME' ? 'text-success' :
                transaction.type === 'EXPENSE' ? 'text-danger' :
                'text-primary'
              }`}>
                {transaction.type === 'INCOME' ? '+' : '-'}{transaction.amount.toLocaleString()} XOF
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md p-lg">
            <h2 className="text-h2 font-bold mb-md">Nouvelle transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="input-field"
                  required
                >
                  <option value="INCOME">Entrée</option>
                  <option value="EXPENSE">Sortie</option>
                  <option value="TRANSFER">Transfert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Montant
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Catégorie
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
