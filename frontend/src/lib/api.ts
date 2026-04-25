// 백엔드 API 클라이언트 (tRPC 대신 fetch 사용)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/trpc';

export const api = {
  // Books API
  books: {
    list: async () => {
      const response = await fetch(`${API_URL}/books.list`);
      return response.json();
    },
    search: async (query: string) => {
      const response = await fetch(`${API_URL}/books.search?query=${encodeURIComponent(query)}`);
      return response.json();
    },
    getByCategory: async (category: string) => {
      const response = await fetch(`${API_URL}/books.getByCategory?category=${encodeURIComponent(category)}`);
      return response.json();
    },
  },
  
  // Rentals API
  rentals: {
    list: async () => {
      const response = await fetch(`${API_URL}/rentals.list`);
      return response.json();
    },
    rent: async (bookId: string) => {
      const response = await fetch(`${API_URL}/rentals.rent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      return response.json();
    },
    return: async (rentalId: string) => {
      const response = await fetch(`${API_URL}/rentals.return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rentalId }),
      });
      return response.json();
    },
  },
  
  // Reviews API
  reviews: {
    list: async (bookId: string) => {
      const response = await fetch(`${API_URL}/reviews.list?bookId=${encodeURIComponent(bookId)}`);
      return response.json();
    },
    add: async (bookId: string, rating: number, content: string) => {
      const response = await fetch(`${API_URL}/reviews.add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, rating, content }),
      });
      return response.json();
    },
  },
  
  // Recommendations API
  recommendations: {
    list: async () => {
      const response = await fetch(`${API_URL}/recommendations.list`);
      return response.json();
    },
    add: async (bookId: string, reason: string) => {
      const response = await fetch(`${API_URL}/recommendations.add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, reason }),
      });
      return response.json();
    },
  },
  
  // Wishlist API
  wishlist: {
    list: async () => {
      const response = await fetch(`${API_URL}/wishlist.list`);
      return response.json();
    },
    toggle: async (bookId: string) => {
      const response = await fetch(`${API_URL}/wishlist.toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      return response.json();
    },
  },
};
