'use client'

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createReservation, getReservationById, updateReservation } from '@/utilites/ReservationRequests';
import toast from 'react-hot-toast';
import { getSimilarProductNames } from '@/utilites/ProductRequests';
import { findCustomersBy } from '@/utilites/CustomerRequests';

const ReservationForm = ({ open, onClose, reservation }: any) => {
  const initialFormData = {
    customerId: "",
    customerName: "",
    date: "",
    status: "PENDING",
    total: 0,
    products: []
  };

  const [formData, setFormData] = useState(reservation || initialFormData);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [productNames, setProductNames] = useState<any>(null);
  const [customerNames, setCustomerNames] = useState<any>(null);
  const [productSearchValue, setProductSearchValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (reservation) {
        try {
          const { data } = await getReservationById(reservation.reservationId);
          setFormData(data.data);
          setSelectedProducts(data.data.products || []);
        } catch (error) {
          console.error('Error fetching reservation:', error);
          toast.error('Error al cargar la reservación');
        }
      }
    }
    fetchData();
  }, [reservation]);

  const onChangeCustomerName = async (e: any) => {
    const { value } = e.target;
    try {
      if (value.length === 0) {
        setCustomerNames(null);
        setFormData((prev:any) => ({ ...prev, customerName: value, customerId: '' }));
        return;
      }
      
      setFormData((prev:any) => ({ ...prev, customerName: value }));
      const response = await findCustomersBy(value);
      const customers = response.data?.data || [];
      console.log('Customers found:', customers);
      setCustomerNames(customers);
    } catch (error) {
      setCustomerNames(null);
    }
  };

  const handleSelectedCustomer = (customer: any, e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la propagación del evento
    e.stopPropagation(); // Detener la propagación
    
    console.log('Customer selected:', customer); // Para debug
    
    setFormData((prev:any) => ({
      ...prev,
      customerId: customer.customerId,
      customerName: customer.name
    }));
    
    // Limpiar la búsqueda
    setCustomerNames(null);
  };
  

  const onChangeProductName = async (e: any) => {
    const { value } = e.target;
    setProductSearchValue(value);
    try {
      if (value.length === 0) {
        setProductNames(null);
        return;
      }
      const { data } = await getSimilarProductNames(value);
      setProductNames(data.data);
    } catch (error) {
      setProductNames(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const handleSelectedProduct = (product: any, e:any) => {
    e.preventDefault(); // Prevenir la propagación del evento
    e.stopPropagation(); // Detener la propagación

    console.log('Selected product:', product);
    
    if (selectedProducts.some(p => p.productId === product.productId)) {
      toast.error("Este producto ya está en la lista");
      return;
    }
  
    const newProduct = {
      productId: product.productId,
      productName: product.productName,
      quantity: 1,
      unitPrice: parseFloat(product.price || 0),
      totalPrice: parseFloat(product.price || 0),
      quantityInStock: parseInt(product.quantityInStock || 0)
    };
    
    console.log('New product to add:', newProduct);
    setSelectedProducts(prev => [...prev, newProduct]);
    setProductSearchValue("");
    setProductNames(null);
    calculateTotal([...selectedProducts, newProduct]);
  };
  
  const handleProductQuantityChange = (productId: string, newQuantity: number) => {
    console.log('Changing quantity:', { productId, newQuantity });
    
    const updatedProducts = selectedProducts.map(product => {
      if (product.productId === productId) {
        const safeQuantity = Math.min(Math.max(1, newQuantity || 1), product.quantityInStock);
        const newTotalPrice = safeQuantity * parseFloat(product.unitPrice);
        return {
          ...product,
          quantity: safeQuantity,
          totalPrice: newTotalPrice
        };
      }
      return product;
    });
  
    console.log('Updated products:', updatedProducts);
    setSelectedProducts(updatedProducts);
    calculateTotal(updatedProducts);
  };
  
  const calculateTotal = (products: any[]) => {
    const total = products.reduce((sum, product) => {
      const productTotal = parseFloat(product.totalPrice) || 0;
      return sum + productTotal;
    }, 0);
    
    console.log('Calculated total:', total);
    setFormData((prev:any) => ({ ...prev, total }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast.error("Debe agregar al menos un producto");
      return;
    }

    try {
      const reservationData = {
        ...formData,
        products: selectedProducts
      };

      if (!reservation) {
        await toast.promise(
          createReservation(reservationData),      
          {
            loading: "Creando reservación...",
            success: "Nueva reservación creada.",
            error: "Error al crear la reservación."
          }
        );
      } else {
        await toast.promise(
          updateReservation(reservation.reservationId, reservationData),      
          {
            loading: "Actualizando reservación...",
            success: "Reservación actualizada.",
            error: "Error al actualizar la reservación."
          }
        );
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedProducts([]);
    setProductSearchValue("");
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      resetForm();
      onClose();
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {reservation ? 'Editar Reservación' : 'Nueva Reservación'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre del cliente</Label>
            <div className='flex flex-col relative'>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={onChangeCustomerName}
                disabled={reservation && true}
                placeholder="Buscar cliente..."
                required
                autoComplete="off"
              />

              {customerNames && <ul className='absolute w-full top-10 min-h-10 shadow-lg z-50 rounded-lg bg-white' onClick={()=> console.log("XD")}>
                {customerNames.map((customer: any, index: number) =>
                  <li
                    key={index}
                    className='py-2 px-6 hover:bg-blue-100 cursor-pointer transition-[400ms] flex justify-between w-full'
                    onClick={(e) => handleSelectedCustomer(customer, e)}
                  >
                    <div>
                      <span className="font-semibold">{customer.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({customer.dni})</span>
                    </div>
                    <span className="text-sm text-gray-500">{customer.email}</span>
                  </li>
                )}
              </ul>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha de reservación</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData((prev:any) => ({...prev, date: e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev:any) => ({...prev, status: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Productos</Label>
            <div className='flex flex-col relative'>
              <Input
                id="productSearch"
                type="text"
                value={productSearchValue}
                onChange={onChangeProductName}
                placeholder="Buscar producto..."
                className="w-full"
                autoComplete="off"
              />

              {productNames && <ul className='absolute w-full top-10 min-h-10 shadow-lg z-50 rounded-lg bg-white'>
                {productNames.map((product:any, index:number) =>
                  <li 
                    key={index} 
                    className='py-2 px-6 hover:bg-blue-100 cursor-pointer transition-[400ms] flex justify-between w-full'
                    onClick={(e) => handleSelectedProduct(product, e)}
                  >
                    <span>{product.productName}</span> 
                    <span className='font-bold'>Disponible: {product.quantityInStock}</span>
                  </li>
                )}
              </ul>}
            </div>

            {selectedProducts.length === 0 ? 
              <h4 className='text-center text-xs py-10'>No hay productos</h4> :
              selectedProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Input
                    value={product.productName}
                    disabled
                    className="flex-grow"
                  />
                  <div className="flex flex-col items-end text-sm text-gray-500">
                    <span>Stock: {product.quantityInStock}</span>
                    <span>{formatCurrency(product.unitPrice)}</span>
                  </div>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductQuantityChange(product.productId, parseInt(e.target.value) || 1)}
                    className="w-24"
                    min="1"
                    max={product.quantityInStock}
                  />
                  <div className="w-24 text-right font-bold">
                    {formatCurrency(product.totalPrice)}
                  </div>
                  <Button 
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const newProducts = selectedProducts.filter((_, i) => i !== index);
                      setSelectedProducts(newProducts);
                      calculateTotal(newProducts);
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              ))
            }
          </div>

          <div className="space-y-2">
            <Label>Total</Label>
            <Input
              value={formatCurrency(formData.total)}
              disabled
              className="text-right font-bold"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {reservation ? 'Guardar cambios' : 'Crear reservación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;