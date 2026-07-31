import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currentStock: number;
  alertThreshold: number;
  category?: { id: string; name: string };
  unit?: { id: string; name: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    unitId: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-xl">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-h1 font-bold">Produits</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Nouveau produit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="flex justify-between items-start mb-sm">
              <h3 className="font-bold">{product.name}</h3>
              <span className="text-display font-bold text-primary">
                {product.price} XOF
              </span>
            </div>
            {product.description && (
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-sm">
                {product.description}
              </p>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className={product.currentStock <= product.alertThreshold ? 'text-danger' : 'text-success'}>
                Stock: {product.currentStock}
              </span>
              {product.category && (
                <span className="text-text-secondary dark:text-dark-text-secondary">
                  {product.category.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md p-lg">
            <h2 className="text-h2 font-bold mb-md">Nouveau produit</h2>
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
                  Prix
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs text-text-secondary dark:text-dark-text-secondary">
                  Stock initial
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="input-field"
                  required
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
