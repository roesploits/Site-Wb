"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { ProductActionsWrapper } from "@/components/product-actions-wrapper";
import { ProductDescriptionTabs } from "@/components/product-description-tabs";
import {
  Code2,
  Zap,
  FileCode,
  ShieldCheck,
  RefreshCw,
  Eye,
  MonitorPlay,
  Boxes,
  Gauge,
  FolderTree,
  Terminal,
  Layers,
  Globe,
  Brain,
  Puzzle,
  Wrench,
  FlaskConical,
  Lock,
  Users,
  Star,
} from "lucide-react";

interface Variant {
  id: string;
  name: string;
  cost: number;
  description?: string;
  stock: number;
  stockMode: number; // 0 = Calculated, 1 = Ignored, 2 = Fixed
  minimumQuantity?: number;
  maximumQuantity?: number;
}

interface ProductReference {
  id: string;
  name: string;
  description: string;
  imageNames: string[];
  variants: Variant[];
}

interface Review {
  id: string;
  rating: number;
  reason: string;
  productId?: string;
  reply?: string;
  dateCreated: string;
}

interface PaginatedApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  pages: number;
}

let formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
});

export function ProductPageClient() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-theme-secondary">Loading product...</p>
        </div>
      }
    >
      <ProductPageContent />
    </Suspense>
  );
}

