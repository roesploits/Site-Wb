"use client";

import { UnifiedNavbar } from "@/components/unified-navbar";
import { Button } from "@/components/ui/button";
import {
  Users,
  Globe,
  Youtube,
  MessageCircle,
  Code,
  Star,
  TrendingUp,
  DollarSign,
  BarChart3,
  Gift,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ParticleRiver } from "@/components/particle-river";

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-accent/30">
      <UnifiedNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleRiver />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/80 to-[#050505]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6 animate-fade-in-up">
            <Star className="w-4 h-4 fill-accent" />
            Partner Program
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Become a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-400">
              Partner
            </span>
          </h1>

          <p
            className="text-xl text-theme-secondary max-w-2xl mx-auto mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Monetize your traffic with the largest and most trusted Roblox
            software marketplace. If your audience cares about scripts, tools,
            or executors — you can earn with us.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="https://discord.gg/v9tv7SNCwp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="h-14 px-8 text-lg bg-accent hover:bg-accent-600 text-white rounded-xl shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.5)] transition-all duration-300">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button
                variant="outline"
                className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 text-white rounded-xl"
              >
                How it Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who We're Looking For
            </h2>
            <p className="text-theme-secondary max-w-2xl mx-auto">
              We collaborate with creators, platforms, and communities that
              bring real value to the Roblox scripting ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Discord Server Owners",
                desc: "Servers focused on scripts, exploits, Roblox gaming, modding, tutorials, or general gaming communities.",
              },
              {
                icon: Globe,
                title: "Script & Exploit Websites",
                desc: "Platforms publishing scripts, hubs, injectors, tools, guides, or tutorials.",
              },
              {
                icon: Youtube,
                title: "YouTube Creators",
                desc: "Channels posting script showcases, exploit videos, tutorials, gameplay, or reviews.",
              },
              {
                icon: TrendingUp,
                title: "TikTok / Shorts Creators",
                desc: "Fast-paced, trend-focused content creators driving high engagement.",
              },
              {
                icon: Users,
                title: "Telegram Channel Owners",
                desc: "Communities sharing scripts, guides, updates, tools, and resources.",
              },
              {
                icon: Code,
                title: "Developers & Script Creators",
                desc: "Those who want to monetize their scripts, injectors, or custom tools through our platform.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-theme-secondary text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-transparent to-accent/10 border border-accent/20">
            <p className="text-lg font-medium text-white">
              <Star className="w-5 h-5 text-accent inline-block mr-2 mb-1" />
              Influencers & Community Leaders: If your community brings
              interested players, you're exactly the type of partner we want.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What You Get
            </h2>
            <p className="text-theme-secondary max-w-2xl mx-auto">
              We offer the most competitive partnership terms in the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: DollarSign,
                title: "20% Commission",
                desc: "On every sale. Higher than industry standards.",
              },
              {
                icon: Zap,
                title: "Weekly Payouts",
                desc: "Crypto, Bank Transfers of your choice.",
              },
              {
                icon: BarChart3,
                title: "Full Analytics",
                desc: "Track clicks, conversions, earnings, and top products.",
              },
              {
                icon: Gift,
                title: "Free Keys",
                desc: "For reviews and giveaways to engage your community.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:border-accent/50 group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] transition-all duration-300">
                  <item.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-theme-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Custom Deals & Exclusive Offers
              </h3>
              <p className="text-theme-secondary">
                Special commissions or bonuses for large creators. We tailor our
                partnership to your scale.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-white/10">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Support for your content
              </h3>
              <p className="text-theme-secondary">
                We can provide scripts, thumbnails, ideas, templates, even full
                video scripts to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Apply & Get Link",
                  desc: "Apply in our Discord and get your unique referral link and coupon code.",
                },
                {
                  step: "02",
                  title: "Share & Promote",
                  desc: "Share them on your platforms. Your followers buy through your link.",
                },
                {
                  step: "03",
                  title: "Earn & Withdraw",
                  desc: "Earn commission from every sale. Request payout anytime.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#050505] p-6 rounded-2xl border border-white/10 text-center relative group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent text-white font-bold text-xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-theme-secondary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Creators Love Us */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Creators Love Partnering With Us
              </h2>
              <div className="space-y-4">
                {[
                  "Trusted brand with thousands of daily buyers",
                  "Safe injectors, stable scripts, no viruses, no trash",
                  "High conversion rates thanks to strong reputation",
                  "Professional customer support",
                  "Products with real demand among Roblox players",
                  "Returning customers bring you passive earnings",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <div className="text-center space-y-6">
                  <div className="inline-block p-4 rounded-full bg-accent/10 mb-2">
                    <ShieldCheck className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    Ready to start earning?
                  </h3>
                  <p className="text-theme-secondary">
                    Unlock a new revenue stream. Let your content finally pay
                    what it deserves.
                  </p>
                  <a
                    href="https://discord.gg/v9tv7SNCwp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full h-14 text-lg bg-accent hover:bg-accent-600 text-white rounded-xl shadow-lg shadow-accent/20">
                      Apply Now via Discord
                    </Button>
                  </a>
                  <p className="text-xs text-theme-secondary">
                    Join our Discord and open a ticket to apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
