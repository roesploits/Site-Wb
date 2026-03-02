import { UnifiedNavbar } from "@/components/unified-navbar";
import { ProductsPageClient } from "@/components/products-page-client";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-theme-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-accent rounded-full blur-[150px] opacity-10 -glow"></div>

      <UnifiedNavbar />

      <main className="container mx-auto pt-24 pb-16 px-4 sm:px-6 relative z-10">
        <ProductsPageClient />
      </main>
    </div>
  );
}