function ProductPageContent() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("id") || searchParams.get("slug"); // Support both id and slug

  const [product, setProduct] = useState<ProductReference | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    async function load() {
      const api: any = (globalThis as any).komerza;
      if (!api) {
        setError("Komerza API not available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (typeof api.getProduct === "function") {
          const res = await api.getProduct(slug);
          if (res?.success && res.data) {
            setProduct(res.data);
            // Load reviews for this product
            loadReviews(res.data.id, 1);
            setLoading(false);
            return;
          }
        }
        // Fallback: fetch full store and locate product by id or slug
        if (typeof api.getStore === "function") {
          const store = await api.getStore();
          if (store?.success && store.data?.products) {
            const found = store.data.products.find(
              (p: any) => p.id === slug || p.slug === slug
            );
            if (found) {
              setProduct(found);
              // Load reviews for this product
              loadReviews(found.id, 1);
            } else {
              setError("Product not found");
            }
          } else {
            setError("Failed to load store data");
          }
        }
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to load product", e);
        }
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const loadReviews = async (productId: string, page: number = 1) => {
    const api: any = (globalThis as any).komerza;
    if (!api || typeof api.getProductReviews !== "function") return;

    formatter = await (globalThis as any).komerza.createFormatter();

    try {
      setReviewsLoading(true);
      const response: PaginatedApiResponse<Review> =
        await api.getProductReviews(productId, page);

      if (response.success && response.data) {
        if (page === 1) {
          setReviews(response.data);
        } else {
          // Append to existing reviews for pagination
          setReviews((prev) => [...prev, ...response.data!]);
        }
        setTotalReviewPages(response.pages);
        setReviewsPage(page);
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to load reviews:", response.message);
        }
        setReviews([]);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error loading reviews:", error);
      }
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadMoreReviews = () => {
    if (product && reviewsPage < totalReviewPages && !reviewsLoading) {
      loadReviews(product.id, reviewsPage + 1);
    }
  };

  // Calculate review statistics with proper validation
  const calculateReviewStats = (reviewsList: Review[]) => {
    if (!reviewsList || reviewsList.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    // Validate ratings and filter out invalid ones
    const validReviews = reviewsList.filter(
      (review) =>
        review &&
        typeof review.rating === "number" &&
        review.rating >= 1 &&
        review.rating <= 5
    );

    if (validReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: reviewsList.length, // Keep original count for display
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const totalRating = validReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / validReviews.length;

    const ratingBreakdown = validReviews.reduce(
      (acc, review) => {
        const rating = Math.floor(review.rating) as keyof typeof acc;
        if (rating >= 1 && rating <= 5) {
          acc[rating] = (acc[rating] || 0) + 1;
        }
        return acc;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviewsList.length,
      ratingBreakdown,
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-theme-secondary">Loading product...</p>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-theme-primary mb-4">
          Product Not Found
        </h1>
        <p className="text-theme-secondary mb-6">
          {error || "The product you're looking for doesn't exist."}
        </p>
        <Link
          to="/products"
          className="bg-primary hover:bg-primary-600 text-white px-6 py-2 rounded-md transition-colors"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return <p className="text-theme-secondary">Loading...</p>;
  }

  const images =
    product.imageNames.length > 0
      ? product.imageNames.map(
          (name) => `https://user-generated-content.komerza.com/${name}`
        )
      : ["/product-placeholder.png"];

  const reviewStats = calculateReviewStats(reviews);

  // Sort variants by price (lowest to highest)
  const sortVariantsByPrice = (variants: any[]) => {
    return [...variants].sort((a, b) => {
      return (a.cost || 0) - (b.cost || 0);
    });
  };

  const sortedVariants = sortVariantsByPrice(product.variants);

  const actionProduct = {
    id: product.id,
    name: product.name,
    game: "",
    basePrice: sortedVariants[0]?.cost || 0,
    variants: sortedVariants.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.cost,
      description: v.description || "",
      stock: v.stock || 0,
      stockMode: v.stockMode || 0,
      minimumQuantity: v.minimumQuantity || 1,
      maximumQuantity: v.maximumQuantity,
    })),
    image: images[0],
    rating: reviewStats.averageRating,
    reviews: reviewStats.totalReviews,
    category: "",
  };

  // Format reviews with proper validation and fallbacks
  const formattedReviews = reviews.map((review) => {
    // Validate date
    let formattedDate = "Unknown date";
    try {
      if (review.dateCreated) {
        const date = new Date(review.dateCreated);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Invalid date:", review.dateCreated);
      }
    }

    // Validate rating
    const validRating =
      typeof review.rating === "number" &&
      review.rating >= 1 &&
      review.rating <= 5
        ? review.rating
        : 0;

    // Get the reason field directly - it's definitely there
    const comment =
      review.reason && review.reason.trim()
        ? review.reason.trim()
        : "No comment provided";

    const formatted = {
      id: review.id || Math.random().toString(),
      rating: validRating,
      comment: comment,
      author: "Customer", // Komerza doesn't provide author names for privacy
      date: formattedDate,
      reply: review.reply && review.reply.trim() ? review.reply : undefined,
    };

    return formatted;
  });

  // Custom content for Wave Executor product
  const isWaveProduct = product.id === "6d1f91b5-4599-467a-b9ba-eadef98c63fe";

  // Custom content for Codex product (multiple variants)
  const isCodexProduct = product.id === "17ca258e-251f-44c6-b89d-601c335d1b9e";

  // Custom content for Zenith Executor product
  const isZenithProduct = product.id === "7f808bee-2b4f-4258-8019-ab695ee4f394";

  // Custom content for Bunni.lol Executor product
  const isBunniProduct = product.id === "178fa9f7-f297-41d2-b654-274ed11d3b54";

  // Custom content for Seliware Executor product
  const isSeliwareProduct =
    product.id === "51c9587f-4794-46ef-b6bf-2bd9f13c17d2";

  const waveFeatures = [
    {
      title: "Lua + Modules Support",
      description:
        "Full Lua scripting support with module loading capabilities for advanced script execution",
      icon: Code2,
    },
    {
      title: "Fast Injection & Clean Execution",
      description:
        "Lightning-fast injection speed with optimized execution for seamless performance",
      icon: Zap,
    },
    {
      title: "Built-in Code Editor",
      description:
        "Professional code editor with syntax highlighting, auto-completion, and useful utilities",
      icon: FileCode,
    },
    {
      title: "Anti-Ban Protection",
      description:
        "Advanced anti-detection system included by default to keep your account safe",
      icon: ShieldCheck,
    },
    {
      title: "Regular Updates",
      description:
        "Consistent patches and updates to maintain compatibility with latest Roblox versions",
      icon: RefreshCw,
    },
    {
      title: "Script Obfuscation",
      description:
        "Enhanced stealth through automatic obfuscation to avoid detection systems",
      icon: Eye,
    },
    {
      title: "Windows 64-bit Compatible",
      description:
        "Runs smoothly on all Windows 64-bit systems with minimal setup required",
      icon: MonitorPlay,
    },
    {
      title: "Universal Script Support",
      description:
        "Compatible with all known Roblox script formats and libraries",
      icon: Boxes,
    },
    {
      title: "Low-Spec Optimization",
      description:
        "Highly efficient performance even on low-specification PCs and laptops",
      icon: Gauge,
    },
    {
      title: "Script Management UI",
      description:
        "Intuitive user interface for organizing, saving, and managing your script library",
      icon: FolderTree,
    },
    {
      title: "Console Logging",
      description:
        "Advanced debugging with console output and customizable hotkey configurations",
      icon: Terminal,
    },
    {
      title: "Multi-Script Execution",
      description:
        "Execute multiple scripts simultaneously for complex automation workflows",
      icon: Layers,
    },
  ];

  const codexFeatures = [
    {
      title: "Cross-Platform Support",
      description: "Seamlessly run scripts on PC (Windows), Android, and iOS",
      icon: Globe,
    },
    {
      title: "Flexible Script Language Support",
      description:
        "Compatible with multiple scripting languages for broader functionality",
      icon: Brain,
    },
    {
      title: "Intuitive UI",
      description:
        "Clean, beginner-friendly interface that makes script execution simple and smooth",
      icon: Puzzle,
    },
    {
      title: "Smart Debugging Tools",
      description:
        "Catch and resolve errors fast with enhanced debugging features",
      icon: Wrench,
    },
    {
      title: "Optimized Resource Usage",
      description: "Runs with low CPU/memory load to ensure stable gameplay",
      icon: FlaskConical,
    },
    {
      title: "Safe Environment",
      description:
        "Built-in protection protocols to prioritize privacy and execution security",
      icon: Lock,
    },
    {
      title: "Frequent Updates + Active Community",
      description:
        "Stay ahead with regular updates and help from a dedicated community",
      icon: Users,
    },
  ];

  const zenithFeatures = [
    {
      title: "Rapid Update System",
      description:
        "Our team prepares updates ahead of time to minimize downtime. When service interruptions occur, our automatic compensation extends your subscription for the exact duration of the outage.",
      icon: RefreshCw,
    },
    {
      title: "Premium Interface Experience",
      description:
        "Advanced editor with split-view editing, real-time syntax highlighting, integrated script hub, and built-in output console. Features intuitive keybinds and customizable settings for the ultimate workflow.",
      icon: FileCode,
    },
    {
      title: "Fair Compensation System",
      description:
        "We extend subscriptions during disruptions - often beyond actual downtime. This commitment to fairness has earned the loyalty of thousands of users worldwide.",
      icon: ShieldCheck,
    },
    {
      title: "Largest Environment Available",
      description:
        "Over 300 custom functions provide the most comprehensive scripting environment. Includes all sUNC functions plus exclusive features like DrawingImmediate and extended standard libraries.",
      icon: Boxes,
    },
    {
      title: "Complete Interface Theming",
      description:
        "Full visual customization from subtle color adjustments to complete overhauls. Add custom glow effects and background images/gifs to make Zenith uniquely yours.",
      icon: Eye,
    },
    {
      title: "Integrated Script Hub",
      description:
        "Access thousands of scripts directly through the built-in hub. Find exactly what you need without external searches or forum browsing.",
      icon: FolderTree,
    },
    {
      title: "Error Spoofing Protection",
      description:
        "Script errors are safely redirected to our output console instead of appearing in-game, giving you peace of mind during development and testing.",
      icon: Lock,
    },
    {
      title: "VS Code Integration",
      description:
        "Work in your preferred environment with our Visual Studio Code extension. Write and execute scripts directly from VS Code while maintaining all Zenith features.",
      icon: Code2,
    },
    {
      title: "Built-In Documentation",
      description:
        "Access comprehensive function documentation directly through the interface. No more tab switching - everything you need is at your fingertips.",
      icon: Terminal,
    },
    {
      title: "Intuitive Home Page",
      description:
        "Stay informed with latest updates and remaining license time displayed at a glance. Transparent subscription status helps you plan ahead effectively.",
      icon: MonitorPlay,
    },
    {
      title: "Advanced Drawing Library",
      description:
        "Create stunning, undetectable in-game interfaces with our imgui-based drawing library. Superior performance and security compared to Lua-based solutions.",
      icon: Layers,
    },
    {
      title: "Dedicated Support Team",
      description:
        "Get help when you need it through our active Discord server with dedicated support staff. Issues are addressed quickly to minimize disruption.",
      icon: Users,
    },
    {
      title: "Full UI Customization",
      description:
        "Modify the interface to match your workflow. Adjust button placements, hide unnecessary panels, and create an environment that works for you.",
      icon: Puzzle,
    },
    {
      title: "FPS Control",
      description:
        "Set custom FPS limits or remove restrictions entirely. Perfect for power users running auto-farming scripts without needing high frame rates.",
      icon: Gauge,
    },
  ];

  const bunniFeatures = [
    {
      title: "Instant Access",
      description:
        "Get started immediately with no registration required and no key system barriers. Download and start using right away.",
      icon: Zap,
    },
    {
      title: "Perfect sUNC Rating",
      description:
        "Exceptional stability and reliability with a flawless sUNC rate. Consistently performs under any load condition.",
      icon: ShieldCheck,
    },
    {
      title: "Complete Script Compatibility",
      description:
        "Works seamlessly with all major Roblox scripts. Universal support ensures you can run any script without compatibility issues.",
      icon: Code2,
    },
    {
      title: "Integrated Decompiler",
      description:
        "Powerful built-in decompiler for exploring, analyzing, and debugging scripts. Essential tool for learning and testing.",
      icon: FileCode,
    },
    {
      title: "Optimized Performance",
      description:
        "Lightning-fast execution with minimal system resource usage. Engineered for maximum speed without compromising stability.",
      icon: Gauge,
    },
    {
      title: "Clean Modern Interface",
      description:
        "Intuitive and beginner-friendly design that's easy to navigate. Professional appearance with streamlined functionality.",
      icon: MonitorPlay,
    },
  ];

  const seliwareFeatures = [
    {
      title: "Ultra-Fast Execution",
      description:
        "Lightning-speed script execution engine optimized for instant response times. Execute multiple scripts simultaneously without any lag or delays.",
      icon: Zap,
    },
    {
      title: "Rock-Solid Stability",
      description:
        "Built on a foundation of reliable code architecture that ensures consistent performance. Never experience crashes or unexpected shutdowns during critical moments.",
      icon: ShieldCheck,
    },
    {
      title: "100% sUNC (Serverside Undetected)",
      description:
        "Complete serverside undetected status with advanced anti-detection technology. Your account stays completely safe with zero ban risk.",
      icon: Lock,
    },
    {
      title: "Custom UI Design with Themes",
      description:
        "Beautiful, customizable interface with multiple theme options. Personalize your executor with colors, layouts, and visual effects that match your style.",
      icon: Eye,
    },
    {
      title: "Fast Injection Technology",
      description:
        "Advanced injection system that attaches to Roblox in milliseconds. Minimal waiting time means you can start scripting immediately after launch.",
      icon: Gauge,
    },
    {
      title: "Regular Updates & Maintenance",
      description:
        "Continuous development and updates to maintain compatibility with latest Roblox versions. Our team works around the clock to ensure uninterrupted service.",
      icon: RefreshCw,
    },
    {
      title: "Built-in Script Hub",
      description:
        "Access thousands of verified scripts directly from the executor interface. Discover new scripts, save favorites, and execute with one click.",
      icon: FolderTree,
    },
    {
      title: "Auto-Execute Support",
      description:
        "Set up scripts to run automatically when joining games. Perfect for auto-farming and repetitive tasks that need to start instantly.",
      icon: Layers,
    },
    {
      title: "Multi-Instance Support",
      description:
        "Run multiple Roblox instances simultaneously with independent script execution. Ideal for multi-accounting and advanced automation workflows.",
      icon: Boxes,
    },
    {
      title: "Advanced Script Editor",
      description:
        "Professional code editor with syntax highlighting, auto-completion, and intelligent error detection. Write and debug scripts efficiently with IDE-level features.",
      icon: FileCode,
    },
    {
      title: "Script Manager & Cloud Saves",
      description:
        "Organize your scripts with folders and tags. Cloud synchronization keeps your scripts accessible across all devices.",
      icon: Globe,
    },
    {
      title: "Performance Optimization Engine",
      description:
        "Intelligent resource management ensures minimal CPU and memory usage. Run demanding scripts without impacting game performance or system responsiveness.",
      icon: FlaskConical,
    },
    {
      title: "Secure Authentication System",
      description:
        "Military-grade encryption protects your license key and personal information. Two-factor authentication available for enhanced account security.",
      icon: Lock,
    },
    {
      title: "HTTP Library Support",
      description:
        "Full support for HTTP requests, webhooks, and API integrations. Build powerful scripts that interact with external services and databases.",
      icon: Code2,
    },
    {
      title: "Custom Function Library",
      description:
        "Exclusive functions and utilities not found in standard executors. Extended capabilities give you more control and creative freedom.",
      icon: Puzzle,
    },
    {
      title: "Game-Specific Optimizations",
      description:
        "Pre-configured settings for popular games ensure optimal performance. Automatic detection applies the best configuration for each game.",
      icon: Brain,
    },
    {
      title: "Advanced Debugging Tools",
      description:
        "Comprehensive debugging suite with breakpoints, variable inspection, and call stack analysis. Identify and fix issues quickly with professional tools.",
      icon: Wrench,
    },
    {
      title: "Script Scheduler & Automation",
      description:
        "Schedule scripts to run at specific times or intervals. Create complex automation workflows with conditional triggers and loops.",
      icon: Terminal,
    },
    {
      title: "Webhook Integration Support",
      description:
        "Send notifications, logs, and data to Discord or other platforms. Monitor your scripts remotely and receive instant alerts.",
      icon: Users,
    },
    {
      title: "Premium Support Access",
      description:
        "Priority support from our dedicated team via Discord. Fast response times and expert assistance whenever you need help.",
      icon: Users,
    },
  ];

  // Parse description for YouTube video ID
  let youtubeVideoId: string | undefined = undefined;
  let parsedDescription = product.description;

  const showcaseRegex = /\[showcase\]\s*\n([a-zA-Z0-9_-]+)/;
  const match = product.description.match(showcaseRegex);

  if (match) {
    youtubeVideoId = match[1];
    parsedDescription = product.description.replace(match[0], "").trim();
  }

  const tabsProduct = {
    id: product.id,
    name: product.name,
    longDescription: parsedDescription,
    features: isWaveProduct
      ? waveFeatures
      : isCodexProduct
      ? codexFeatures
      : isZenithProduct
      ? zenithFeatures
      : isBunniProduct
      ? bunniFeatures
      : isSeliwareProduct
      ? seliwareFeatures
      : [],
    youtubeVideoId: youtubeVideoId,

    reviewsData: {
      averageRating: reviewStats.averageRating,
      totalReviews: reviewStats.totalReviews,
      ratingBreakdown: reviewStats.ratingBreakdown,
      recentReviews: formattedReviews,
      hasMoreReviews: reviewsPage < totalReviewPages,
      loadingMoreReviews: reviewsLoading,
      onLoadMore: loadMoreReviews,
    },
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-sm text-theme-secondary mb-4">
        <Link to="/products" className="hover:text-accent transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-theme-primary">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Images */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-2xl p-2 border border-white/10 overflow-hidden">
            <ProductImageGallery
              images={images}
              productName={product.name}
              youtubeVideoId={youtubeVideoId}
            />
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 space-y-8 sticky top-24">
          <div className="space-y-4">
            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-theme-primary leading-tight">
              {product.name}
            </h1>

            {/* Rating Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(reviewStats.averageRating)
                          ? "text-accent fill-accent"
                          : "text-theme-secondary/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-accent ml-1">
                  {reviewStats.averageRating}
                </span>
              </div>
              <span className="text-sm text-theme-secondary">
                ({reviewStats.totalReviews} reviews)
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl shadow-black/20">
            <ProductActionsWrapper
              key={actionProduct.id}
              product={actionProduct}
            />
          </div>

          {/* Quick Features Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <Zap className="w-6 h-6 text-accent mb-2" />
              <h3 className="font-bold text-theme-primary text-sm">
                Instant Delivery
              </h3>
              <p className="text-xs text-theme-secondary mt-1">
                Get your key immediately after purchase
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <ShieldCheck className="w-6 h-6 text-accent mb-2" />
              <h3 className="font-bold text-theme-primary text-sm">
                Secure Payment
              </h3>
              <p className="text-xs text-theme-secondary mt-1">
                Encrypted transactions for your safety
              </p>
            </div>
          </div>
        </div>

        {/* Full Width: Description & Tabs */}
        <div className="lg:col-span-12 mt-8">
          <ProductDescriptionTabs product={tabsProduct} />
        </div>
      </div>
    </div>
  );
}
