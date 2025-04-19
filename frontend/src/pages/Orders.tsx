
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAppContext } from "@/lib/AppContext";
import { useNavigate } from "react-router-dom";
import { getBookById } from "@/lib/data";
import { OrderProgress } from "@/components/OrderProgress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClipboardList } from "lucide-react";

const Orders = () => {
  const { user, orders } = useAppContext();
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  // Filter orders for the current user
  const userOrders = orders.filter(order => order.userId === user.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container px-4 py-8 md:py-12">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          
          {userOrders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ClipboardList className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet.
              </p>
              <Button onClick={() => navigate("/books")}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {userOrders.map((order) => {
                const items = order.items.map(item => {
                  const book = getBookById(item.bookId);
                  return { ...item, book };
                }).filter(item => item.book);
                
                return (
                  <div key={order.id} className="bg-card rounded-lg border overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-6">
                        <div>
                          <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.reduce((total, item) => total + item.quantity, 0)} items
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Delivery Status</h3>
                        <OrderProgress status={order.status} />
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium mb-2">Order Items</h3>
                        
                        {items.map(item => (
                          <div key={item.bookId} className="flex gap-4">
                            <div className="shrink-0">
                              <img
                                src={item.book!.coverImage}
                                alt={item.book!.title}
                                className="w-12 h-16 object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.book!.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.book!.author}</p>
                              <p className="text-sm">
                                ${item.book!.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {order.shippingDetails && (
                        <>
                          <Separator className="my-6" />
                          
                          <div>
                            <h3 className="text-sm font-medium mb-2">Shipping Information</h3>
                            <div className="text-sm">
                              <p>{order.shippingDetails.name}</p>
                              <p>{order.shippingDetails.address}</p>
                              <p>{order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zipCode}</p>
                              <p className="text-muted-foreground">{order.shippingDetails.email}</p>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between items-center mt-6">
                        <div>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Estimated delivery: </span>
                            {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
