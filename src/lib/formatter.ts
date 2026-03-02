/**
 * Centralized formatter utility for currency formatting using Komerza API
 */

import { useState, useEffect } from "react";

let cachedFormatter: Intl.NumberFormat | null = null;
let formatterPromise: Promise<Intl.NumberFormat> | null = null;

/**
 * Gets the Komerza formatter, with caching to avoid repeated API calls
 */
export async function getKomerzaFormatter(): Promise<Intl.NumberFormat> {
  // Return cached formatter if available
  if (cachedFormatter) {
    return cachedFormatter;
  }

  // Return existing promise if already fetching
  if (formatterPromise) {
    return formatterPromise;
  }

  // Create new promise to fetch formatter
  formatterPromise = (async () => {
    try {
      const api = (globalThis as any).komerza;
      const kFormatter = await api?.createFormatter?.();

      if (kFormatter) {
        cachedFormatter = kFormatter;
        return kFormatter;
      }
    } catch (error) {
      console.warn("Failed to fetch Komerza formatter:", error);
    }

    // Fallback formatter
    const fallbackFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    cachedFormatter = fallbackFormatter;
    return fallbackFormatter;
  })();

  return formatterPromise;
}

/**
 * Formats a price using the Komerza formatter with fallback
 */
export async function formatPrice(amount: number): Promise<string> {
  try {
    const formatter = await getKomerzaFormatter();
    return formatter.format(amount);
  } catch {
    // Emergency fallback if everything fails
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Synchronous price formatting with cached formatter
 * Falls back to basic formatting if formatter not ready
 */
export function formatPriceSync(amount: number): string {
  if (cachedFormatter) {
    return cachedFormatter.format(amount);
  }
  // Fallback while formatter is loading
  return `$${amount.toFixed(2)}`;
}

/**
 * Hook for React components to use the formatter
 */
export function useFormatter() {
  const [formatter, setFormatter] = useState<Intl.NumberFormat | null>(
    cachedFormatter
  );

  useEffect(() => {
    if (!formatter) {
      getKomerzaFormatter().then(setFormatter);
    }
  }, [formatter]);

  const formatPrice = (amount: number) => {
    return formatter ? formatter.format(amount) : `$${amount.toFixed(2)}`;
  };

  return { formatter, formatPrice, isReady: !!formatter };
}
