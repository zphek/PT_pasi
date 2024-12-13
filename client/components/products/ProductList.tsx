'use client'

import React, { useEffect, useState } from 'react';
import ProductFilters from './ProductFilters';
import ProductForm from './ProductForm';
import { Button } from '@/components/ui/button';
import { Plus, ChevronUp, ChevronDown, Edit, Trash2, Package, AlertCircle } from 'lucide-react';
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
import { deleteProduct } from '@/utilites/ProductRequests';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import toast, { Toaster } from 'react-hot-toast';
  

const ProductList = ({ products: initialProducts, categories, changePage, pagination }: any) => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [animatingProduct, setAnimatingProduct] = useState<string | null>(null);

  const filteredProducts = products.filter((product: any) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  console.log(pagination);

  useEffect(()=>{
    setProducts(initialProducts);
  }, [initialProducts])

  const handleUpdateStock = async (productId: string, increment: number) => {
    setAnimatingProduct(productId);
    
    setProducts(products.map((product: any) =>
      product.productId === productId
        ? { ...product, quantityInStock: Math.max(0, product.quantityInStock + increment) }
        : product
    ));

    // Esperar a que termine la animación
    setTimeout(() => {
      setAnimatingProduct(null);
    }, 500);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (productId: any) => {
    setProducts(products.filter((p: any) => p.productId !== productId));
  };

  const handleSubmit = (formData: any) => {
    if (editingProduct) {
      setProducts(products.map((p: any) =>
        p.productId === editingProduct.productId ? { ...formData, productId: p.productId } : p
      ));
    } else {
      setProducts([...products, { ...formData, productId: Date.now().toString() }]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const [deletingProduct, setDeletingProduct] = useState<any>(null);

  // Modificar handleDelete para la confirmación
  const handleDeleteClick = (product: any) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
        toast.promise(
            deleteProduct(deletingProduct.productId)
            .then((response)=>{
                console.log(response);
                setProducts(products.filter((p: any) => p.productId !== deletingProduct.productId));
                setDeletingProduct(null);
            }),      
            {
              loading: "Intentando iniciar sesion...",
              success: <b>Haz iniciado sesion!</b>,
              error: <b>Credenciales incorrectos.</b>
            }
        )

      deleteProduct(deletingProduct.productId)
      .then(()=>{
        setProducts(products.filter((p: any) => p.productId !== deletingProduct.productId));
        setDeletingProduct(null);
      })
    }
  };


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearFilters={() => {
          setSelectedCategory('');
          setSearchTerm('');
        }}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product: any) => (
              <TableRow key={product.productId}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-bold">{product.productName}</div>
                      <div className="text-sm text-gray-500">{product.productDescription}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateStock(product.productId, -1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <div className="relative w-20 text-center">
                      <div
                        className={cn(
                          "transition-all duration-500",
                          animatingProduct === product.productId ? "scale-110 text-primary" : ""
                        )}
                      >
                        <Package className="h-4 w-4 inline-block mr-1" />
                        {product.quantityInStock}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateStock(product.productId, 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteClick(product)}
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

      <ProductForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
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



      <AlertDialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto 
              "{deletingProduct?.productName}" y toda su información asociada.
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

      <Toaster/>
    </div>
  );
};

export default ProductList;