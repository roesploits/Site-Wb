import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import PartnersPage from "./pages/PartnersPage";
import PolicyPage from "./pages/PolicyPage";
import { Footer } from "./components/footer";
import { ScrollToTop } from "./components/scroll-to-top";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/policy" element={<PolicyPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
