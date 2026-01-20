import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/theme-provider";
import { HomePage } from "@/components/HomePage";
import { AboutPage } from "@/components/AboutPage";
import { ClientAreaPage } from "@/components/ClientAreaPage";
import { Portfolio } from "@/components/Portfolio";
import { ContactPage } from "@/components/ContactPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { DownloadApp } from "@/components/DownloadApp";


function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {!isHomePage && <Header />}
      <Routes>
        <Route path="/" element={
          <>
            <HomePage />
            <DownloadApp />
          </>
        } />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/area-do-cliente" element={<ClientAreaPage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<HomePage />} /> {/* Fallback para a página inicial */}
      </Routes>
      {!isHomePage && <Footer />}
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
