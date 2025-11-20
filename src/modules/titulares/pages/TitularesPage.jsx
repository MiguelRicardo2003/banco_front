import { useTitulares } from '../hooks/useTitulares';
import Card from '../../../shared/components/Card';
import Loading from '../../../shared/components/Loading';
import Badge from '../../../shared/components/Badge';
import { formatCurrency } from '../../../shared/utils/formatters';

const TitularesPage = () => {
  const { titulares, loading } = useTitulares();

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Titulares y sus Cuentas</h1>
        <p className="mt-2 text-gray-600">
          Lista de todos los titulares registrados con sus cuentas asociadas
        </p>
      </div>

      <div className="grid gap-6">
        {titulares.map((titular) => (
          <Card key={titular.IdCuentahabiente}>
            <div className="space-y-4">
              {/* Información del Titular */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-900">{titular.Nombre}</h2>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Documento:</span>{' '}
                    {titular.tipoDocumento?.Sigla} {titular.Documento}
                  </div>
                  <div>
                    <span className="font-medium">Ciudad:</span> {titular.ciudad?.Ciudad}
                  </div>
                  {titular.Telefono && (
                    <div>
                      <span className="font-medium">Teléfono:</span> {titular.Telefono}
                    </div>
                  )}
                  {titular.Direccion && (
                    <div>
                      <span className="font-medium">Dirección:</span> {titular.Direccion}
                    </div>
                  )}
                </div>
              </div>

              {/* Cuentas del Titular */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Cuentas ({titular.cuentas?.length || 0})
                </h3>
                {titular.cuentas && titular.cuentas.length > 0 ? (
                  <div className="grid gap-3">
                    {titular.cuentas.map((cuenta) => (
                      <div
                        key={cuenta.IdCuenta}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium text-gray-900">
                                {cuenta.Numero}
                              </span>
                              <Badge variant="info">
                                {cuenta.tipoCuenta?.TipoCuenta}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Apertura:{' '}
                              {new Date(cuenta.FechaApertura).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Saldo</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(cuenta.Saldo)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No tiene cuentas asociadas</p>
                )}
              </div>
            </div>
          </Card>
        ))}

        {titulares.length === 0 && !loading && (
          <Card>
            <p className="text-center text-gray-500 py-8">
              No hay titulares registrados
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TitularesPage;
