import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { checkIfProductNameExist, createProduct, updateProduct } from '@/utilites/ProductRequests';
import toast from 'react-hot-toast';

const ProductForm = ({ 
  open, 
  onClose, 
  product, 
  categories, 
}: any) => {
  const [formData, setFormData] = useState(
    product || {
      productName: "",
      productDescription: "",
      quantityInStock: 1,
      isActive: true,
      imageUrl: "",
      price: 1,
      category: "",
    }
  );
  const [isNameAvailable, setIsNameAvailable] = useState<any>(null);

  function onChangeProductName(e: any) {
    if (product) {
      return;
    }

    const { value } = e.target;

    if (value.length === 0) {
      setIsNameAvailable(null);
    }

    setTimeout(async () => {
      try {
        const response = await checkIfProductNameExist(value);
        const exists = response?.data?.data?.exists ?? false;
        setIsNameAvailable(!exists);
      } catch (error) {
        console.error('Error checking product name:', error);
        setIsNameAvailable(true);
      }
    }, 1000);
  }

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (!product) {
        toast.promise(createProduct(formData), {
          loading: "Intentando crear el producto...",
          success: <b>Nuevo producto agregado.</b>,
          error: <b>Algo ha salido mal, no se ha podido crear el producto.</b>,
        });
      } else {
        toast.promise(updateProduct(product.productId, formData), {
          loading: "Actualizar producto...",
          success: <b>Producto actualizado.</b>,
          error: <b>Algo ha salido mal, no se ha podido actualizar el producto.</b>,
        });
      }

      setFormData({
        productName: "",
        productDescription: "",
        quantityInStock: 1,
        isActive: true,
        imageUrl: "",
        price: 1,
        category: "",
      });
      setIsNameAvailable(null);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNumberInput = (value: string, key: string) => {
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue) && parsedValue >= 1) {
      setFormData({ ...formData, [key]: parsedValue });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setFormData({
          productName: "",
          productDescription: "",
          quantityInStock: 1,
          isActive: true,
          imageUrl: "",
          price: 1,
          category: "",
        });
        onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName">Nombre del producto</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => {
                setFormData({ ...formData, productName: e.target.value });
                onChangeProductName(e);
              }}
              required
            />
            {isNameAvailable !== null && (
              <h1 className={`${isNameAvailable ? "text-green-500" : "text-red-500"}`}>
                {isNameAvailable ? "Nombre disponible." : "Nombre no disponible."}
              </h1>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDescription">Descripción</Label>
            <Textarea
              id="productDescription"
              value={formData.productDescription}
              onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.categoryId} value={category.categoryName}>
                      {category.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantityInStock">Stock inicial</Label>
              <Input
                id="quantityInStock"
                type="number"
                min="1"
                value={formData.quantityInStock}
                onChange={(e) => handleNumberInput(e.target.value, "quantityInStock")}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={(e) => handleNumberInput(e.target.value, "price")}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Producto activo</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {product ? "Guardar cambios" : "Crear producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
