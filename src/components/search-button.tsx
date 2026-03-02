"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, ArrowRight, User, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Define Product interface to match the products page
interface Product {
  id: string;
  slug: string;
  name: string;
  game: string;
  category: string;
  basePrice: number;
  maxPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  status: string;
  popular: boolean;
}

let formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

const suggestedItems = [
  {
    id: "account",
    name: "Your account",
    description: "View your past orders here.",
    icon: User,
    href: "/dashboard",
  },
  {
    id: "support",
    name: "Support",
    description: "Get help and contact support.",
    icon: HelpCircle,
    href: "https://discord.gg/v9tv7SNCwp",
  },
];

export function SearchButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load products from the global store
  useEffect(() => {
    async function loadProducts() {
      if (typeof (globalThis as any).komerza === "undefined") return;
      try {
        setLoading(true);
        formatter = await (globalThis as any).komerza.createFormatter();
        const res = await (globalThis as any).komerza.getStore();
        if (res.success && res.data) {
          const mapped: Product[] = res.data.products.map((p: any) => {
            // Determine stock status based on the first variant
            const firstVariant = p.variants[0];
            let stockStatus = "In Stock";

            if (firstVariant) {
              switch (firstVariant.stockMode) {
                case 0: // Calculated
                case 2: // Fixed
                  stockStatus =
                    (firstVariant.stock || 0) > 0 ? "In Stock" : "Out of Stock";
                  break;
                case 1: // Ignored
                  stockStatus = "In Stock"; // Always available
                  break;
                default:
                  stockStatus = "In Stock";
              }
            }

            return {
              id: p.id,
              slug: p.slug ?? p.id,
              name: p.name,
              game: "Software",
              category: "software",
              basePrice: p.variants[0]?.cost || 0,
              maxPrice: p.variants[0]?.cost || 0,
              rating: p.rating || 4.5,
              reviews: Math.floor(Math.random() * 100) + 10,
              image: p.imageNames[0]
                ? `https://user-generated-content.komerza.com/${p.imageNames[0]}`
                : "/product-placeholder.png",
              description: p.description || "High-quality software solution",
              features: [],
              status: stockStatus,
              popular: p.isBestSeller || false,
            };
          });
          setProducts(mapped);
          // Initially show popular products
          setFilteredProducts(mapped.filter((p) => p.popular).slice(0, 3));
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load products:", error);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Check if mobile
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get all selectable items (products + suggested items)
  const allItems = [...filteredProducts.slice(0, 3), ...suggestedItems];

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && products.length > 0) {
      // Show popular products when opening search
      setFilteredProducts(products.filter((p) => p.popular).slice(0, 3));
    }
  };

  const closeSearch = () => {
    setIsExpanded(false);
    setSearchQuery("");
    // Reset to popular products
    if (products.length > 0) {
      setFilteredProducts(products.filter((p) => p.popular).slice(0, 3));
    }
    setSelectedIndex(-1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter products in real-time
    if (query.trim()) {
      const filtered = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3); // Limit to top 3 results
      setFilteredProducts(filtered);
    } else {
      // Show popular products when search is empty
      setFilteredProducts(products.filter((p) => p.popular).slice(0, 3));
    }
    setSelectedIndex(-1);
  };

  const handleKeyNavigation = (e: KeyboardEvent) => {
    if (!isExpanded) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allItems.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && allItems[selectedIndex]) {
          const selectedItem = allItems[selectedIndex];
          // Navigate to the selected item
          if (selectedItem.href) {
            navigate(selectedItem.href);
            closeSearch();
          }
        } else if (searchQuery.trim()) {
          // If no item selected but there's a search query, search all products
          handleSearch(e);
        }
        break;
    }
  };

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (!isExpanded) {
          setIsExpanded(true);
        }
      }

      // Escape to close search
      if (e.key === "Escape" && isExpanded) {
        closeSearch();
      }

      // Arrow navigation and Enter
      handleKeyNavigation(e);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, selectedIndex, allItems, searchQuery]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Button className="group glass border border-white/10 hover:border-accent/30 text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Search className="w-4.5 h-4.5 relative z-10 group-hover:text-accent transition-colors" />
      </Button>
    );
  }

  // Mobile Modal Search
  if (isMobile) {
    return (
      <>
        <Button
          onClick={toggleSearch}
          className="group glass border border-white/10 hover:border-accent/30 text-white hover:bg-white/10 h-10 w-10 p-0 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden"
        >
          {/* Hover gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Search className="w-4.5 h-4.5 relative z-10 group-hover:text-accent transition-colors" />
        </Button>

        {isExpanded &&
          createPortal(
            <>
              <div
                className="fixed top-16 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-lg z-50"
              onClick={closeSearch}
            />

            <div
              className={`fixed inset-4 top-20 bottom-auto bg-[#0f0f14] border border-white/20 rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300`}
            >
              <form
                onSubmit={handleSearch}
                className={`flex items-center gap-3 p-4 border-b border-white/10`}
              >
                <Search className={`w-5 h-5 text-accent flex-shrink-0`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search products..."
                  className={`flex-1 bg-transparent text-white placeholder:text-theme-secondary border-none outline-none text-base font-medium`}
                />
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent-600 text-white h-9 px-4 text-sm rounded-lg font-semibold glow-accent-sm"
                >
                  Search
                </Button>
                <Button
                  type="button"
                  onClick={closeSearch}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 h-9 w-9 p-0 rounded-lg transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>

              <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                {loading && (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className={`text-theme-secondary text-base`}>
                      Loading products...
                    </p>
                  </div>
                )}

                {!loading && filteredProducts.length > 0 && (
                  <div>
                    <h3
                      className={`text-xs font-bold text-theme-secondary uppercase tracking-wider mb-3`}
                    >
                      {searchQuery ? "Search Results" : "Popular Products"}
                    </h3>
                    <div className="space-y-2">
                      {filteredProducts.map((product, index) => (
                        <Link
                          key={product.id}
                          to={`/product?id=${encodeURIComponent(product.slug)}`}
                          onClick={closeSearch}
                          className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 min-h-[44px] border ${
                            selectedIndex === index
                              ? "bg-accent/10 border-accent/30"
                              : `hover:bg-white/5 border-white/5 hover:border-white/10`
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 group-hover:border-accent/30 flex items-center justify-center flex-shrink-0 overflow-hidden transition-colors">
                            <img
                              src={product.image || "/product-placeholder.png"}
                              alt={product.name}
                              width={28}
                              height={28}
                              className="w-7 h-7 object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-white text-base font-semibold truncate group-hover:text-white transition-colors`}
                            >
                              {product.name}
                            </h4>
                            <p
                              className={`text-theme-secondary text-sm truncate`}
                            >
                              {formatter.format(product.basePrice)} &bull;{" "}
                              {product.status}
                            </p>
                          </div>
                          <ArrowRight
                            className={`w-5 h-5 text-theme-secondary group-hover:text-accent flex-shrink-0 transition-colors`}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && searchQuery && filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-accent/50" />
                    </div>
                    <p className={`text-theme-secondary text-base mb-4`}>
                      No products found for "{searchQuery}"
                    </p>
                    <Button
                      onClick={handleSearch}
                      className="bg-accent hover:bg-accent-600 text-white h-10 px-5 text-sm rounded-lg font-semibold glow-accent-sm"
                    >
                      Search all products
                    </Button>
                  </div>
                )}

                {!loading && (
                  <div>
                    <h3
                      className={`text-xs font-bold text-theme-secondary uppercase tracking-wider mb-3`}
                    >
                      Quick Access
                    </h3>
                    <div className="space-y-2">
                      {suggestedItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const itemIndex = filteredProducts.length + index;
                        const isExternal = item.href.startsWith("http");
                        const className = `group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 min-h-[44px] border ${
                          selectedIndex === itemIndex
                            ? "bg-accent/10 border-accent/30"
                            : `hover:bg-white/5 border-white/5 hover:border-white/10`
                        }`;

                        const content = (
                          <>
                            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 group-hover:border-accent/40 flex items-center justify-center flex-shrink-0 transition-colors">
                              <IconComponent className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`text-white text-base font-semibold truncate`}
                              >
                                {item.name}
                              </h4>
                              <p
                                className={`text-theme-secondary text-sm truncate`}
                              >
                                {item.description}
                              </p>
                            </div>
                            <ArrowRight
                              className={`w-5 h-5 text-theme-secondary group-hover:text-accent flex-shrink-0 transition-colors`}
                            />
                          </>
                        );

                        if (isExternal) {
                          return (
                            <a
                              key={item.id}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={closeSearch}
                              className={className}
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={item.id}
                            to={item.href}
                            onClick={closeSearch}
                            className={className}
                          >
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
      </>
    );
  }

  // Desktop Search (existing implementation with updates)
  return (
    <div ref={containerRef} className="relative flex items-center">
      <div
        className="h-10 w-64 md:w-[240px] lg:w-[320px] glass border border-white/10 rounded-xl backdrop-blur-xl overflow-hidden shadow-lg bg-[#050505]/50"
      >
        <form onSubmit={handleSearch} className="h-full flex items-center w-full">
          <div className="flex items-center w-full h-full px-4">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsExpanded(true)}
              placeholder="Search our store..."
              className={`flex-1 bg-transparent text-white text-sm placeholder:text-theme-secondary/70 border-none outline-none min-w-0 font-medium`}
            />
            <Search className={`w-4 h-4 text-theme-secondary flex-shrink-0 ml-2 cursor-pointer hover:text-white transition-colors`} />
          </div>
        </form>
      </div>

      {isExpanded && (
        <div className="absolute top-12 right-0 w-64 md:w-[500px] rounded-xl shadow-2xl z-50 overflow-hidden border border-white/20 bg-[#0f0f14]">
          <div className="relative p-4 pb-0">
            <Button
              onClick={closeSearch}
              className="absolute top-3 right-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 h-7 w-7 p-0 rounded-lg transition-all duration-300 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="px-4 pb-4 space-y-4">
            {loading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className={`text-theme-secondary text-sm`}>
                  Loading products...
                </p>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div>
                <h3
                  className={`text-xs font-bold text-theme-secondary uppercase tracking-wider mb-3`}
                >
                  {searchQuery ? "Search Results" : "Popular Products"}
                </h3>
                <div className="space-y-2">
                  {filteredProducts.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/product?id=${encodeURIComponent(product.slug)}`}
                      onClick={closeSearch}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                        selectedIndex === index
                          ? "bg-primary/20 border border-primary-500/50"
                          : `hover:bg-gray-800 border border-transparent`
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={product.image || "/product-placeholder.png"}
                          alt={product.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-gray-50 text-sm font-medium truncate`}
                        >
                          {product.name}
                        </h4>
                        <p className={`text-gray-300 text-xs truncate`}>
                          {formatter.format(product.basePrice)} &bull;{" "}
                          {product.status}
                        </p>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 text-gray-300 group-hover:text-gray-50 transition-colors duration-200 flex-shrink-0`}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && searchQuery && filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className={`text-gray-300 text-sm mb-4`}>
                  No products found for "{searchQuery}"
                </p>
                <Button
                  onClick={handleSearch}
                  className="bg-primary text-white hover:bg-primary-600 h-6 px-3 text-xs rounded-md"
                >
                  Search all products
                </Button>
              </div>
            )}

            {!loading && (
              <div>
                <h3
                  className={`text-xs font-medium text-gray-300 uppercase tracking-wider mb-3`}
                >
                  Quick Access
                </h3>
                <div className="space-y-2">
                  {suggestedItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const itemIndex = filteredProducts.length + index;
                    const isExternal = item.href.startsWith("http");
                    const className = `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                      selectedIndex === itemIndex
                        ? "bg-primary/20 border border-primary-500/50"
                        : `hover:bg-gray-800 border border-transparent`
                    }`;

                    const content = (
                      <>
                        <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-gray-50 text-sm font-medium truncate`}
                          >
                            {item.name}
                          </h4>
                          <p className={`text-gray-300 text-xs truncate`}>
                            {item.description}
                          </p>
                        </div>
                        <ArrowRight
                          className={`w-4 h-4 text-gray-300 group-hover:text-gray-50 transition-colors duration-200 flex-shrink-0`}
                        />
                      </>
                    );

                    if (isExternal) {
                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeSearch}
                          className={className}
                        >
                          {content}
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        onClick={closeSearch}
                        className={className}
                      >
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
