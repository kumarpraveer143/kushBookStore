
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAppContext } from "@/lib/AppContext";
import { BookOpen, Search, ShoppingCart } from "lucide-react";
import { books } from "@/lib/data";

const Index = () => {
  const { filteredBooks, addToCart } = useAppContext();
  const featuredBooks = books.slice(0, 3);
  const newReleases = books.slice(3, 6);

  const handleAddToCart = (bookId: string) => {
    addToCart(bookId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/10 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter animate-fade-in">
                  Discover Your Next Favorite Book
                </h1>
                <p className="text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  Browse our extensive collection of books from all genres. From bestsellers to hidden gems, find the perfect read for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <Link to="/books">
                    <Button size="lg" className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      Browse Books
                    </Button>
                  </Link>
                  <Link to="/books">
                    <Button variant="outline" size="lg" className="gap-2">
                      <Search className="h-5 w-5" />
                      Search Books
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:block animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-book-primary/30 to-book-accent/30 mix-blend-multiply rounded-lg" />
                  <div className="grid grid-cols-2 gap-4 p-6 h-full">
                    {featuredBooks.slice(0, 2).map((book) => (
                      <div key={book.id} className="relative aspect-[2/3] rotate-3 hover:rotate-0 transition-transform">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover rounded-md shadow-xl"
                        />
                      </div>
                    ))}
                    {featuredBooks.slice(2, 3).map((book) => (
                      <div key={book.id} className="absolute bottom-10 right-10 rotate-6 hover:rotate-0 transition-transform">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-40 w-32 object-cover rounded-md shadow-xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Books Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Books</h2>
              <Link to="/books">
                <Button variant="link">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {filteredBooks.slice(0, 6).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="bg-card py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Fiction", "Science Fiction", "Fantasy", "Romance"].map((category) => (
                <Link 
                  key={category} 
                  to={`/books?category=${category.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-lg aspect-video"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-book-secondary/80 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white">{category}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* New Releases Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">New Releases</h2>
              <Link to="/books">
                <Button variant="link">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newReleases.map((book) => (
                <div key={book.id} className="flex gap-4 items-start">
                  <Link to={`/books/${book.id}`} className="shrink-0">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-md"
                    />
                  </Link>
                  <div className="space-y-2">
                    <Link to={`/books/${book.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">{book.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-sm font-medium">${book.price.toFixed(2)}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleAddToCart(book.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
