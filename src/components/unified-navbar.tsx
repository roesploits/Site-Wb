"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  User,
  Menu,
  X,
  Zap,
  Users,
  Activity,
  CreditCard,
  Star,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartButton } from "./cart-button";
import { SearchButton } from "./search-button";

export function UnifiedNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [bannerUrl, setBannerUrl] = useState("/komerza.svg");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    async function getBanner() {
      if (typeof (globalThis as any).komerza === "undefined") return;
      try {
        const url = await (globalThis as any).komerza.getStoreBannerUrl();
        if (url) {
          setBannerUrl(url);
        }
      } catch (error) {
        console.warn("Failed to load store banner, using fallback:", error);
      }
    }

    getBanner();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandingPage = location.pathname === "/";
  const isProductsPage = location.pathname === "/products";
  const isSupportPage = location.pathname === "/dashboard/support";
  const isAffiliatesPage = location.pathname === "/dashboard/affiliates";
  const isPartnersPage = location.pathname === "/partners";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-16 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? "bg-[#050505]/80 border-b border-white/10 shadow-2xl backdrop-blur-xl"
          : "bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-[2px]"
      }`}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6">
        {/* Logo with enhanced styling */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center gap-3 group relative">
            {/* Glow effect on logo */}
            <div className="absolute inset-0 bg-accent/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-150"></div>
            <img
              src={bannerUrl}
              alt="Roesploits Logo"
              className="h-9 w-auto relative z-10 transition-all duration-500 group-hover:scale-110 drop-shadow-lg group-hover:drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"
            />
          </Link>

          {/* Desktop Navigation with enhanced styling */}
          <nav className="items-center gap-1 hidden md:flex">
            <Link
              to="/"
              className={`group relative flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-300 ${
                isLandingPage
                  ? "text-white bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                  : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
              }`}
            >
              {isLandingPage && (
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-sm"></div>
              )}
              <Home
                className={`w-4 h-4 relative z-10 ${
                  isLandingPage
                    ? "text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]"
                    : "group-hover:text-accent transition-colors duration-300"
                }`}
              />
              <span className="text-sm font-medium tracking-wide relative z-10">
                Home
              </span>
            </Link>
            <Link
              to="/products"
              className={`group relative flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-300 ${
                isProductsPage
                  ? "text-white bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                  : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
              }`}
            >
              {isProductsPage && (
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-sm"></div>
              )}
              <Package
                className={`w-4 h-4 relative z-10 ${
                  isProductsPage
                    ? "text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]"
                    : "group-hover:text-accent transition-colors duration-300"
                }`}
              />
              <span className="text-sm font-medium tracking-wide relative z-10">
                Products
              </span>
            </Link>
            <a
              href="https://discord.gg/v9tv7SNCwp"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-300 text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
            >
              <HelpCircle className="w-4 h-4 relative z-10 group-hover:text-accent transition-colors duration-300" />
              <span className="text-sm font-medium tracking-wide relative z-10">
                Support
              </span>
            </a>
            <Link
              to="/dashboard/affiliates"
              reloadDocument
              className={`group relative flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-300 ${
                isAffiliatesPage
                  ? "text-white bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                  : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
              }`}
            >
              {isAffiliatesPage && (
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-sm"></div>
              )}
              <Users
                className={`w-4 h-4 relative z-10 ${
                  isAffiliatesPage
                    ? "text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]"
                    : "group-hover:text-accent transition-colors duration-300"
                }`}
              />
              <span className="text-sm font-medium tracking-wide relative z-10">
                Affiliates
              </span>
            </Link>
            <Link
              to="/partners"
              className={`group relative flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-300 ${
                isPartnersPage
                  ? "text-white bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                  : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
              }`}
            >
              {isPartnersPage && (
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-sm"></div>
              )}
              <Star
                className={`w-4 h-4 relative z-10 ${
                  isPartnersPage
                    ? "text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]"
                    : "group-hover:text-accent transition-colors duration-300"
                }`}
              />
              <span className="text-sm font-medium tracking-wide relative z-10">
                Partners
              </span>
            </Link>
            <a
              href="https://funpay.com/en/users/5758539/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-300 text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
            >
              <CreditCard className="w-4 h-4 relative z-10 group-hover:text-[#2682F4] transition-colors duration-300" />
              <span className="text-sm font-medium tracking-wide relative z-10">
                FunPay
              </span>
            </a>
            <a
              href="https://status.roesploits.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 rounded-full px-5 py-2 transition-all duration-300 text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
            >
              <Activity className="w-4 h-4 relative z-10 group-hover:text-green-500 transition-colors duration-300" />
              <span className="text-sm font-medium tracking-wide relative z-10">
                Status
              </span>
            </a>
          </nav>
        </div>

        {/* Right Actions with enhanced styling */}
        <div className="flex items-center gap-2">
          <SearchButton />
          <CartButton />

          {/* Mobile Menu Toggle with better styling */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden glass border border-white/10 hover:border-accent/30 text-white hover:bg-accent/10 h-10 w-10 p-0 rounded-xl items-center justify-center transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 rotate-0 transition-transform duration-300" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* Desktop Account Button with premium styling */}
          <Link to="/dashboard" reloadDocument className="hidden md:block">
            <Button className="relative group bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent text-white h-10 px-5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all duration-300 glow-accent-sm hover:glow-accent overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <User className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Account</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu with enhanced styling */}
      {isMobileMenuOpen &&
        createPortal(
          <div className="md:hidden fixed inset-0 top-16 bg-[#050505] border-t border-white/10 animate-in slide-in-from-top-5 duration-300 z-[49] overflow-y-auto">
            <div className="container mx-auto px-4 py-6 space-y-3">
              <Link
                to="/"
                className={`group relative flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden ${
                  isLandingPage
                    ? "text-white bg-white/10 border border-white/10"
                    : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isLandingPage && (
                  <div className="absolute inset-0 bg-accent/10 blur-sm"></div>
                )}
                <Home
                  className={`w-5 h-5 relative z-10 ${
                    isLandingPage ? "text-accent" : "group-hover:text-accent"
                  } transition-colors`}
                />
                <span className="text-base font-medium relative z-10">
                  Home
                </span>
              </Link>
              <Link
                to="/products"
                className={`group relative flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden ${
                  isProductsPage
                    ? "text-white bg-white/10 border border-white/10"
                    : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isProductsPage && (
                  <div className="absolute inset-0 bg-accent/10 blur-sm"></div>
                )}
                <Package
                  className={`w-5 h-5 relative z-10 ${
                    isProductsPage ? "text-accent" : "group-hover:text-accent"
                  } transition-colors`}
                />
                <span className="text-base font-medium relative z-10">
                  Products
                </span>
              </Link>
              <Link
                to="/dashboard/affiliates"
                reloadDocument
                className={`group relative flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden ${
                  isAffiliatesPage
                    ? "text-white bg-white/10 border border-white/10"
                    : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isAffiliatesPage && (
                  <div className="absolute inset-0 bg-accent/10 blur-sm"></div>
                )}
                <Users
                  className={`w-5 h-5 relative z-10 ${
                    isAffiliatesPage ? "text-accent" : "group-hover:text-accent"
                  } transition-colors`}
                />
                <span className="text-base font-medium relative z-10">
                  Affiliates
                </span>
              </Link>
              <Link
                to="/partners"
                className={`group relative flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden ${
                  isPartnersPage
                    ? "text-white bg-white/10 border border-white/10"
                    : "text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isPartnersPage && (
                  <div className="absolute inset-0 bg-accent/10 blur-sm"></div>
                )}
                <Star
                  className={`w-5 h-5 relative z-10 ${
                    isPartnersPage ? "text-accent" : "group-hover:text-accent"
                  } transition-colors`}
                />
                <span className="text-base font-medium relative z-10">
                  Partners
                </span>
              </Link>
              <a
                href="https://discord.gg/v9tv7SNCwp"
                target="_blank"
                rel="noopener noreferrer"
                className="grofunpay.com/en/users/5758539/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CreditCard className="w-5 h-5 relative z-10 group-hover:text-[#2682F4] transition-colors" />
                <span className="text-base font-medium relative z-10">
                  FunPay
                </span>
              </a>
              <a
                href="https://api.roesploits.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden text-theme-secondary hover:text-white border border-transparent hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Activity
                  className="w-5 h-5 relative z-10 group-hover:text-green-500 transition-colors"
                />
                <span className="text-base font-medium relative z-10">
                  Status
                </span>
              </a>

              <div className="border-t border-white/10 pt-4 mt-4">
                <Link
                  to="/dashboard"
                  reloadDocument
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="relative group w-full bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent text-white h-14 px-4 rounded-xl flex items-center justify-center gap-2 text-base font-bold transition-all duration-300 glow-accent-sm hover:glow-accent overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <User className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Account</span>
                    <Zap className="w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
