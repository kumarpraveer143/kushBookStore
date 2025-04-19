import { Book, Order, OrderStatus, User } from "./types";

export const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=387&ixlib=rb-4.0.3",
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    category: "Fiction",
    stock: 25,
    rating: 4.5,
    publishDate: "1925-04-10",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.99,
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=388&ixlib=rb-4.0.3",
    description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.",
    category: "Fiction",
    stock: 18,
    rating: 4.8,
    publishDate: "1960-07-11",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    price: 11.99,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=387&ixlib=rb-4.0.3",
    description: "1984 is a dystopian novel by George Orwell published in 1949. The novel is set in Airstrip One, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation.",
    category: "Science Fiction",
    stock: 15,
    rating: 4.7,
    publishDate: "1949-06-08",
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 16.99,
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?auto=format&fit=crop&q=80&w=390&ixlib=rb-4.0.3",
    description: "The Hobbit is a children's fantasy novel by English author J. R. R. Tolkien. It follows the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.",
    category: "Fantasy",
    stock: 22,
    rating: 4.9,
    publishDate: "1937-09-21",
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 9.99,
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=429&ixlib=rb-4.0.3",
    description: "Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.",
    category: "Romance",
    stock: 20,
    rating: 4.6,
    publishDate: "1813-01-28",
  },
  {
    id: "6",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 13.99,
    coverImage: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&q=80&w=440&ixlib=rb-4.0.3",
    description: "The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. It is a story of post-World War II alienation told by angst-ridden 16-year-old Holden Caulfield.",
    category: "Fiction",
    stock: 12,
    rating: 4.3,
    publishDate: "1951-07-16",
  },
];

export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

export const orders: Order[] = [
  {
    id: "order1",
    userId: "1",
    items: [
      { bookId: "1", quantity: 1 },
      { bookId: "3", quantity: 2 },
    ],
    total: 36.97,
    status: "shipped",
    createdAt: "2023-10-05T10:30:00Z",
    estimatedDelivery: "2023-10-10T10:30:00Z",
  },
  {
    id: "order2",
    userId: "1",
    items: [
      { bookId: "2", quantity: 1 },
    ],
    total: 14.99,
    status: "delivered",
    createdAt: "2023-09-15T14:20:00Z",
    estimatedDelivery: "2023-09-20T14:20:00Z",
  },
];

// Helper functions
export function getBookById(id: string, customBooks?: Book[]): Book | undefined {
  // If custom books array is provided, use it, otherwise use default books
  const booksToSearch = customBooks || books;
  return booksToSearch.find(book => book.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function getOrdersByUserId(userId: string): Order[] {
  return orders.filter(order => order.userId === userId);
}

// Function to get the next order status
export function getNextOrderStatus(current: OrderStatus): OrderStatus | null {
  const statuses: OrderStatus[] = ["pending", "processing", "shipped", "out-for-delivery", "delivered"];
  const currentIndex = statuses.indexOf(current);
  
  if (currentIndex === -1 || currentIndex === statuses.length - 1) {
    return null;
  }
  
  return statuses[currentIndex + 1];
}

// Function to calculate delivery progress percentage
export function calculateOrderProgress(status: OrderStatus): number {
  const statuses: OrderStatus[] = ["pending", "processing", "shipped", "out-for-delivery", "delivered"];
  const currentIndex = statuses.indexOf(status);
  
  if (currentIndex === -1) {
    return 0;
  }
  
  return Math.round((currentIndex / (statuses.length - 1)) * 100);
}

// In a real application, these functions would interact with a backend API
export function addOrder(order: Order): void {
  // This is just for demo purposes - in a real app this would be a backend API call
  orders.push(order);
}
