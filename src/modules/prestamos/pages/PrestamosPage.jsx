import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePrestamos } from '../hooks/usePrestamos';
import Loading from '../../../shared/components/Loading';

const Prestamos = () => {
  const [showModal, setShowModal] = useState(false);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    IdCuenta: '',
    Numero: '',
    Fecha: new Date().toISOString().split('T')[0],
    Valor: '',
    Interes: '',
    Plazo: '',
    Seguro: '',
    Cuota: ''
  });

  // Hook personalizado
  const { prestamos, cuentas, loading, error, createPrestamo, calcularCuota: calcularCuotaHook } = usePrestamos();

  const calcularCuota = () => {
    const { Valor, Interes, Plazo, Seguro } = nuevoPrestamo;
    if (Valor && Interes && Plazo) {
      const valorPrestamo = parseFloat(Valor);
      const tasaAnual = parseFloat(Interes);
      const numeroPagos = parseInt(Plazo);
      const seguro = parseFloat(Seguro) || 0;
      
      const cuotaSinSeguro = calcularCuotaHook(valorPrestamo, tasaAnual, numeroPagos);
      const cuotaTotal = cuotaSinSeguro + (seguro / numeroPagos);
      
      setNuevoPrestamo({ ...nuevoPrestamo, Cuota: cuotaTotal.toFixed(2) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createPrestamo(nuevoPrestamo);
    if (result.success) {
      toast.success('Préstamo creado exitosamente');
      setShowModal(false);
      setNuevoPrestamo({
        IdCuenta: '',
        Numero: '',
        Fecha: new Date().toISOString().split('T')[0],
        Valor: '',
        Interes: '',
        Plazo: '',
        Seguro: '',
        Cuota: ''
      });
    } else {
      toast.error(result.error || 'Error al crear préstamo');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-bbva-blue">Préstamos</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Nuevo Préstamo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">Total Préstamos</p>
          <p className="text-2xl font-bold text-bbva-blue">{prestamos.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Monto Total Prestado</p>
          <p className="text-2xl font-bold text-green-600">
            ${prestamos.reduce((sum, p) => sum + parseFloat(p.Valor || 0), 0).toLocaleString('es-CO')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Plazo Promedio</p>
          <p className="text-2xl font-bold text-orange-600">
            {prestamos.length > 0 
              ? Math.round(prestamos.reduce((sum, p) => sum + p.Plazo, 0) / prestamos.length)
              : 0} meses
          </p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Cuenta</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Interés</th>
              <th>Plazo</th>
              <th>Cuota</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map(prestamo => (
              <tr key={prestamo.IdPrestamo}>
                <td>{prestamo.IdPrestamo}</td>
                <td className="font-semibold">{prestamo.Numero}</td>
                <td>{prestamo.cuenta?.Numero || 'N/A'}</td>
                <td>
                  {prestamo.cuenta?.titulares?.map(t => t.Nombre).join(', ') || 'Sin titular'}
                </td>
                <td className="font-bold text-green-600">
                  ${parseFloat(prestamo.Valor || 0).toLocaleString('es-CO')}
                </td>
                <td>{prestamo.Interes}%</td>
                <td>{prestamo.Plazo} meses</td>
                <td className="font-bold">
                  ${parseFloat(prestamo.Cuota || 0).toLocaleString('es-CO')}
                </td>
                <td>{new Date(prestamo.Fecha).toLocaleDateString('es-ES')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-bbva-blue mb-6">Nuevo Préstamo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cuenta
                  </label>
                  <select
                    className="input-field"
                    value={nuevoPrestamo.IdCuenta}
                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, IdCuenta: e.target.value })}
                    required
                  >
                    <option value="">Seleccione una cuenta</option>
                    {cuentas.map(cuenta => (
                      <option key={cuenta.IdCuenta} value={cuenta.IdCuenta}>
                        {cuenta.Numero}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de Préstamo
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="PRE-XXX"
                    value={nuevoPrestamo.Numero}
                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, Numero: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valor del Préstamo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={nuevoPrestamo.Valor}
                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, Valor: e.target.value })}
                    onBlur={calcularCuota}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tasa de Interés (% anual)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={nuevoPrestamo.Interes}
                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, Interes: e.target.value })}
                    onBlur={calcularCuota}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plazo (meses)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={nuevoPrestamo.Plazo}
                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, Plazo: e.target.value })}
                    onBlur={calcularCuota}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seguro (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={nuevoPrestamo.Seguro}
                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, Seguro: e.target.value })}
                    onBlur={calcularCuota}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cuota Mensual
                  </label>
                  <input
                    type="text"
                    className="input-field bg-gray-100"
                    value={nuevoPrestamo.Cuota ? `$${parseFloat(nuevoPrestamo.Cuota).toLocaleString('es-CO')}` : ''}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={nuevoPrestamo.Fecha}
                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, Fecha: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  Registrar Préstamo
                </button>
                <button 
                  type="button" 
                  className="flex-1 btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prestamos;
