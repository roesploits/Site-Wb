"use client"

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"

interface BasketItem {
  productId: string
  variantId: string
  quantity: number
}

interface CartState {
  items: BasketItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "SET_ITEMS"; payload: BasketItem[] }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload }
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }
    case "OPEN_CART":
      return { ...state, isOpen: true }
    case "CLOSE_CART":
      return { ...state, isOpen: false }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  const refreshItems = () => {
    if (typeof (globalThis as any).komerza === "undefined") return;
    const items = (globalThis as any).komerza.getBasket()
    dispatch({ type: "SET_ITEMS", payload: items })
  }

  useEffect(() => {
    const interval = setInterval(() => {
       if (typeof (globalThis as any).komerza !== "undefined") {
           refreshItems();
           clearInterval(interval);
       }
    }, 500);
    return () => clearInterval(interval);
  }, [])

  const addItem = (productId: string, variantId: string, quantity: number) => {
    if (typeof (globalThis as any).komerza === "undefined") return;
    (globalThis as any).komerza.addToBasket(productId, variantId, quantity);
    refreshItems()
  }

  const removeItem = (productId: string, variantId: string) => {
    if (typeof (globalThis as any).komerza === "undefined") return;
    (globalThis as any).komerza.removeFromBasket(productId, variantId);
    refreshItems();
  };

  const updateQuantity = (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    if (typeof (globalThis as any).komerza === "undefined") return;
    // Remove the item first, then add it back with the new quantity
    (globalThis as any).komerza.removeFromBasket(productId, variantId);
    if (quantity > 0) {
      (globalThis as any).komerza.addToBasket(productId, variantId, quantity);
    }
    refreshItems();
  };

  const clearCart = () => {
    if (typeof (globalThis as any).komerza === "undefined") return;
    (globalThis as any).komerza.clearBasket()
    refreshItems()
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return ctx
}
