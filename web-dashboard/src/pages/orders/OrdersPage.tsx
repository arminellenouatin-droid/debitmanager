import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Order {
  id: string;
  status: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Array<{ productId: string; quantity: number; unitPrice: number }>>([]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setSelectedProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToOrder = (productId: string, price: number) => {
    const existingItem = orderItems.find(item => item.productId === productId);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { productId, quantity: 1, unitPrice: price }]);
    }
  };

  const handleCreateOrder = async () => {
    if (orderItems.length === 0) return;

    try {
      await api.post('/orders', {
        orderType: 'DINE_IN',
        items: orderItems,
      });
      setShowOrderModal(false);
      setOrderItems([]);
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const getOrderTotal = () => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  if (loading) {
    return <div className="text-center py-xl">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="text-h1 font-bold">Commandes</h1>
        <button
          onClick={() => setShowOrderModal(true)}
          className="btn-primary"
        >
          + Nouvelle commande
        </button>
      </div>

      <div className="space-y-md">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-start mb-sm">
              <div>
                <h3 className="font-bold">Commande #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                  {new Date(order.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <span className={`px-sm py-xs rounded-sm text-xs font-medium ${
                order.status === 'PAID' ? 'bg-success/10 text-success' :
                order.status === 'CANCELLED' ? 'bg-danger/10 text-danger' :
                'bg-warning/10 text-warning'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="space-y-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.productName} x{item.quantity}</span>
                  <span>{item.totalPrice} XOF</span>
                </div>
              ))}
            </div>
            <div className="mt-sm pt-sm border-t border-border dark:border-dark-border flex justify-between font-bold">
              <span>Total</span>
              <span>{order.items.reduce((sum, item) => sum + item.totalPrice, 0)} XOF</span>
            </div>
          </div>
        ))}
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card w-full max-w-2xl p-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-h2 font-bold mb-md">Nouvelle commande</h2>
            
            <div className="mb-md">
              <h3 className="font-medium mb-sm">Produits disponibles</h3>
              <div className="grid grid-cols-2 gap-sm max-h-48 overflow-y-auto">
                {selectedProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleAddToOrder(product.id, product.price)}
                    className="card p-sm text-left hover:ring-2 ring-primary"
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                      {product.price} XOF
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-md">
              <h3 className="font-medium mb-sm">Articles de la commande</h3>
              {orderItems.length === 0 ? (
                <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
                  Aucun article sélectionné
                </p>
              ) : (
                <div className="space-y-xs">
                  {orderItems.map((item, idx) => {
                    const product = selectedProducts.find(p => p.id === item.productId);
                    return (
                      <div key={idx} className="flex justify-between items-center">
                        <span>{product?.name} x{item.quantity}</span>
                        <span>{item.quantity * item.unitPrice} XOF</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-md font-bold">
              <span>Total</span>
              <span>{getOrderTotal()} XOF</span>
            </div>

            <div className="flex gap-sm">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setOrderItems([]);
                }}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={orderItems.length === 0}
                className="btn-primary flex-1"
              >
                Créer la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
