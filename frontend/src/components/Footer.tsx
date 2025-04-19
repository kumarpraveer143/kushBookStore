
import { BookOpen, Heart, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full py-6 md:py-12 border-t bg-card">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BookStore</span>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Your one-stop destination for all kinds of books. Browse, order, and enjoy reading.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/books" className="text-sm hover:text-primary transition-colors">
                Books
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-sm hover:text-primary transition-colors">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-sm hover:text-primary transition-colors">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Help & Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/contact" className="text-sm hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-sm hover:text-primary transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Subscribe to our newsletter for updates on new releases and special offers.
          </p>
        </div>
      </div>
      
      <div className="container mt-8 pt-6 border-t">
        <p className="text-sm text-center text-muted-foreground">
          © {new Date().getFullYear()} BookStore. All rights reserved. Made with <Heart className="h-4 w-4 inline text-destructive" /> for book lovers.
        </p>
      </div>
    </footer>
  );
}
