import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAppContext } from "@/lib/AppContext";
import { AddBookForm } from "@/components/AddBookForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookPlus } from "lucide-react";

const AddBook = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow container px-4 py-8 md:py-12 flex flex-col items-center justify-center">
          <BookPlus className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            You need to be logged in to add books to the marketplace.
          </p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-2">Add a New Book</h1>
        <p className="text-muted-foreground mb-8">
          Fill out the form below to add your book to our marketplace
        </p>

        <div className="bg-card rounded-lg border p-6 mb-8">
          <AddBookForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddBook;
