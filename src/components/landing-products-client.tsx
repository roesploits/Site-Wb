"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Star } from "lucide-react";
import { stripMarkdown } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  variantCount: number;
  visibility: number; // 0 = public, 1 = unlisted
  order: number;
}

let formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function LandingProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const res = await (globalThis as any).komerza.getStore();
      formatter = await (globalThis as any).komerza.createFormatter();

      if (res.success && res.data) {
        const allProducts: Product[] = res.data.products.map((p: any) => {
          // Get the lowest price from all variants
          const lowestPrice =
            p.variants?.length > 0
              ? Math.min(...p.variants.map((v: any) => v.cost || 0))
              : 0;

          return {
            id: p.id,
            slug: p.slug ?? p.id,
            name: p.name,
            description: stripMarkdown(p.description || ""),
            price: lowestPrice,
            image: p.imageNames[0]
              ? `https://user-generated-content.komerza.com/${p.imageNames[0]}`
              : "/product-placeholder.png",
            type: p.isSubscription ? "subscription" : "one-time",
            variantCount: p.variants?.length || 0,
            visibility: p.visibility ?? 0, // Default to public if not specified
            order: p.order ?? Number.MAX_SAFE_INTEGER, // Default to end if no order specified
          };
        });

        // Filter out unlisted products (visibility === 1)
        const publicProducts = allProducts.filter((p) => p.visibility !== 1);

        // Custom sort order
        const customOrder = [
          "Wave",
          "Volcano",
          "Matcha",
          "Zenith",
          "Clove",
          "Fisch C$ Price for 1M",
        ];

        const getPriority = (name: string) => {
          const lowerName = name.toLowerCase();
          const index = customOrder.findIndex((key) =>
            lowerName.includes(key.toLowerCase())
          );
          return index === -1 ? 999 : index;
        };

        // Sort products by custom order
        const sortedProducts = publicProducts.sort((a, b) => {
          const priorityA = getPriority(a.name);
          const priorityB = getPriority(b.name);
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          return a.order - b.order;
        });

        // Display all products in sorted order
        setProducts(sortedProducts);
      }
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {products.map((p) => (
        <div key={p.id} className="w-full">
          <Link to={`/product?id=${encodeURIComponent(p.slug)}`}>
            <div className="group relative w-full rounded-2xl glass border border-white/10 hover:border-accent/30 p-3 transition-all duration-300 flex flex-col h-full hover-lift">
              {/* Product Image */}
              <div className="relative w-full aspect-video cursor-pointer overflow-hidden rounded-xl mb-4">
                <img
                  alt={p.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  src={p.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badge */}
                <div className="absolute top-3 right-3">
                  {p.type === "subscription" && (
                    <Badge className="bg-accent text-white border-0 text-xs font-semibold px-2 py-1">
                      Subscribe
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col gap-3 px-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-theme-primary line-clamp-2 flex-1">
                    {p.name}
                  </h3>
                  <Star className="w-4 h-4 text-accent fill-accent flex-shrink-0 mt-1" />
                </div>

                <p className="text-theme-secondary text-sm line-clamp-2 flex-grow">
                  {p.description}
                </p>

                {/* Price & CTA */}
                <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-baseline gap-2">
                    {p.variantCount > 1 ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-theme-secondary uppercase tracking-wide">
                          Starting at
                        </span>
                        <span className="text-2xl font-bold text-accent">
                          {formatter.format(p.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-accent">
                        {formatter.format(p.price)}
                      </span>
                    )}
                    {p.type === "subscription" && p.variantCount <= 1 && (
                      <span className="text-xs text-theme-secondary">
                        /month
                      </span>
                    )}
                  </div>

                  <Button className="w-full h-10 rounded-lg bg-accent hover:bg-accent-600 text-white font-semibold text-sm transition-all duration-300 glow-accent-sm">
                    <ShoppingBasket className="w-4 h-4 mr-2" />
                    <span>
                      {p.type === "subscription" ? "Subscribe" : "Buy Now"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
