import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Plus, Minus } from 'lucide-react';

const StockManager = ({ currentStock, onUpdate }:any) => {
  const [stock, setStock] = useState(currentStock);
  
  const handleUpdate = (newValue:any) => {
    setStock(newValue);
    onUpdate(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleUpdate(Math.max(0, stock - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="flex-1">
          <Input
            type="number"
            value={stock}
            onChange={(e) => handleUpdate(parseInt(e.target.value) || 0)}
            className="text-center"
            min="0"
          />
        </div>

        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleUpdate(stock + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Slider
        value={[stock]}
        max={100}
        step={1}
        onValueChange={([value]:any) => handleUpdate(value)}
        className="py-4"
      />
    </div>
  );
};

export default StockManager;