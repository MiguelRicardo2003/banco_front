import { Link } from 'react-router-dom';
import Button from '@shared/components/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center px-6">
                {/* Icono de error */}
                <div className="mb-8">
                    <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Página no encontrada
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Lo sentimos, la página que buscas no existe o no tienes permisos para acceder a ella.
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4 flex flex-col">
                    <Link to="/">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                            <Home className="w-4 h-4 mr-2" />
                            Ir al Inicio
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver Atrás
                    </Button>
                </div>

                {/* Información adicional */}
                <div className="mt-8 text-sm text-gray-500">
                    <p>Si crees que esto es un error, contacta al administrador.</p>
                </div>
            </div>
        </div>
    );
};