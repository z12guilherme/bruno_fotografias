import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/theme-provider";
import { HomePage } from "@/components/HomePage";
import { AboutPage } from "@/components/AboutPage";
import { ClientAreaPage } from "@/components/ClientAreaPage";
import { PortfolioCategoriesPage } from "@/components/PortfolioCategoriesPage";
import { PortfolioCategoryDetail } from "@/components/PortfolioCategoryDetail";
import { ContactPage } from "@/components/ContactPage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/area-do-cliente" element={<ClientAreaPage />} />
        <Route path="/portfolio" element={<PortfolioCategoriesPage />} />
        <Route path="/portfolio/:categoryName" element={<PortfolioCategoryDetail />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="*" element={<HomePage />} /> {/* Fallback para a página inicial */}
      </Routes>
      <Footer />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
