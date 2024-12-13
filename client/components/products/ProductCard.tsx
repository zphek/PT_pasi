import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import StockManager from './StockManager';


const ProductCard = ({ product, onEdit, onDelete, onUpdateStock }:any) => {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{product.productName}</CardTitle>
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <Badge variant="outline">{product.category}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {product.imageUrl && (
          <div className="w-full aspect-square relative overflow-hidden rounded-md">
            <img 
              src={product.imageUrl} 
              alt={product.productName}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <p className="text-sm text-gray-600">{product.productDescription}</p>
        
        <StockManager
          currentStock={product.quantityInStock}
          onUpdate={(newStock:any) => onUpdateStock(product.productId, newStock)}
        />
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(product.productId)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;