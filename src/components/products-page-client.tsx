"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, ShoppingBasket, Search, X } from "lucide-react";
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

export function ProductsPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Category definitions based on product names
  const getProductCategory = (product: Product): string => {
    const name = product.name.toLowerCase();

    // Executors (includes Codex Android and Arceus X V5)
    if (
      name.includes("executor") ||
      name.includes("codex android") ||
      name.includes("arceus x")
    ) {
      return "executors";
    }
    // Externals
    if (name.includes("external")) {
      return "externals";
    }
    // Accounts
    if (name.includes("account")) {
      return "accounts";
    }
    // Scripts
    if (
      name.includes("space hub") ||
      name.includes("flow script") ||
      name.includes("era hub") ||
      name.includes("lycoris") ||
      name.includes("nexonix") ||
      name.includes("alchemy") ||
      name.includes("arox")
    ) {
      return "scripts";
    }

    return "other";
  };

  useEffect(() => {
    async function load() {
      const res = await (globalThis as any).komerza.getStore();
      formatter = await (globalThis as any).komerza.createFormatter();

      if (res.success && res.data) {
        const mapped: Product[] = res.data.products.map((p: any) => {
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
        const publicProducts = mapped.filter((p) => p.visibility !== 1);

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

        setProducts(sortedProducts);
      }
    }
    load();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" || product.type === selectedType;

      const matchesCategory =
        selectedCategory === "all" ||
        getProductCategory(product) === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "popular":
        default:
          {
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

            const priorityA = getPriority(a.name);
            const priorityB = getPriority(b.name);

            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }
            return a.order - b.order;
          }
      }
    });

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-theme-secondary text-lg">
            Loading premium tools...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="heading-display text-4xl sm:text-5xl text-theme-primary">
            Store <span className="text-accent">Catalog</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-xl">
            Discover premium tools to elevate your gameplay.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white/5 border-white/10 text-theme-primary placeholder:text-theme-secondary/50 focus:border-accent focus:ring-accent rounded-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-secondary hover:text-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters & Controls */}
      <div
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {["all", "executors", "externals", "scripts", "accounts"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-theme-secondary hover:text-white hover:bg-white/5"
                }`}
              >
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex gap-3 w-full lg:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 px-3 bg-black/20 border border-white/10 rounded-lg text-sm text-theme-secondary focus:text-theme-primary focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none cursor-pointer hover:bg-black/30"
          >
            <option value="all">All Types</option>
            <option value="subscription">Subscription</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 bg-black/20 border border-white/10 rounded-lg text-sm text-theme-secondary focus:text-theme-primary focus:border-accent focus:ring-1 focus:ring-accent transition-colors outline-none cursor-pointer hover:bg-black/30"
          >
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(searchQuery ||
        selectedType !== "all" ||
        selectedCategory !== "all") && (
        <div
          className="flex items-center gap-2 flex-wrap animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-sm text-theme-secondary">Active filters:</span>
          {searchQuery && (
            <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 hover:bg-accent/20 transition-colors">
              Search: "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 hover:bg-accent/20 transition-colors">
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-2 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 hover:bg-accent/20 transition-colors">
              {selectedType === "one-time" ? "One-Time" : "Subscription"}
              <button
                onClick={() => setSelectedType("all")}
                className="ml-2 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("all");
              setSelectedCategory("all");
            }}
            className="h-7 px-3 text-xs text-theme-secondary hover:text-white hover:bg-white/5"
          >
            Clear All
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-theme-secondary text-sm">
          Showing {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "result" : "results"}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {filteredProducts.map((p) => (
            <div key={p.id} className="group h-full">
              <Link
                to={`/product?id=${encodeURIComponent(p.slug)}`}
                className="h-full block"
              >
                <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-1 h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {p.type === "subscription" && (
                        <Badge className="bg-purple-500/90 text-white border-0 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider shadow-lg backdrop-blur-sm">
                          Sub
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-sm text-white/50 line-clamp-2 h-10">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                          Price
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-white">
                            {formatter.format(p.price)}
                          </span>
                          {p.type === "subscription" && (
                            <span className="text-xs text-white/40">/mo</span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="bg-white/10 hover:bg-accent text-white border border-white/5 hover:border-accent/50 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/20"
                      >
                        <ShoppingBasket className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 border border-white/10 text-center animate-fade-in-up">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold text-theme-primary">
              No products found
            </h3>
            <p className="text-theme-secondary">
              Try adjusting your search or filter criteria to find what you're
              looking for.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setSortBy("popular");
                setSelectedCategory("all");
              }}
              className="bg-accent hover:bg-accent-600 text-white px-6 h-11 rounded-lg font-semibold"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
