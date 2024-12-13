'use client'

import React, { useEffect, useState } from 'react';
import ReservationFilters from './ReservationFilters';
import ReservationForm from './ReservationForm';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calendar, DollarSign, Package } from 'lucide-react';
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
import { deleteReservation } from '@/utilites/ReservationRequests';
import toast, { Toaster } from 'react-hot-toast';

const ReservationList = ({ reservations: initialReservations, changePage, pagination }: any) => {
  const [reservations, setReservations] = useState(initialReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [deletingReservation, setDeletingReservation] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReservations = reservations ? reservations?.filter((reservation: any) => {
    if (!reservation) return false;
    try {
      const matchesSearch = 
        (reservation.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (reservation.status?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesSearch;
    } catch (error) {
      console.error('Error filtering reservation:', reservation, error);
      return false;
    }
  }) : [];

  useEffect(() => {
    setReservations(initialReservations);
  }, [initialReservations]);

  const handleEdit = (reservation: any) => {
    setEditingReservation(reservation);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (reservation: any) => {
    setDeletingReservation(reservation);
  };

  const handleConfirmDelete = async () => {
    if (deletingReservation) {
      toast.promise(
        deleteReservation(deletingReservation.reservationId)
          .then(() => {
            setReservations(reservations.filter((r: any) => r.reservationId !== deletingReservation.reservationId));
            setDeletingReservation(null);
          }),
        {
          loading: "Eliminando reservación...",
          success: "Reservación eliminada correctamente",
          error: "Error al eliminar la reservación"
        }
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reservaciones</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reservación
        </Button>
      </div>

      <ReservationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearFilters={() => setSearchTerm('')}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation: any, index: number) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-bold">{reservation.customerName}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-2" />
                      {reservation.products.length} productos
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${reservation.total}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(reservation.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(reservation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteClick(reservation)}
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

      <ReservationForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReservation(null);
        }}
        reservation={editingReservation}
      />

      {/* Paginación */}
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

      <AlertDialog open={!!deletingReservation} onOpenChange={() => setDeletingReservation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la reservación de
              "{deletingReservation?.customerName}" y toda su información asociada.
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

export default ReservationList;