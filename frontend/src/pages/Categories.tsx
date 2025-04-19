
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/AppContext";
import { ArrowLeft } from "lucide-react";

const Categories = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { filteredBooks, setSearchQuery } = useAppContext();
  
  // Reset search query when viewing by category
  useEffect(() => {
    setSearchQuery("");
  }, [category, setSearchQuery]);

  // Filter books by the current category
  const categoryBooks = filteredBooks.filter(
    book => book.category.toLowerCase() === category?.toLowerCase()
  );

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold capitalize">{category} Books</h1>
        </div>
        
        {categoryBooks.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No books found in this category</h3>
            <p className="text-muted-foreground mb-6">Try browsing all books instead.</p>
            <Button onClick={() => navigate("/books")}>Browse All Books</Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Found {categoryBooks.length} books in the {category} category
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
