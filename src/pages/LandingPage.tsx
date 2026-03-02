"use client";

import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Package,
  Shield,
  Zap,
  Download,
  Star,
  Users,
  MessageCircle,
  ChevronDown,
  HelpCircle,
  CreditCard,
  Snowflake,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleRiver } from "@/components/particle-river";
import { LandingProductsClient } from "@/components/landing-products-client";
import { UnifiedNavbar } from "@/components/unified-navbar";
import { ChristmasDecorations } from "@/components/christmas-decorations";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [bannerUrl, setBannerUrl] = useState("/komerza-logo.png");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-theme-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh opacity-40"></div>
      {/* <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent rounded-full blur-[150px] opacity-10 -glow"></div> */}
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px] opacity-10 -glow"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <UnifiedNavbar />

      {/* Hero Section */}
      <ChristmasDecorations />
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-10 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <img
            src="#"
            alt="Gaming Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[#050505]/90"></div>

          {/* Experimental Pulsing Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
          {/* <div
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div> */}
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#60CDF5]/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: "5s" }}
          ></div>
        </div>

        {/* Particle Animation */}
        <div className="absolute inset-0 h-full w-full z-5 opacity-60">
          <ParticleRiver />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto max-w-6xl text-center relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="flex items-center justify-center mb-8 animate-float">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm border border-accent/20 glow-accent-sm shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]">
              <Snowflake className="w-4 h-4 text-accent fill-accent animate-pulse" />
              <span className="text-theme-primary font-medium">
                ROBUX, FunPay Payments & Support:{" "}
                <a
                  href="https://discord.gg/v9tv7SNCwp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-bold"
                >
                  https://discord.gg/v9tv7SNCwp
                </a>
              </span>
            </div>
          </div>

          {/* Main Heading - Experimental Typography */}
          <div className="relative mb-8">
            <div className="absolute -inset-10 bg-accent/10 blur-[60px] rounded-full pointer-events-none"></div>
            <h1 className="relative heading-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white text-center leading-[0.9] tracking-tighter">
              UNLOCK THE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_auto] animate-gradient drop-shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)]">
                BEST
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-theme-secondary text-lg sm:text-xl md:text-2xl text-center max-w-3xl mx-auto mb-12 leading-relaxed px-4 font-medium">
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-16 w-full sm:w-auto">
            <Link to="/products" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-12 px-8 text-base bg-accent hover:bg-accent-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 glow-accent hover:glow-accent hover:scale-105 shadow-xl border border-white/10">
                <Package className="w-5 h-5" />
                <span>Start Shopping</span>
              </Button>
            </Link>
            <Link to="/dashboard" reloadDocument className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base glass border-white/10 hover:border-white/30 hover:bg-white/5 text-white rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5" />
                <span>Client Area</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Payment Methods - Redesigned */}
          <div
            className="flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex flex-wrap justify-center items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <img
                src="/pm/mastercard.svg"
                alt="Mastercard"
                className="h-6 w-auto opacity-80 rounded-xs"
              />
              <img
                src="/pm/visa-alt.svg"
                alt="Visa"
                className="h-6 w-auto opacity-80 rounded-xs"
              />
              <img
                src="/pm/apple-pay.svg"
                alt="Apple Pay"
                className="h-6 w-auto opacity-80 rounded-xs"
              />
              <img
                src="/pm/google-pay-alt.svg"
                alt="Google Pay"
                className="h-6 w-auto opacity-80 rounded-xs"
              />
              <img
                src="/pm/crypto.svg"
                alt="Crypto"
                className="h-6 w-auto opacity-80 rounded-xs"
              />

              <div className="h-4 w-px bg-white/10 mx-1"></div>

              <img
                src="/pm/stripe.svg"
                alt="Stripe"
                className="h-6 w-auto opacity-80 rounded-xs"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Featured Products Section */}
      <section
        id="products"
        className="relative flex w-full flex-col gap-8 py-24 sm:py-32"
      >
        {/* Section Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs border border-accent/20 mb-6">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span className="text-theme-primary font-medium">
              FEATURED PRODUCTS
            </span>
          </div>
          <h2 className="text-center text-4xl sm:text-5xl md:text-6xl heading-display text-theme-primary mb-4">
            Premium Gaming Tools
          </h2>
          <p className="max-w-2xl text-center text-base sm:text-lg text-theme-secondary px-4">
            Discover our most popular executors and scripts trusted by the
            community
          </p>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 sm:px-6">
          <LandingProductsClient />
        </div>

        {/* View All CTA */}
        <div className="mt-8 flex items-center justify-center px-4">
          <Link to="/products">
            <Button className="bg-accent hover:bg-accent-600 text-white h-12 px-8 rounded-xl flex items-center gap-2 text-base font-semibold transition-all duration-300 glow-accent-sm hover-lift">
              <Package className="w-5 h-5" />
              <span>View All Products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section - Experimental Redesign */}
      <section className="relative py-24 border-t border-white/5 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs border border-accent/20 mb-6">
              <Star className="w-3.5 h-3.5 text-accent fill-accent animate-pulse" />
              <span className="text-theme-primary font-bold tracking-wider">
                THE ADVANTAGE
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl heading-display text-white mb-6 tracking-tight">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_auto] animate-gradient drop-shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)]">
                ROESPLOITS?
              </span>
            </h2>
            <p className="text-theme-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              We don't just sell tools; we engineer the ultimate gaming
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="group relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-500">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                  High-Performance
                </h3>
                <p className="text-theme-secondary text-base leading-relaxed group-hover:text-white/80 transition-colors">
                  Access premium executors optimized for maximum FPS and
                  stability. Our tools are battle-tested to ensure you stay
                  ahead of the game.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  Verified & Trusted
                </h3>
                <p className="text-theme-secondary text-base leading-relaxed group-hover:text-white/80 transition-colors">
                  Join thousands of satisfied customers. We prioritize your
                  account security with industry-leading safety protocols and
                  encryption.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  Instant Delivery
                </h3>
                <p className="text-theme-secondary text-base leading-relaxed group-hover:text-white/80 transition-colors">
                  No waiting times. Our automated system delivers your keys and
                  downloads instantly after purchase, 24/7/365.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-green-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  Dedicated Support
                </h3>
                <p className="text-theme-secondary text-base leading-relaxed group-hover:text-white/80 transition-colors">
                  Stuck? Our expert support team is always ready to help you
                  with setup, troubleshooting, or any questions you might have.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-12 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs border border-accent/20 mb-6">
              <HelpCircle className="w-3.5 h-3.5 text-accent" />
              <span className="text-theme-primary font-medium">
                HELP CENTER
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl heading-display text-theme-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-theme-secondary text-lg max-w-2xl mx-auto">
              Find answers to common questions about our products and services
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "0ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  What payment methods do you accept?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 0 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p className="mb-4">
                    We currently accept a variety of payment methods to make
                    your purchasing experience as convenient as possible. These
                    methods include:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>
                      <strong className="text-white">PayPal: </strong>
                      Coming soon.
                    </li>
                    <li>
                      <strong className="text-white">Stripe:</strong> Securely
                      process credit and debit card payments directly on our
                      site.
                    </li>
                    <li>
                      <strong className="text-white">
                        Credit/Debit Cards:
                      </strong>{" "}
                      We accept major credit and debit cards, including Visa,
                      Mastercard, American Express, and Discover.
                    </li>
                    <li>
                      <strong className="text-white">Cryptocurrencies:</strong>{" "}
                      For those who prefer the privacy and security of crypto,
                      we accept Bitcoin, Ethereum, and Litecoin.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "100ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  Are these products safe to use?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 1 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p>
                    Yes, we take the safety and functionality of our products
                    very seriously. All products undergo rigorous testing to
                    ensure they are safe to use and perform as advertised.
                    Always prioritize respectful and ethical use.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "200ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  Can I get a refund if I'm not satisfied with my purchase?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 2 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p>
                    We understand that sometimes a product might not meet your
                    specific needs. All sales are typically final, we do offer
                    refunds on a case-by-case basis, depending on the reason for
                    your dissatisfaction. If you encounter any issues with your
                    order or are unhappy with your purchase, please don't
                    hesitate to contact our support team. We'll do our best to
                    find a satisfactory solution.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "300ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  When will I receive my order?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 3 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p>
                    Your items will be delivered instantly. They will be
                    displayed on the website and they will be sent to the email
                    address that you specified when placing the order. If you
                    don't see the email in your inbox, please check the Spam
                    folder.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "400ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  Is it possible to buy in bulk?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 4 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p>
                    Yes, absolutely! Whether you're a reseller or simply need
                    multiple licenses, we encourage you to contact us directly
                    to discuss your specific needs and receive a customized
                    quote.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 6 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "500ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  What if the product I purchased stops working?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 5 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 5 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p>
                    If you experience any issues with a purchased product,
                    please contact our support team immediately. We'll do our
                    best to provide a solution, which may include updates,
                    replacements, or troubleshooting assistance.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 7 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "600ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 6 ? null : 6)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  How can I get help with my order?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 6 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 6 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p className="mb-4">
                    We're here to help! If you have any questions or need
                    assistance with your order, there are several ways to get in
                    touch:
                  </p>
                  <p>
                    <strong className="text-white">Discord:</strong> Join our
                    Discord server at{" "}
                    <a
                      href="https://discord.gg/v9tv7SNCwp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      https://discord.gg/v9tv7SNCwp
                    </a>
                    . This is the quickest way to get real-time support and
                    interact with our community.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 8 */}
            <div
              className="glass rounded-2xl border border-white/10 overflow-hidden hover-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: "700ms" }}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === 7 ? null : 7)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <h3 className="text-white font-semibold text-lg pr-4">
                  I want to advise your shop to someone, will I get % from sale?
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openFaqIndex === 7 ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaqIndex === 7 && (
                <div className="px-6 pb-6 text-theme-secondary leading-relaxed animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <p>
                    Yes, currently we provide 20% shares for you and 5% discount
                    for the person invited. It's a pleasure for us to give you
                    an opportunity to earn some money.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center">
            <p className="text-theme-secondary mb-6">
              Still have questions? We're here to help!
            </p>
            <a
              href="https://discord.gg/v9tv7SNCwp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-accent hover:bg-accent-600 text-white h-12 px-8 rounded-xl flex items-center gap-2 text-base font-semibold transition-all duration-300 glow-accent-sm hover-lift mx-auto">
                <MessageCircle className="w-5 h-5" />
                <span>Join Our Discord</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 mb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 md:gap-24">
            <div className="flex flex-col items-center gap-2">
              <BadgeCheck className="w-10 h-10 text-[#2DA6FF] fill-[#2DA6FF]/10" />
              <span className="text-lg font-bold text-white">Verified seller</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Star className="w-10 h-10 text-[#FF9900] fill-[#FF9900]" />
              <span className="text-lg font-bold text-white">5/5 rated</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold text-white">240</span>
              <span className="text-lg font-bold text-white">Reviews</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold text-white">422</span>
              <span className="text-lg font-bold text-white">Products sold</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
