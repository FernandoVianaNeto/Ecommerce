import { Button } from "../ui/button";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { ShoppingBasketIcon } from "lucide-react";

const Cart = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
    </Sheet>
  );
};

export default Cart;