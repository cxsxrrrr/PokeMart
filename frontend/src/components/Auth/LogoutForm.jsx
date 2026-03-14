import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '@heroui/react';

export default function LogoutForm() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // Un pequeño delay para que el usuario vea que algo pasó (opcional)
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error("Error durring logout:", error);
        navigate('/');
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="lg" color="secondary" labelColor="secondary" label="Cerrando sesión de forma segura..." />
      <p className="text-slate-500 dark:text-slate-400 animate-pulse font-medium">
        Gracias por visitar PokéMart. ¡Vuelve pronto!
      </p>
    </div>
  );
}
