import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAppContext } from "@/lib/AppContext";
import { Search, FilterX } from "lucide-react";

const Books = () => {
  const { filteredBooks, searchQuery, setSearchQuery, books } = useAppContext();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get all unique categories from the actual books list
  const categories = Array.from(new Set(books.map((book) => book.category)));

  // Find max price from the actual books
  const maxPrice = Math.max(...books.map((book) => book.price), 100);

  const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Reset price range when max price changes
  useEffect(() => {
    setPriceRange([priceRange[0], maxPrice]);
  }, [maxPrice]);

  // Apply all filters and sorting
  const filteredAndSortedBooks = filteredBooks
    .filter((book) =>
      categoryFilter !== "all" ? book.category === categoryFilter : true
    )
    .filter(
      (book) => book.price >= priceRange[0] && book.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, maxPrice]);
    setSortBy("relevance");
    setSearchQuery("");
  };

  const hasActiveFilters =
    categoryFilter !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    searchQuery !== "" ||
    sortBy !== "relevance";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="container px-4 py-8 md:py-12">
          <h1 className="text-3xl font-bold mb-8">Browse Books</h1>

          <div className="grid md:grid-cols-[250px_1fr] gap-8">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search books..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Category</h3>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-4">Price Range</h3>
                <Slider
                  value={priceRange}
                  min={0}
                  max={maxPrice}
                  step={1}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${priceRange[0].toFixed(2)}</span>
                  <span>${priceRange[1].toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low-high">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high-low">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={resetFilters}
                >
                  <FilterX className="h-4 w-4" />
                  Reset Filters
                </Button>
              )}
            </div>

            {/* Books Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">
                  {filteredAndSortedBooks.length} Results
                </h2>
              </div>

              {filteredAndSortedBooks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No books found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query.
                  </p>
                  <Button onClick={resetFilters}>Reset All Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredAndSortedBooks.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Books;
