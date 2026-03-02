"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Shield,
  CheckCircle,
  User,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: string; // Changed from number to string to match what you're passing
  author: string;
  rating: number;
  date: string;
  comment: string; // This is what you're passing from product-page-client
  reply?: string; // Added optional reply field
}

interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: Review[];
  hasMoreReviews?: boolean; // Added these fields you're passing
  loadingMoreReviews?: boolean;
  onLoadMore?: () => void;
}

interface Feature {
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface Product {
  id: string;
  name: string;
  longDescription: string;
  features: Feature[];
  youtubeVideoId?: string;
  reviewsData: ReviewsData;
}

interface ProductDescriptionTabsProps {
  product: Product;
}

export function ProductDescriptionTabs({
  product,
}: ProductDescriptionTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "features", label: "Features" },
    { id: "reviews", label: "Reviews" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRatingPercentage = (rating: number) => {
    if (product.reviewsData.totalReviews === 0) return 0;
    return (
      (product.reviewsData.ratingBreakdown[
        rating as keyof typeof product.reviewsData.ratingBreakdown
      ] /
        product.reviewsData.totalReviews) *
      100
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-theme-secondary p-1 rounded-lg border border-theme">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-accent text-white shadow-lg"
                : "text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary"
            }`}
          >
            {tab.label}
            {tab.id === "reviews" && (
              <span className="ml-2 text-xs opacity-75">
                ({product.reviewsData.totalReviews})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-theme bg-theme-secondary p-6 sm:p-8 shadow-theme">
        {activeTab === "description" && (
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl heading-semibold text-theme-primary mb-4">
              About {product.name}
            </h3>

            {/* YouTube Video for Wave product */}
            {product.youtubeVideoId && (
              <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${product.youtubeVideoId}`}
                    title={`${product.name} Showcase`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              {/* Render markdown -> sanitized HTML on the client */}
              <MarkdownDescription text={product.longDescription} />
            </div>
          </div>
        )}

