'use client'

import React, { useEffect, useState } from 'react';
import ProductList from '@/components/products/ProductList';
import { getAllProducts } from '@/utilites/ProductRequests';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  UserCircle, 
  Store, 
  Package, 
  UserCheck, 
  ClipboardList,
  Search,
  Plus,
  Filter,
  CalendarRange,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast";
import Navbar from '@/components/Navbar';
import ReservationList from '@/components/reservations/ReservationList';
import { getAllReservations } from '@/utilites/ReservationRequests';
import { useLoading } from '@/components/loading/LoadingProvider';

// Interfaces
interface Reservation {
  id: string;
  customerName: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  items: number;
  total: number;
}

interface PaginationType {
  currentPage: number;
  totalPages: number;
}

interface TabItem {
  value: string;
  label: string;
  icon: React.ElementType;
}

const SAMPLE_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    customerName: 'Juan Pérez',
    date: '2024-03-20',
    status: 'pending',
    items: 3,
    total: 150.00
  },
  {
    id: '2',
    customerName: 'María García',
    date: '2024-03-22',
    status: 'confirmed',
    items: 2,
    total: 80.00
  },
  // Añade más reservas aquí...
];

export default function DashboardPage() {
  // States
  const { setIsLoading } = useLoading();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoadingg] = useState(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPages: 1
  });

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const username = "Bernardo Báez";

  // Tab configuration
  const tabs: TabItem[] = [
    {
      value: '/products',
      label: 'Productos',
      icon: Package,
    },
    {
      value: '/customers',
      label: 'Clientes',
      icon: UserCheck,
    },
    {
      value: '/reservations',
      label: 'Reservas',
      icon: ClipboardList,
    },
  ];

  // Handlers
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    toast.success("Sesión cerrada correctamente");
  };

  const changePage = (pageNumber: number) => {
    if (pageNumber <= pagination.totalPages) {
      setPagination((pag) => ({ ...pag, currentPage: pageNumber }));
    }
  };

  const handleTabChange = (value: string) => {
    router.push(value);
  };

  // Effects
  useEffect(() => {
    setIsLoading(true);
    async function fetchAllProducts() {
      try {
        const { data } = await getAllReservations(pagination.currentPage);
        setReservations(data.data.reservations);
        setTotalItems(data.data.pagination.totalItems);
        setPagination({
          currentPage: data.data.pagination.currentPage,
          totalPages: data.data.pagination.totalPages
        });
        console.log(data);
        setIsLoading(false);
      } catch (error) {
        // console.error('Error fetching products:', error);
        toast.error("Algo ha salido mal!");
        setReservations([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllProducts();
  }, [pagination.currentPage]);

  // Render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar/>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs
          defaultValue="/products"
          value={pathname || "/products"}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="h-auto md:h-16 w-full md:w-[600px] mx-auto flex flex-col items-center md:flex-row md:space-x-4 space-y-2 md:space-y-0 bg-gray-50/50 p-2">
            {tabs.map(({ value, label, icon: Icon}) => (
              <TabsTrigger
                key={value}
                value={value}
                className="group relative h-14 w-full md:w-auto md:flex-1 rounded-lg px-6 py-2 hover:bg-white data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="relative flex h-full items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-600 group-data-[state=active]:text-blue-600" />
                    <span className="text-sm font-medium text-gray-600 group-data-[state=active]:text-blue-600">
                      {label}
                    </span>
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Welcome Card */}
                  <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Store className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          ¡Bienvenido de nuevo, {username}!
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Gestiona tu inventario y productos desde aquí
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-semibold text-gray-900">Cantidad de reservaciones</h3>
                        <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product List */}
                  <ReservationList
                    reservations={reservations}
                    pagination={pagination}
                    changePage={changePage}
                  />
                </div>
        </div>
      </div>
    </div>
  );
}