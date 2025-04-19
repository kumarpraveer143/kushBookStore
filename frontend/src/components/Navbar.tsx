
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search,
  LogOut,
  BookPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/AppContext";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, cart, setUser, searchQuery, setSearchQuery } = useAppContext();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleLogout = () => {
    setUser(null);
    toggleMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BookStore</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/books" className="text-sm font-medium hover:text-primary transition-colors">
            Books
          </Link>
          {user && (
            <Link to="/add-book" className="text-sm font-medium hover:text-primary transition-colors">
              Add Book
            </Link>
          )}
          {user && (
            <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">
              My Orders
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="relative">
              <Input
                type="search"
                placeholder="Search books..."
                className="w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={toggleSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full p-0">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <ThemeToggle />
          
          {user ? (
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={toggleMenu}>
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BookStore</span>
            </Link>
            
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="container grid gap-6 pb-8 pt-6 md:pb-12 md:pt-10">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/books" className="flex items-center gap-2 text-lg font-semibold" onClick={toggleMenu}>
              Books
            </Link>
            {user && (
              <Link to="/add-book" className="flex items-center gap-2 text-lg font-semibold" onClick={toggleMenu}>
                <BookPlus className="h-5 w-5" />
                Add Book
              </Link>
            )}
            <Link to="/cart" className="flex items-center gap-2 text-lg font-semibold" onClick={toggleMenu}>
              Cart
              {cartItemsCount > 0 && (
                <Badge variant="destructive">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-lg font-semibold" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-2 text-lg font-semibold" onClick={toggleMenu}>
                  My Orders
                </Link>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-lg font-semibold" onClick={toggleMenu}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
