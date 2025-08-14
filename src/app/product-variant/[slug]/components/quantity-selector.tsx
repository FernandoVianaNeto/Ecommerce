"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const QuantitySelector = () => {
    const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <h1>Quantity</h1>
      <div className="flex w-[100px] items-center border justify-between rounded-lg">
        <Button variant="outline" size="icon" onClick={() => setQuantity((prev) => prev > 0 ? prev - 1 : prev)}>
          <Minus />
        </Button>
        <span>{quantity}</span>
        <Button variant="outline" size="icon" onClick={() => setQuantity((prev) => prev + 1)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;