import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CreateCompanyPage from './pages/auth/CreateCompanyPage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/orders/OrdersPage';
import ProductsPage from './pages/products/ProductsPage';
import TablesPage from './pages/tables/TablesPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import PayrollPage from './pages/payroll/PayrollPage';
import TreasuryPage from './pages/treasury/TreasuryPage';
import ReportsPage from './pages/reports/ReportsPage';
import QRCodePage from './pages/qrcode/QRCodePage';
import SettingsPage from './pages/settings/SettingsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-company" element={<CreateCompanyPage />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route
        path="/"
        element={
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <DashboardLayout>
            <OrdersPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/products"
        element={
          <DashboardLayout>
            <ProductsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/tables"
        element={
          <DashboardLayout>
            <TablesPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/employees"
        element={
          <DashboardLayout>
            <EmployeesPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/payroll"
        element={
          <DashboardLayout>
            <PayrollPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/treasury"
        element={
          <DashboardLayout>
            <TreasuryPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/reports"
        element={
          <DashboardLayout>
            <ReportsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/qrcode"
        element={
          <DashboardLayout>
            <QRCodePage />
          </DashboardLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