        {activeTab === "features" && (
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl heading-bold text-theme-primary mb-2">
                Powerful <span className="text-accent">Features</span>
              </h3>
              <p className="text-theme-secondary text-sm">
                Everything you need for the ultimate gaming experience
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {product.features.length > 0 ? (
                product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative glass border border-white/5 hover:border-accent/30 rounded-xl p-5 transition-all duration-300 hover-lift overflow-hidden"
                  >
                    {/* Gradient glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Animated border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

                    <div className="relative flex items-start gap-4">
                      {/* Icon container with glow */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-accent/30 rounded-lg blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-all duration-300 group-hover:scale-110">
                          {feature.icon ? (
                            <feature.icon className="w-6 h-6 text-accent" />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-accent" />
                          )}
                        </div>
                      </div>

                      {/* Feature text */}
                      <div className="flex-1 min-w-0 pt-1 space-y-1">
                        <h4 className="text-theme-primary text-base sm:text-lg font-bold group-hover:text-white transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="text-theme-secondary text-sm leading-relaxed group-hover:text-theme-primary transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>

                      {/* Subtle check mark indicator */}
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 glass rounded-xl border border-white/5">
                  <Shield className="w-12 h-12 text-accent/50 mx-auto mb-4" />
                  <p className="text-theme-secondary text-sm">
                    No specific features listed for this product.
                  </p>
                </div>
              )}
            </div>

            {/* Feature count badge */}
            {product.features.length > 0 && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-semibold">
                    {product.features.length} Premium Features Included
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl heading-semibold text-theme-primary mb-6">
                Customer Reviews
              </h3>

              {product.reviewsData.totalReviews > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="text-4xl font-bold text-theme-primary">
                          {product.reviewsData.averageRating}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i <
                                Math.floor(product.reviewsData.averageRating)
                                  ? "text-accent fill-accent"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-theme-secondary text-sm">
                        Based on {product.reviewsData.totalReviews} reviews
                      </p>
                    </div>

                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-theme-secondary w-8">
                            {rating} ★
                          </span>
                          <Progress
                            value={getRatingPercentage(rating)}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-theme-secondary w-12 text-right">
                            {
                              product.reviewsData.ratingBreakdown[
                                rating as keyof typeof product.reviewsData.ratingBreakdown
                              ]
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-lg heading-semibold text-theme-primary">
                      Recent Reviews
                    </h4>

                    {product.reviewsData.recentReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-theme rounded-lg p-6 bg-theme-tertiary"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-theme-primary font-medium">
                                  {review.author}
                                </span>
                                <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span className="text-green-500 text-xs">
                                    Verified
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-accent fill-accent"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-theme-secondary text-xs">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-theme-secondary text-sm leading-relaxed">
                            {review.comment}
                          </p>
                          {review.reply && (
                            <div className="mt-4 p-3 bg-theme-primary rounded-lg">
                              <p className="text-theme-secondary text-sm">
                                <span className="font-medium text-theme-primary">
                                  Store Reply:
                                </span>{" "}
                                {review.reply}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {product.reviewsData.hasMoreReviews && (
                      <div className="text-center pt-6">
                        <Button
                          onClick={product.reviewsData.onLoadMore}
                          disabled={product.reviewsData.loadingMoreReviews}
                          variant="ghost"
                          className="text-theme-secondary hover:text-primary hover:bg-primary-10 h-10 px-6"
                        >
                          {product.reviewsData.loadingMoreReviews ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3B82F6]"></div>
                              Loading more reviews...
                            </div>
                          ) : (
                            "Load More Reviews"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-theme-secondary/50 mx-auto mb-4" />
                  <h4 className="text-theme-primary text-lg font-medium mb-2">
                    No Reviews Yet
                  </h4>
                  <p className="text-theme-secondary mb-6">
                    Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Small client-side component to parse Markdown and sanitize the resulting HTML.
function MarkdownDescription({ text }: { text?: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function parseAndSanitize() {
      try {
        const [{ marked }, DOMPurifyModule] = await Promise.all([
          import("marked"),
          import("dompurify"),
        ]);

        marked.setOptions({
          breaks: true,
          gfm: true,
        });

        const DOMPurify = (DOMPurifyModule as any).default || DOMPurifyModule;

        const parsed = await marked.parse(text || "");
        const sanitized = DOMPurify.sanitize(parsed);

        if (mounted) setHtml(sanitized);
      } catch (err) {
        console.warn("Failed to load markdown/sanitizer libs", err);
        if (mounted) setHtml(text || "");
      }
    }

    parseAndSanitize();

    return () => {
      mounted = false;
    };
  }, [text]);

  if (!html) {
    // Render a plain paragraph while loading
    return (
      <p className="text-theme-secondary text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    );
  }

  return (
    <div
      className="markdown-content text-theme-secondary text-sm sm:text-base leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-theme-primary [&>h1]:mb-3 [&>h1]:mt-6 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-theme-primary [&>h2]:mb-3 [&>h2]:mt-5 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-theme-primary [&>h3]:mb-2 [&>h3]:mt-4 [&>ul]:mb-4 [&>ul]:ml-6 [&>ul]:list-disc [&>ul>li]:mb-1 [&>ol]:mb-4 [&>ol]:ml-6 [&>ol]:list-decimal [&>ol>li]:mb-1 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-accent/80 [&_a]:transition-colors [&_img]:max-w-2xl [&_img]:w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4 [&_img]:border [&_img]:border-white/10 [&>code]:bg-theme-tertiary [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:text-theme-primary [&>pre]:bg-theme-tertiary [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>blockquote]:border-l-4 [&>blockquote]:border-accent/30 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-theme-secondary/80 [&>blockquote]:mb-4"
      style={{
        unicodeBidi: "normal",
        fontFamily:
          'inherit, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      }}
      // sanitized HTML from Markdown
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
