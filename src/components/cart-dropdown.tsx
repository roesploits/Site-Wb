"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Tag,
  X,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { CheckoutModal } from "./checkout-modal";
import { useFormatter } from "@/lib/formatter";

interface ProductInfo {
  id: string;
  name: string;
  variants: Array<{
    id: string;
    name: string;
    cost: number;
  }>;
}

export function CartDropdown() {
  const { state, dispatch, clearCart, removeItem, updateQuantity } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [productsInfo, setProductsInfo] = useState<Record<string, ProductInfo>>(
    {}
  );
  const { formatPrice } = useFormatter();

  // Handle scroll locking with useLayoutEffect to prevent visual jumps
  useLayoutEffect(() => {
    if (state.isOpen) {
      const originalScrollY = window.scrollY;
      const originalBodyStyle = {
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
      };

      // Lock scroll immediately
      document.body.style.position = "fixed";
      document.body.style.top = `-${originalScrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore original styles
        document.body.style.position = originalBodyStyle.position;
        document.body.style.top = originalBodyStyle.top;
        document.body.style.width = originalBodyStyle.width;
        document.body.style.overflow = originalBodyStyle.overflow;

        // Restore scroll position
        window.scrollTo(0, originalScrollY);
      };
    }
  }, [state.isOpen]);

  // Fetch product info when cart opens
  useEffect(() => {
    if (!state.isOpen || state.items.length === 0) return;

    const fetchProductsInfo = async () => {
      try {
        const api = (globalThis as any).komerza;
        const store = await api?.getStore?.();
        if (store?.success && store.data?.products) {
          const productMap: Record<string, ProductInfo> = {};
          store.data.products.forEach((product: any) => {
            productMap[product.id] = {
              id: product.id,
              name: product.name,
              variants: product.variants || [],
            };
          });
          setProductsInfo(productMap);
        }
      } catch (error) {
        console.warn("Failed to fetch product info:", error);
      }
    };

    fetchProductsInfo();
  }, [state.isOpen, state.items.length]);

  // Helper to normalize cart item data
  const normalizeItem = (item: any) => {
    const productId = item.productId?.productId || item.productId;
    const variantId = item.variantId || item.productId?.variantId || "";
    const quantity = item.quantity || item.productId?.quantity || 1;
    return {
      productId: String(productId),
      variantId: String(variantId),
      quantity: Number(quantity),
    };
  };

  // Helper to calculate item price
  const getItemPrice = (productId: string, variantId: string) => {
    const product = productsInfo[productId];
    const variant = product?.variants.find((v) => v.id === variantId);
    return variant?.cost || 0;
  };

  // Calculate total
  const total = state.items.reduce((sum, item) => {
    const { productId, variantId, quantity } = normalizeItem(item);
    return sum + getItemPrice(productId, variantId) * quantity;
  }, 0);

  const handleCheckout = () => {
    if (state.items.length > 0) setShowCheckoutModal(true);
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {state.isOpen && createPortal(
        <>
          {/* Overlay with enhanced blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] cart-overlay-animate"
            onClick={() => dispatch({ type: "CLOSE_CART" })}
          />

          {/* Cart Panel with glassmorphism */}
          <div className="fixed top-0 right-0 bottom-0 h-screen w-full sm:w-[440px] bg-[#0f0f14] border-l border-white/10 shadow-2xl flex flex-col z-[9999] cart-slide-animate">
            {/* Header with gradient accent */}
            <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-accent/5 via-transparent to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-theme-primary text-xl heading-bold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-accent" />
                    Shopping Cart
                  </h2>
                  <p className="text-theme-secondary text-sm mt-1">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in cart
                  </p>
                </div>
                <button
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 text-theme-secondary hover:text-accent transition-all duration-300 flex items-center justify-center group"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-accent/50" />
                  </div>
                  <h3 className="text-theme-primary text-lg font-semibold mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-theme-secondary text-sm">
                    Add some premium tools to get started!
                  </p>
                </div>
              ) : (
                state.items.map((item, idx) => {
                  const { productId, variantId, quantity } =
                    normalizeItem(item);
                  const product = productsInfo[productId];
                  const variant = product?.variants.find(
                    (v) => v.id === variantId
                  );

                  const name = product?.name || `Product ${productId}`;
                  const variantName =
                    variant?.name ||
                    (variantId ? `Variant ${variantId}` : "Standard");
                  const price = variant?.cost || 0;
                  const itemTotal = price * quantity;

                  return (
                    <div
                      key={`${productId}-${variantId}-${idx}`}
                      className="group relative glass border border-white/5 hover:border-accent/20 rounded-xl p-4 space-y-4 transition-all duration-300 hover-lift"
                    >
                      {/* Gradient accent on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                      <div className="relative">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-theme-primary text-base font-bold mb-1 truncate">
                              {name}
                            </h4>
                            <p className="text-theme-secondary text-sm">
                              {variantName}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-accent text-lg font-bold">
                              {formatPrice(price)}
                            </p>
                            {quantity > 1 && (
                              <p className="text-theme-secondary text-xs mt-1">
                                {formatPrice(itemTotal)} total
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-theme-secondary text-sm font-medium">
                              Qty:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  quantity > 1 &&
                                  updateQuantity(
                                    productId,
                                    variantId,
                                    quantity - 1
                                  )
                                }
                                disabled={quantity <= 1}
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 text-theme-primary hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 transition-all duration-200 flex items-center justify-center"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-theme-primary text-sm font-bold min-w-[24px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    productId,
                                    variantId,
                                    quantity + 1
                                  )
                                }
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 text-theme-primary hover:text-accent transition-all duration-200 flex items-center justify-center"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(productId, variantId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-theme-secondary hover:text-red-400 transition-all duration-200 text-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with total and checkout */}
            {state.items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4 bg-gradient-to-t from-black/20 to-transparent">
                {/* Total */}
                <div className="glass rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-theme-secondary font-medium">
                      Subtotal
                    </span>
                    <span className="text-accent font-bold text-2xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-theme-primary text-sm font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-accent" />
                    Coupon Code
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter discount code"
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-lg text-theme-primary placeholder:text-theme-secondary/50 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 h-12 bg-accent hover:bg-accent-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 glow-accent-sm hover:glow-accent"
                  >
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </Button>
                  <Button
                    onClick={clearCart}
                    className="h-12 px-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-theme-secondary hover:text-theme-primary rounded-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        couponCode={couponCode}
      />
    </>
  );
}
