'use client'

import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, 
  Package, 
  UserCheck, 
  ClipboardList,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import toast, { Toaster } from "react-hot-toast";
import { getAllCustomers } from '@/utilites/CustomerRequests';
import CustomerList from '@/components/customers/CustomerList';
import { useLoading } from '@/components/loading/LoadingProvider';
import Navbar from '@/components/Navbar';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastPurchase: string;
  totalPurchases: number;
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

export default function DashboardPage() {
  const { setIsLoading } = useLoading();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [customers, setCustomers] = useState<Customer[]>();
  const [pagination, setPagination] = useState<PaginationType>({
    currentPage: 1,
    totalPages: 1
  });

  const router = useRouter();
  const pathname = usePathname();
  const username = "Bernardo Báez";

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

  const changePage = (pageNumber: number) => {
    if (pageNumber <= pagination.totalPages) {
      setPagination((pag) => ({ ...pag, currentPage: pageNumber }));
    }
  };

  const handleTabChange = (value: string) => {
    router.push(value);
  };

  useEffect(() => {
    setIsLoading(true);
    async function fetchAllCustomers() {
      try {
        const { data } = await getAllCustomers(pagination.currentPage);
        console.log(data.data.customers)
        setCustomers(data.data.customers);
        setTotalItems(data.data.pagination.totalItems);
        setPagination({
          currentPage: data.data.pagination.currentPage,
          totalPages: data.data.pagination.totalPages
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error("Algo ha salido mal!");
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllCustomers();
  }, [pagination.currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>

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
                        <h3 className="text-lg font-semibold text-gray-900">Cantidad de clientes</h3>
                        <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                      </div>
                    </div>
                  </div>

                  <CustomerList
                    customers={customers}
                    pagination={pagination}
                    changePage={changePage}
                  />
                </div>
        </div>
      </div>
    </div>
  );
}