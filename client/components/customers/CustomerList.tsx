'use client'

import React, { useEffect, useState } from 'react';
import CustomerFilters from './CustomerFilters';
import CustomerForm from './CustomerForm';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, UserCircle, Mail, Phone } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { deleteCustomer } from '@/utilites/CustomerRequests';
import toast, { Toaster } from 'react-hot-toast';

const CustomerList = ({ customers: initialCustomers, changePage, pagination }: any) => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<any>(null);

  const filteredCustomers = customers ? customers?.filter((customer: any) => {
    if (!customer) return false;
    try {
      const matchesSearch = 
        (customer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (customer.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesSearch;
    } catch (error) {
      console.error('Error filtering customer:', customer, error);
      return false;
    }
  }) : [];


  useEffect(() => {
    setCustomers(initialCustomers);
    console.log(customers, "XD")
  }, [initialCustomers]);

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (customer: any) => {
    setDeletingCustomer(customer);
  };

  const handleConfirmDelete = async () => {
    if (deletingCustomer) {
      toast.promise(
        deleteCustomer(deletingCustomer.customerId)
          .then((response) => {
            setCustomers(customers.filter((c: any) => c.customerId !== deletingCustomer.customerId));
            setDeletingCustomer(null);
          })
          .catch(err=>{
            console.log(err)
            }
          ),
        {
          loading: "Eliminando cliente...",
          success: "Cliente eliminado correctamente",
          error: "Error al eliminar el cliente"
        }
      );
    }
  };

  const handleSubmit = (formData: any) => {
    if (editingCustomer) {
      setCustomers(customers.map((c: any) =>
        c.customerId === editingCustomer.customerId ? { ...formData, customerId: c.customerId } : c
      ));
    } else {
      setCustomers([...customers, { ...formData, customerId: Date.now().toString() }]);
    }
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearFilters={() => setSearchTerm('')}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Fecha de creaci&oacute;n</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <UserCircle className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-bold">{customer.name}</div>
                      <div className="font-medium">{customer.dni}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteClick(customer)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CustomerForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }}
        customer={editingCustomer}
        onSubmit={handleSubmit}
      />

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1}
        >
          Anterior
        </Button>
        
        <div className="flex items-center gap-1">
          {[...Array(pagination.totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={pagination.currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => changePage(index + 1)}
              className={cn(
                "w-8 h-8",
                pagination.currentPage === index + 1 && "pointer-events-none"
              )}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => changePage(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages}
        >
          Siguiente
        </Button>

        <span className="text-sm text-gray-600 ml-2">
          Página {pagination.currentPage} de {pagination.totalPages}
        </span>
      </div>

      <AlertDialog open={!!deletingCustomer} onOpenChange={() => setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente 
              "{deletingCustomer?.name}" y toda su información asociada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
};

export default CustomerList;