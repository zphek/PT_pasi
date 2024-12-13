import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator, // Agregado para mejor separación visual
  DropdownMenuLabel // Agregado para mostrar información del usuario
} from "@radix-ui/react-dropdown-menu";
import { UserCircle, LogOut, Settings } from "lucide-react"; // Agregados más íconos
import { Button } from "./ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { verifySession } from "@/utilites/AuthRequests";
import { useRouter } from 'next/navigation'; // Para redirección después del logout

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      async function getSession() {
        try {
          const response = await verifySession();
          setUser(response.data.user);
        } catch (error) {
          console.error('Error verificando sesión:', error);
        }
      }

      getSession();
    }, []);

    const handleLogout = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/logout', {
          withCredentials: true
        });
    
        if (response.data.success) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-blue-900">
              PT_Pasi
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                {user?.email || 'Usuario'}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <UserCircle className="h-6 w-6 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.role || 'Usuario'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 border-gray-200" />
                  <DropdownMenuItem 
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    );
}