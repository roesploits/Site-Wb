"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, X, Mail } from "lucide-react";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  couponCode = undefined,
}: CheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const waitForKomerza = async (maxAttempts = 50) => {
    for (let i = 0; i < maxAttempts; i++) {
      if (
        (globalThis as any).komerza &&
        typeof (globalThis as any).komerza.checkout === "function"
      ) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return false;
  };

  const processCheckout = async () => {
    if (!email.trim()) {
      toast.error("Email Required", {
        description: "Please enter your email address to continue.",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Wait for komerza API to be available
      const isReady = await waitForKomerza();

      if (!isReady) {
        throw new Error(
          "Komerza API failed to load. Please refresh the page and try again."
        );
      }

      if (!couponCode) {
        couponCode = undefined;
      }

      const result = await (globalThis as any).komerza.checkout(
        email.trim(),
        couponCode?.trim()
      );

      if (result.success) {
        console.log("Checkout result:", result);

        setIsCheckingOut(false);
        setIsRedirecting(true);
        setCheckoutUrl(result.url || null);

        // Auto-redirect after 2 seconds if URL is available
        if (result.url) {
          setTimeout(() => {
            window.location.href = result.url;
          }, 2000);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout Failed", {
        description: `Unable to start checkout: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
      setIsCheckingOut(false);
    }
  };

  const handleManualRedirect = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const handleClose = () => {
    if (!isCheckingOut) {
      onClose();
      setEmail("");
      setCheckoutUrl(null);
      setIsRedirecting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-[#0f0f14] border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header with gradient accent */}
        <div className="relative bg-gradient-to-r from-[#46CBF8]/10 to-transparent border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#46CBF8]/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#46CBF8]" />
              </div>
              <h3 className="text-white text-xl font-bold">
                {isRedirecting ? "Redirecting..." : "Checkout"}
              </h3>
            </div>
            <Button
              onClick={handleClose}
              disabled={isCheckingOut}
              className="bg-white/5 hover:bg-white/10 text-white h-9 w-9 p-0 rounded-lg transition-all duration-300 outline-none focus:outline-none focus:ring-2 focus:ring-[#46CBF8]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {isRedirecting ? (
            // Redirecting State
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#46CBF8]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-[#46CBF8] border-t-transparent rounded-full animate-spin" />
              </div>
              <h4 className="text-white text-xl font-bold mb-3">
                Taking you to payment
              </h4>
              <p className="text-white/60 text-sm mb-8 max-w-xs mx-auto">
                You'll be redirected automatically in a few seconds...
              </p>
              {checkoutUrl && (
                <>
                  <Button
                    onClick={handleManualRedirect}
                    className="bg-[#46CBF8] hover:bg-[#46CBF8]/90 text-white h-12 px-8 rounded-xl font-semibold transition-all duration-300 outline-none focus:outline-none focus:ring-2 focus:ring-[#46CBF8]/50 shadow-lg shadow-[#46CBF8]/20 mb-4"
                  >
                    Continue Manually
                  </Button>
                  <p className="text-white/40 text-xs">
                    Not being redirected?{" "}
                    <a
                      href={checkoutUrl}
                      className="text-[#46CBF8] hover:text-[#46CBF8]/80 underline transition-colors"
                    >
                      Click here
                    </a>
                  </p>
                </>
              )}
            </div>
          ) : (
            // Email Input State
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <Mail className="text-white/40 w-5 h-5 transition-colors duration-200 group-focus-within:text-[#46CBF8]" />
                    </div>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="pl-12 pr-4 bg-white/5 border-2 border-white/10 text-white placeholder:text-white/30 h-14 rounded-xl focus:border-[#46CBF8] focus:bg-white/10 transition-all duration-200 outline-none focus:outline-none text-base font-medium hover:border-white/20 focus:ring-0 ring-0"
                      onKeyDown={(e) => e.key === "Enter" && processCheckout()}
                      autoFocus
                      disabled={isCheckingOut}
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2 ml-1">
                    We'll send your receipt and product access here
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleClose}
                    disabled={isCheckingOut}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white h-12 rounded-xl font-semibold transition-all duration-300 outline-none focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={processCheckout}
                    disabled={isCheckingOut || !email.trim()}
                    className="flex-1 bg-[#46CBF8] hover:bg-[#46CBF8]/90 text-white h-12 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 outline-none focus:outline-none focus:ring-2 focus:ring-[#46CBF8]/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#46CBF8]/20"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Continue to Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
