"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { CartDropdown } from "./cart-dropdown";

export function CartButton() {
  const { dispatch } = useCart();

  const itemCount =
    typeof window !== "undefined"
      ? globalThis.komerza?.getBasketItemCount?.() ?? 0
      : 0;

  return (
    <div className="relative">
      <Button
        onClick={() => dispatch({ type: "TOGGLE_CART" })}
        className="group relative glass border border-white/10 hover:border-accent/30 text-white hover:bg-white/10 h-10 w-10 md:w-auto md:px-4 p-0 rounded-xl flex items-center justify-center md:gap-2.5 text-sm font-semibold transition-all duration-300"
      >
        {/* Hover gradient effect with overflow clipping */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden"></div>

        <ShoppingCart className="w-4.5 h-4.5 relative z-10 group-hover:text-accent transition-colors" />
        <span className="hidden md:inline relative z-10 group-hover:text-white transition-colors">
          Cart
        </span>
      </Button>

      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-accent to-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg ring-2 ring-black/50  z-20">
          {itemCount}
        </span>
      )}

      <CartDropdown />
    </div>
  );
}
