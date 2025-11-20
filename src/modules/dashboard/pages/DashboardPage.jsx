import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@modules/dashboard/hooks/useDashboard';
import StatCard from '@shared/components/StatCard';
import Card from '@shared/components/Card';
import Table from '@shared/components/Table';
import Loading from '@shared/components/Loading';
import { formatCurrency } from '@shared/utils/formatters';
import { formatShortDate } from '@shared/utils/formatters';

const Dashboard = () => {
  // Hook personalizado
  const {
    cuentas,
    movimientos,
    prestamos,
    loading,
    error,
    getTotalBalance,
    getTotalPrestamos,
    getUltimosMovimientos,
    getChartData
  } = useDashboard();

  // Estadísticas calculadas
  const stats = {
    totalCuentas: cuentas?.length || 0,
    saldoTotal: getTotalBalance(),
    movimientosRecientes: movimientos?.length || 0,
    prestamosActivos: prestamos?.length || 0
  };

  const chartData = getChartData();
  const ultimosMovimientos = getUltimosMovimientos(5);

  // Configuración de columnas para la tabla (principio de configuración)
  const tableColumns = [
    { 
      key: 'Numero', 
      header: 'Número',
      render: (value) => <span className="font-semibold">{value}</span>
    },
    { 
      key: 'tipoCuenta', 
      header: 'Tipo',
      render: (value) => value?.TipoCuenta || 'N/A'
    },
    { 
      key: 'Saldo', 
      header: 'Saldo',
      render: (value) => (
        <span className="text-green-600 font-bold">{formatCurrency(value)}</span>
      )
    },
    { 
      key: 'FechaApertura', 
      header: 'Fecha Apertura',
      render: (value) => formatShortDate(value)
    }
  ];

  if (loading) return <Loading />;
  if (error) return (
    <div className="text-red-600 p-4 bg-red-50 rounded-lg">
      <p className="font-bold">Error:</p>
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-bbva-blue text-white rounded hover:bg-bbva-light-blue"
      >
        Recargar
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-bbva-blue">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Cuentas" 
          value={stats.totalCuentas}
          variant="primary"
        />

        <StatCard 
          title="Saldo Total" 
          value={formatCurrency(stats.saldoTotal)}
          variant="success"
        />

        <StatCard 
          title="Movimientos" 
          value={stats.movimientosRecientes}
          variant="info"
        />

        <StatCard 
          title="Préstamos Activos" 
          value={stats.prestamosActivos}
          variant="warning"
        />
      </div>

      <Card title="Saldos por Cuenta" variant="primary">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="saldo" fill="#043263" name="Saldo" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card 
        title="Cuentas Recientes"
        variant="primary"
        footer={
          <Link to="/cuentas" className="text-bbva-light-blue hover:underline font-semibold">
            Ver todas las cuentas →
          </Link>
        }
      >
        <Table 
          columns={tableColumns}
          data={(cuentas || []).slice(0, 5)}
          emptyMessage="No hay cuentas disponibles"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
