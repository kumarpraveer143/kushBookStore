
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/AppContext";
import { getBookById } from "@/lib/data";
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight, Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, clearCart, purchaseBooks, isLoading, user } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const cartItems = cart.map(item => {
    const book = getBookById(item.bookId);
    return {
      ...item,
      book,
    };
  }).filter(item => item.book);
  
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
      });
      navigate("/login");
      return;
    }
    
    setIsProcessing(true);
    try {
      const orderId = await purchaseBooks();
      if (orderId) {
        navigate("/orders");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container px-4 py-8 md:py-12">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any books to your cart yet.
              </p>
              <Link to="/books">
                <Button>Browse Books</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_350px] gap-8">
              {/* Cart Items */}
              <div>
                <div className="space-y-6">
                  {cartItems.map(item => {
                    const book = item.book!;
                    const itemTotal = book.price * item.quantity;
                    
                    return (
                      <div key={book.id} className="flex gap-4 py-4 border-b">
                        <Link to={`/books/${book.id}`} className="shrink-0">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-24 h-32 object-cover rounded-md"
                          />
                        </Link>
                        
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                          <div>
                            <Link to={`/books/${book.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors">{book.title}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <p className="text-sm font-medium mt-1">${book.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex flex-col gap-2 items-start md:items-end">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartItemQuantity(book.id, item.quantity - 1)}
                                disabled={item.quantity === 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartItemQuantity(book.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <p className="font-medium">${itemTotal.toFixed(2)}</p>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2 h-8"
                              onClick={() => removeFromCart(book.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Link to="/books">
                    <Button variant="ghost">Continue Shopping</Button>
                  </Link>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-card rounded-lg border p-6">
                  <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>$5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(cartTotal * 0.07).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>Total</span>
                    <span>${(cartTotal + 5 + cartTotal * 0.07).toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Promo Code</h3>
                      <div className="flex gap-2">
                        <Input placeholder="Enter code" />
                        <Button variant="outline">Apply</Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    
                    {!user && (
                      <p className="text-xs text-center text-muted-foreground">
                        You'll need to sign in to complete your purchase
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
