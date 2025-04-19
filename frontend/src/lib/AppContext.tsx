import React, { createContext, useContext, useEffect, useState } from "react";
import { Book, CartItem, User, Order, OrderStatus } from "./types";
import { books as initialBooks } from "./data";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (bookId: string, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateCartItemQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredBooks: Book[];
  purchaseBooks: () => Promise<string | null>;
  books: Book[];
  addBook: (book: Omit<Book, "id" | "rating" | "publishDate">) => string;
  createOrder: (items: CartItem[], shippingDetails?: any) => Promise<string>;
  orders: Order[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("bookstore-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedUser = localStorage.getItem("bookstore-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedOrders = localStorage.getItem("bookstore-orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookstore-cart", JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem("bookstore-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("bookstore-user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("bookstore-orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const savedBooks = localStorage.getItem("bookstore-books");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (bookId: string, quantity = 1) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.bookId === bookId);
        
        if (existingItem) {
          return prevCart.map((item) =>
            item.bookId === bookId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevCart, { bookId, quantity }];
        }
      });
      
      toast({
        title: "Added to cart",
        description: "Book has been added to your cart.",
      });
      
      setIsLoading(false);
    }, 500);
  };

  const removeFromCart = (bookId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
    
    toast({
      title: "Removed from cart",
      description: "Book has been removed from your cart.",
    });
  };

  const updateCartItemQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.bookId === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    const book = books.find((b) => b.id === item.bookId);
    return total + (book ? book.price * item.quantity : 0);
  }, 0);

  const createOrder = async (items: CartItem[], shippingDetails?: any): Promise<string> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to purchase books",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    if (items.length === 0) {
      toast({
        title: "Empty order",
        description: "Your order is empty",
        variant: "destructive",
      });
      throw new Error("Order is empty");
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderDate = new Date();
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(orderDate.getDate() + 5);
      
      const orderId = `order-${Date.now()}`;
      
      const itemsTotal = items.reduce((total, item) => {
        const book = books.find((b) => b.id === item.bookId);
        return total + (book ? book.price * item.quantity : 0);
      }, 0);
      
      const total = itemsTotal + 5 + (itemsTotal * 0.07);
      
      const newOrder: Order = {
        id: orderId,
        userId: user.id,
        items: [...items],
        total,
        status: "pending",
        createdAt: orderDate.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        shippingDetails,
      };
      
      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      toast({
        title: "Order placed successfully",
        description: "Your books will be delivered soon!",
      });
      
      return orderId;
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Failed to place order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseBooks = async (): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to purchase books",
        variant: "destructive",
      });
      return null;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const orderId = await createOrder(cart);
      clearCart();
      return orderId;
    } catch (error) {
      return null;
    }
  };

  const addBook = (book: Omit<Book, "id" | "rating" | "publishDate">) => {
    const newBook: Book = {
      ...book,
      id: `book-${Date.now()}`,
      rating: 0,
      publishDate: new Date().toISOString().split('T')[0],
    };
    
    setBooks(prevBooks => [...prevBooks, newBook]);
    
    localStorage.setItem("bookstore-books", JSON.stringify([...books, newBook]));
    
    return newBook.id;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        isLoading,
        searchQuery,
        setSearchQuery,
        filteredBooks,
        purchaseBooks,
        books,
        addBook,
        createOrder,
        orders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
