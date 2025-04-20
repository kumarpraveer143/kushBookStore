import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/lib/AppContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrderProgress } from "@/components/OrderProgress";
import { useToast } from "@/hooks/use-toast";
import { getBookById } from "@/lib/data";
import axios from "axios";

const Profile = () => {
  const { user, setUser, orders } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  if (!user) {
    navigate("/login");
    return null;
  }

  // Filter orders for the current user
  const userOrders = orders.filter((order) => order.userId === user.id);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    setUser({
      ...user,
      name,
      email,
    });

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleSignOut = async () => {
    try {
      await axios.post("http://localhost:3000/api/user/logout", null, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="container px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="text-xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Your Orders</h2>

                {userOrders.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-lg border">
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't placed any orders yet.
                    </p>
                    <Button onClick={() => navigate("/books")}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((order) => {
                      const items = order.items
                        .map((item) => {
                          const book = getBookById(item.bookId);
                          return { ...item, book };
                        })
                        .filter((item) => item.book);

                      return (
                        <div
                          key={order.id}
                          className="bg-card rounded-lg border overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                              <div>
                                <h3 className="font-semibold">
                                  Order #{order.id}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Placed on{" "}
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <p className="font-medium">
                                  ${order.total.toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {order.items.reduce(
                                    (total, item) => total + item.quantity,
                                    0
                                  )}{" "}
                                  items
                                </p>
                              </div>
                            </div>

                            <div className="mb-6">
                              <h4 className="text-sm font-medium mb-2">
                                Delivery Status
                              </h4>
                              <OrderProgress status={order.status} />
                            </div>

                            {/* Display order items */}
                            <div className="space-y-4 my-6">
                              <h4 className="text-sm font-medium">
                                Order Items
                              </h4>
                              {items.map((item) => (
                                <div key={item.bookId} className="flex gap-4">
                                  <div className="shrink-0">
                                    <img
                                      src={item.book!.coverImage}
                                      alt={item.book!.title}
                                      className="w-12 h-16 object-cover rounded-md"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-medium">
                                      {item.book!.title}
                                    </h5>
                                    <p className="text-sm text-muted-foreground">
                                      {item.book!.author}
                                    </p>
                                    <p className="text-sm">
                                      ${item.book!.price.toFixed(2)} ×{" "}
                                      {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Display shipping information if available */}
                            {order.shippingDetails && (
                              <div className="border-t pt-4 mt-4">
                                <h4 className="text-sm font-medium mb-2">
                                  Shipping Information
                                </h4>
                                <div className="text-sm space-y-1">
                                  <p>{order.shippingDetails.name}</p>
                                  <p>{order.shippingDetails.address}</p>
                                  <p>
                                    {order.shippingDetails.city},{" "}
                                    {order.shippingDetails.state}{" "}
                                    {order.shippingDetails.zipCode}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {order.shippingDetails.email}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                              <div>
                                <p className="text-sm">
                                  <span className="text-muted-foreground">
                                    Estimated delivery:{" "}
                                  </span>
                                  {new Date(
                                    order.estimatedDelivery
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/orders")}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Account Settings</h2>

                <div className="bg-card rounded-lg border p-6">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Password changes are disabled in this demo.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="submit">Save Changes</Button>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="addresses">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Your Addresses</h2>

                <div className="text-center py-12 bg-card rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">No addresses yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't added any addresses yet.
                  </p>
                  <Button>Add New Address</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
