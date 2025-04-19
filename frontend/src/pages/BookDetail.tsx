
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/lib/AppContext";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, ChevronLeft, Loader2, Heart } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogDescription
} from "@/components/ui/dialog";
import { CheckoutForm } from "@/components/CheckoutForm";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { books, addToCart, isLoading, user, createOrder } = useAppContext();
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container px-4 py-8 md:py-12 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
          <p className="text-muted-foreground text-center mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/books")}>Browse Books</Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(book.id);
  };
  
  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to purchase books",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (book.stock <= 0) {
      toast({
        title: "Out of stock",
        description: "This book is currently unavailable",
        variant: "destructive",
      });
      return;
    }
    
    setCheckoutOpen(true);
  };

  const handleCheckout = async (formData: any) => {
    setPurchasing(true);
    
    try {
      // Create a cart item just for this book
      const singleBookOrder = [{ bookId: book.id, quantity: 1 }];
      
      // Create the order with shipping details
      await createOrder(singleBookOrder, formData);
      
      // Close the dialog
      setCheckoutOpen(false);
      
      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and will be delivered soon!",
      });
      
      // Navigate to orders page
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your request.",
        variant: "destructive",
      });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8 md:py-12">
        <Link to="/books" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Books
        </Link>
        
        <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] gap-8">
          {/* Book Cover Image */}
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <p className="text-lg text-muted-foreground">{book.author}</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < book.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
                ))}
              </div>
              <span className="ml-2 text-muted-foreground">
                {book.rating} rating
              </span>
            </div>
            
            <div className="text-2xl font-bold">${book.price.toFixed(2)}</div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                Category: {book.category}
              </p>
              <p className="text-sm text-muted-foreground">
                Published: {new Date(book.publishDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="sm:flex-1 gap-2" 
                onClick={handleBuyNow}
                disabled={isLoading || purchasing || book.stock <= 0}
              >
                {purchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Buy Now
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="sm:flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={isLoading || book.stock <= 0}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Complete your purchase by filling out the shipping information below.
            </DialogDescription>
          </DialogHeader>
          
          <CheckoutForm 
            book={book} 
            onSubmit={handleCheckout} 
            isSubmitting={purchasing} 
          />
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default BookDetail;
