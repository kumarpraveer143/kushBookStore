
import { Book } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  const { addToCart, isLoading } = useAppContext();

  return (
    <Card className={cn("h-full flex flex-col overflow-hidden transition-all hover:shadow-md", className)}>
      <Link to={`/books/${book.id}`} className="overflow-hidden">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            ${book.price.toFixed(2)}
          </div>
        </div>
      </Link>
      <CardContent className="flex-grow pt-4">
        <Link to={`/books/${book.id}`}>
          <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm">{book.rating}</span>
          <span className="text-xs text-muted-foreground ml-2">({book.category})</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="default" 
          size="sm" 
          className="w-full"
          onClick={() => addToCart(book.id)}
          disabled={isLoading}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
