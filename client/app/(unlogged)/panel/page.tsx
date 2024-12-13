"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Package, CalendarRange } from 'lucide-react';

export default function page() {
  return (
    <div className="min-h-screen w-full p-4 bg-gray-50">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                Reservas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Gestión de Productos</h3>
                {/* Aquí va el contenido de la pestaña Productos */}
                <p className="text-gray-500">Contenido de la sección de productos...</p>
              </div>
            </TabsContent>
            
            <TabsContent value="clients" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Gestión de Clientes</h3>
                {/* Aquí va el contenido de la pestaña Clientes */}
                <p className="text-gray-500">Contenido de la sección de clientes...</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reservations" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Gestión de Reservas</h3>
                {/* Aquí va el contenido de la pestaña Reservas */}
                <p className="text-gray-500">Contenido de la sección de reservas...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}