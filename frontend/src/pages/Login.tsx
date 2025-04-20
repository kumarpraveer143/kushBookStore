import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/lib/AppContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { users } from "@/lib/data";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const user = {
      email,
      password,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/login",
        user,
        {
          withCredentials: true,
        }
      );

      if (res.data.success == true) {
        const { fullName: name, email, password } = res.data.message;
        const newUser: User = {
          id: "kuch",
          name,
          email,
          password,
        };
        setUser(newUser);
        toast({
          title: "Welcome back!",
          description: `You have successfully signed in as ${res.data.message.fullName}.`,
        });
        navigate("/");
      }

      console.log("Login successful:", res.data.success);
      // redirect or show success
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }

    // For demonstration, we'll just use a mock user
    // setTimeout(() => {
    //   const matchedUser = users.find(
    //     (user) => user.email.toLowerCase() === email.toLowerCase()
    //   );

    //   if (matchedUser && password === "password") {
    //     setUser(matchedUser);
    //     toast({
    //       title: "Welcome back!",
    //       description: `You have successfully signed in as ${matchedUser.name}.`,
    //     });
    //     navigate("/");
    //   } else {
    //     toast({
    //       title: "Login failed",
    //       description:
    //         "Invalid email or password. Try using john@example.com with password 'password'.",
    //       variant: "destructive",
    //     });
    //   }

    //   setIsLoading(false);
    // }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newUser = {
      fullName,
      email,
      password,
    };
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/register",
        newUser,
        {
          withCredentials: true,
        }
      );
      console.log("Signup successful:", res.data);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
    }

    // For demonstration purposes
    // setTimeout(() => {
    //   const newUser = {
    //     name,
    //     email,
    //   };

    //   setUser(newUser);
    //   toast({
    //     title: "Account created!",
    //     description: "Your account has been successfully created.",
    //   });
    //   navigate("/");

    //   setIsLoading(false);
    // }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="container flex items-center justify-center py-12">
          <div className="mx-auto max-w-[450px] w-full px-4 md:px-0">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground mt-2">
                  Sign in to your account or create a new one
                </p>
              </div>

              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="p-0 h-auto text-xs">
                          Forgot Password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                      <p>Demo credentials:</p>
                      <p>Email: john@example.com</p>
                      <p>Password: password</p>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form className="space-y-4" onSubmit={handleSignup}>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your name"
                        value={fullName}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
