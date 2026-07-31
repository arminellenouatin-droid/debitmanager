import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Commandes', href: '/orders', icon: ShoppingCart },
    { name: 'Produits', href: '/products', icon: Package },
    { name: 'Personnel', href: '/employees', icon: Users },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface dark:bg-dark-surface">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-background dark:bg-dark-background border-r border-border dark:border-dark-border">
        <div className="p-lg">
          <h1 className="text-h1 font-bold text-primary">DebitManager</h1>
        </div>
        
        <nav className="px-sm">
          <ul className="space-y-sm">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-sm px-md py-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary dark:bg-primary/10'
                        : 'text-text-secondary dark:text-dark-text-secondary hover:bg-surface dark:hover:bg-dark-surface'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-sm border-t border-border dark:border-dark-border">
          <div className="flex items-center gap-sm mb-sm">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-sm w-full px-md py-sm text-text-secondary dark:text-dark-text-secondary hover:text-danger dark:hover:text-danger transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-lg">
        <Outlet />
      </main>
    </div>
  );
}
