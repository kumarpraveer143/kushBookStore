import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "@/lib/AppContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const bookSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  author: z.string().min(2, { message: "Author name required" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  description: z.string().min(10, { message: "Description too short" }),
  category: z.string().min(1, { message: "Category is required" }),
  coverImage: z.string().url({ message: "Valid image URL required" }),
  stock: z.coerce
    .number()
    .int()
    .positive({ message: "Stock must be positive" }),
});

type BookFormValues = z.infer<typeof bookSchema>;

export function AddBookForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, addBook } = useAppContext();
  const navigate = useNavigate();

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      price: 0,
      description: "",
      category: "",
      coverImage: "",
      stock: 1,
    },
  });

  const onSubmit = async (values: BookFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add books",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add a small delay to simulate API call

      // Make sure all required fields are present when calling addBook
      const newBookId = addBook({
        title: values.title,
        author: values.author,
        price: values.price,
        description: values.description,
        category: values.category,
        coverImage: values.coverImage,
        stock: values.stock,
      });

      const formData = {
        title: values.title,
        author: values.author,
        price: values.price,
        description: values.description,
        category: values.category,
        coverImage: values.coverImage,
        stock: values.stock,
      };

      const res = await axios.post(
        "http://localhost:3000/api/book/addBook",
        formData,
        { withCredentials: true }
      );

      console.log(res.data);

      // console.log("New book created:", {
      //   ...values,
      //   id: newBookId,
      //   rating: 0,
      //   publishDate: new Date().toISOString().split('T')[0],
      // });

      toast({
        title: "Book added successfully",
        description: "Your book has been added to the marketplace",
      });

      // Reset form and redirect
      form.reset();
      navigate("/books");
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Failed to add book",
        description: "There was a problem adding your book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Fiction, Sci-Fi, Fantasy, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Available</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a description of the book"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Book..." : "Add Book to Marketplace"}
        </Button>
      </form>
    </Form>
  );
}
