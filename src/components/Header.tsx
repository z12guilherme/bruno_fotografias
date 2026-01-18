import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Instagram, Facebook, Search, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [    
    { label: "INÍCIO", href: "/" },
    { label: "SOBRE", href: "/sobre" },
    { label: "PORTFÓLIO", href: "/portfolio" },
    { label: "CONTATO", href: "/contato" },
    { label: "ÁREA DO CLIENTE", href: "/area-do-cliente" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold tracking-wider">
              <span className="text-foreground">BRUNO</span>
              <span className="text-primary">NASCIMENTO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary ${
                      isActive && item.href !== "/" && !item.href.includes("#") // Only highlight if it's a full page route, not a hash link on home
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
          
          {/* Admin Icon (Desktop) */}
          <div className="hidden lg:flex items-center ml-4 border-l pl-4 border-gray-200">
             <Link to="/admin/login" title="Área Administrativa">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Lock className="h-4 w-4" /></Button>
             </Link>
          </div>

          {/* Social Icons & Search */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            {menuItems.map((item) =>
              item.external ? (
                <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 text-sm font-medium transition-colors hover:text-primary ${
                      isActive && item.href !== "/" && !item.href.includes("#") // Only highlight if it's a full page route, not a hash link on home
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            <Link 
              to="/admin/login" 
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
              <Lock className="h-4 w-4 mr-2" /> ÁREA ADMINISTRATIVA
            </Link>
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-border">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
