import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Heart, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      if (typeof (globalThis as any).komerza === "undefined") return;
      try {
        const res = await (globalThis as any).komerza.getStore();
        if (res.success && res.data && res.data.products) {
          // Filter out Fisch C$ and take 4
          const filtered = res.data.products.filter(
            (p: any) => !p.name.toLowerCase().includes("fisch c$")
          );
          setProducts(filtered.slice(0, 4));
        }
      } catch (e) {
        console.warn("Failed to fetch footer products:", e);
      }
    }
    
    // Slight delay to ensure komerza is loaded
    const timer = setTimeout(fetchProducts, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="relative border-t border-white/10 bg-[#050505] pt-16 pb-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(var(--accent-rgb),0.05),transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                RO<span className="text-accent">ESPLOITS</span>
              </span>
            </Link>
            <p className="text-theme-secondary text-sm leading-relaxed">
              The largest and most trusted Roblox software marketplace. Safe
              injectors, stable scripts, and instant delivery.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://discord.gg/v9tv7SNCwp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-theme-secondary hover:text-white hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.419 13.419 0 0 0-.972 1.996 18.313 18.313 0 0 0-5.614 0 13.422 13.422 0 0 0-.976-1.996.073.073 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-theme-secondary hover:text-accent transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-theme-secondary hover:text-accent transition-colors text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.gg/v9tv7SNCwp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-secondary hover:text-accent transition-colors text-sm"
                >
                  Support
                </a>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-theme-secondary hover:text-accent transition-colors text-sm"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/affiliates"
                  reloadDocument
                  className="text-theme-secondary hover:text-accent transition-colors text-sm"
                >
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://api.roesploits.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-secondary hover:text-accent transition-colors text-sm flex items-center gap-2"
                >
                  System Status
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/v9tv7SNCwp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-secondary hover:text-accent transition-colors text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://funpay.com/en/users/5758539/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-secondary hover:text-[#2682F4] transition-colors text-sm flex items-center gap-2"
                >
                  FunPay Store
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h3 className="text-white font-bold mb-6">Our Products</h3>
            <ul className="space-y-4">
              {products.length > 0 ? (
                <>
                  {products.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/product?id=${product.id}`}
                        className="text-theme-secondary hover:text-accent transition-colors text-sm line-clamp-1"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/products"
                      className="text-accent hover:text-white transition-colors text-sm font-medium flex items-center gap-1 group mt-2"
                    >
                      View All
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                </>
              ) : (
                <li className="text-theme-secondary text-sm italic">Loading products...</li>
              )}
            </ul>
          </div>
        </div>

        <div className="pb-4">
          <Link 
            to="/policy" 
            className="text-theme-secondary hover:text-white transition-colors text-base font-medium"
          >
            Policy
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-theme-secondary text-sm">
            © {currentYear} Roesploits. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-theme-secondary text-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-theme-secondary text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-theme-secondary text-sm">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Trusted by 10k+</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
