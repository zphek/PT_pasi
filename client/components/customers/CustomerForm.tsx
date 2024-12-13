import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCustomer, updateCustomer } from '@/utilites/CustomerRequests';
import toast from 'react-hot-toast';

const CustomerForm = ({ open, onClose, customer }:any) => {
  const [formData, setFormData] = useState(
    customer || {
      name: "",
      email: "",
      phone: "",
      dni: "",
    }
  );

  useEffect(() => {
    if(customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo permite números
    setFormData({...formData, phone: value});
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    try {
      if(!customer) {
        toast.promise(
          createCustomer(formData),      
          {
            loading: "Intentando crear el cliente...",
            success: <b>Nuevo cliente agregado.</b>,
            error: <b>Algo ha salido mal, no se ha podido crear el cliente.</b>
          }
        );
      } else {
        toast.promise(
          updateCustomer(customer.customerId, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dni: formData.dni,
            }),      
          {
            loading: "Actualizando cliente...",
            success: <b>Cliente actualizado.</b>,
            error: <b>Algo ha salido mal, no se ha podido actualizar el cliente.</b>
          }
        );
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        dni: "",
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        dni: "",
      });
      onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del cliente</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email del cliente</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              value={formData.dni}
              onChange={(e) => setFormData({...formData, dni: e.target.value})}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {customer ? 'Guardar cambios' : 'Crear cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;