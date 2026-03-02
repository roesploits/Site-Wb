"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Plus,
  Minus,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutModal } from "./checkout-modal";
import { toast } from "sonner";
import { useFormatter } from "@/lib/formatter";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  stockMode: number; // 0 = Calculated, 1 = Ignored, 2 = Fixed
  minimumQuantity?: number;
  maximumQuantity?: number;
}

interface Product {
  id: string;
  name: string;
  game: string;
  basePrice: number;
  variants: ProductVariant[];
  image: string;
}

interface ProductActionsProps {
  product: Product;
  onPriceChange: (price: number) => void;
}

const isVariantInStock = (variant: ProductVariant) => {
  switch (variant.stockMode) {
    case 0: // Calculated
    case 2: // Fixed
      return variant.stock > 0;
    case 1: // Ignored
      return true; // Always available if stock is ignored
    default:
      return true;
  }
};

export function ProductActions({
  product,
  onPriceChange,
}: ProductActionsProps) {
  const { formatPrice } = useFormatter();
  // Ensure variants exist and are valid
  const variants =
    product.variants && product.variants.length > 0 ? product.variants : [];

  if (variants.length === 0) {
    return null;
  }

  const [selectedVariant, setSelectedVariant] = useState(() => {
    const firstInStock = variants.find((v) => isVariantInStock(v));
    return firstInStock || variants[0];
  });
  const [quantity, setQuantity] = useState(selectedVariant.minimumQuantity || 1);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { dispatch, addItem } = useCart();

  // Stock calculation helpers
  const getStockDisplay = (variant: ProductVariant) => {
    switch (variant.stockMode) {
      case 0: // Calculated
        return variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock";
      case 1: // Ignored
        return "Always available"; // Show this instead of null
      case 2: // Fixed
        return variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock";
      default:
        return "Always available";
    }
  };

  const getMaxQuantity = (variant: ProductVariant) => {
    const definedMax = variant.maximumQuantity ?? 999;
    
    switch (variant.stockMode) {
      case 0: // Calculated
      case 2: // Fixed
        return Math.min(variant.stock, definedMax);
      case 1: // Ignored
        return definedMax; // No limit if stock is ignored
      default:
        return definedMax;
    }
  };

  const getStockStatusColor = (variant: ProductVariant) => {
    if (variant.stockMode === 1) return "bg-gray-400"; // Gray for ignored stock

    const stock = variant.stock;
    if (stock === 0) return "bg-red-500";
    if (stock <= 5) return "bg-orange-500";
    return "bg-green-500";
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // Reset quantity based on min/max limits
    const maxQty = getMaxQuantity(variant);
    const minQty = variant.minimumQuantity || 1;

    // Determine effective max. If maxQty is 0 (out of stock), we still want to show at least minQty
    const effectiveMax = Math.max(minQty, maxQty);

    // Clamp
    const newQuantity = Math.max(minQty, Math.min(quantity, effectiveMax));

    setQuantity(newQuantity);
    onPriceChange(variant.price * newQuantity);
  };

  const handleQuantityChange = (newQuantity: number, clamp: boolean = true) => {
    const maxQty = getMaxQuantity(selectedVariant);
    const minQty = selectedVariant.minimumQuantity || 1;
    const effectiveMax = Math.max(minQty, maxQty);

    let finalQuantity = newQuantity;
    if (clamp) {
      finalQuantity = Math.max(minQty, Math.min(newQuantity, effectiveMax));
    }

    setQuantity(finalQuantity);
    onPriceChange(selectedVariant.price * finalQuantity);
  };

  const handleAddToCart = () => {
    if (!isVariantInStock(selectedVariant)) {
      toast.error("Out of Stock", {
        description: "This variant is currently out of stock",
      });
      return;
    }

    addItem(product.id, selectedVariant.id, quantity);

    dispatch({ type: "OPEN_CART" });
  };

  const handleBuyNow = async () => {
    if (!isVariantInStock(selectedVariant)) {
      toast.error("Out of Stock", {
        description: "This variant is currently out of stock",
      });
      return;
    }

    addItem(product.id, selectedVariant.id, quantity);
    setShowCheckoutModal(true);
  };

  const currentMaxQuantity = getMaxQuantity(selectedVariant);
  const isOutOfStock = !isVariantInStock(selectedVariant);
  const isBulkProduct = product.name.toLowerCase().includes("account");

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium tracking-20-smaller">
              Choose variant
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 tracking-20-smaller">
                Qty:
              </span>
              <div className={`flex items-center ${isBulkProduct ? "gap-0 bg-white/5 border border-white/10 rounded-lg overflow-hidden" : "gap-2"}`}>
                <Button
                  onClick={() =>
                    handleQuantityChange(
                      Math.max(selectedVariant.minimumQuantity || 1, quantity - 1)
                    )
                  }
                  disabled={
                    isOutOfStock ||
                    quantity <= (selectedVariant.minimumQuantity || 1)
                  }
                  className={`${isBulkProduct 
                    ? "h-10 w-10 rounded-none border-r border-white/10 hover:bg-white/5" 
                    : "bg-transparent border border-white/20 hover:bg-white/10 rounded-md h-8 w-8"
                  } bg-transparent text-gray-900 dark:text-white font-semibold p-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                {isBulkProduct ? (
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) handleQuantityChange(val, false);
                      else handleQuantityChange(0, false);
                    }}
                    onBlur={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val)) val = selectedVariant.minimumQuantity || 1;
                      handleQuantityChange(val, true);
                    }}
                    className="w-16 h-10 bg-transparent text-center text-gray-900 dark:text-white font-medium text-sm border-none focus:ring-0 appearance-none m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min={selectedVariant.minimumQuantity || 1}
                    max={currentMaxQuantity}
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 text-gray-900 dark:text-white font-medium text-sm">
                    {quantity}
                  </div>
                )}

                <Button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={isOutOfStock || quantity >= currentMaxQuantity}
                  className={`${isBulkProduct 
                    ? "h-10 w-10 rounded-none border-l border-white/10 hover:bg-white/5" 
                    : "bg-transparent border border-white/20 hover:bg-white/10 rounded-md h-8 w-8"
                  } bg-transparent text-gray-900 dark:text-white font-semibold p-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                onClick={() =>
                  isVariantInStock(variant) && handleVariantChange(variant)
                }
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedVariant.id === variant.id
                    ? "border-primary bg-primary/10"
                    : isVariantInStock(variant)
                    ? "border-white/10 bg-white/5 hover:border-white/20"
                    : "border-white/10 bg-white/5 opacity-60 cursor-not-allowed pointer-events-none"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-900 dark:text-white heading-semibold">
                      {variant.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getStockStatusColor(
                          variant
                        )}`}
                      ></div>
                      <p className="text-gray-400 text-sm">
                        {getStockDisplay(variant)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold text-lg">
                      {formatPrice(variant.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`flex-1 md:flex-[0.7] h-8 px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm tracking-20-smaller transition-all duration-300 whitespace-nowrap ${
              isOutOfStock
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-600"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{isOutOfStock ? "Out of Stock" : "Buy Now"}</span>
          </Button>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 md:flex-[0.3] h-8 px-4 py-2 rounded-md border border-white/20 shadow-lg flex items-center justify-center gap-2 text-sm tracking-20-smaller transition-all duration-300 whitespace-nowrap ${
              isOutOfStock
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="inline">
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </span>
          </Button>
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        couponCode=""
      />
    </>
  );
}
