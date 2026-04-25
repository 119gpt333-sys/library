export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  description: string;
  genre: string;
  rating: number;
  reviewCount: number;
  coverEmoji: string;
  coverColor: string;
  isAvailable: boolean;
  availableCopies: number;
  totalCopies: number;
  isNew?: boolean;
}

export const BOOKS: Book[] = [
  {
    id: "1",
    title: "제식주의자",
    author: "한강",
    publisher: "창비",
    publishedYear: 2007,
    description: "한강의 대표작으로, 현대 사회의 소외와 고독을 섬세하게 그려낸 소설입니다.",
    genre: "소설",
    rating: 4.7,
    reviewCount: 1250,
    coverEmoji: "🌿",
    coverColor: "#D4F1D4",
    isAvailable: true,
    availableCopies: 3,
    totalCopies: 5,
  },
  {
    id: "2",
    title: "82년생 김지영",
    author: "조남주",
    publisher: "민음사",
    publishedYear: 2020,
    description: "여성의 삶을 통해 한국 사회의 구조적 문제를 날카롭게 드러내는 소설입니다.",
    genre: "소설",
    rating: 4.5,
    reviewCount: 2100,
    coverEmoji: "👩",
    coverColor: "#FFD4E5",
    isAvailable: true,
    availableCopies: 2,
    totalCopies: 4,
    isNew: true,
  },
  {
    id: "3",
    title: "코스모스",
    author: "칼 세이건",
    publisher: "사이언스북스",
    publishedYear: 1980,
    description: "우주의 신비와 과학의 경이로움을 아름답게 설명하는 과학 에세이입니다.",
    genre: "과학",
    rating: 4.8,
    reviewCount: 890,
    coverEmoji: "🌌",
    coverColor: "#E6F3FF",
    isAvailable: true,
    availableCopies: 1,
    totalCopies: 3,
  },
  {
    id: "4",
    title: "어린 왕자",
    author: "생텍쥐페리",
    publisher: "문학동네",
    publishedYear: 1943,
    description: "어린 왕자의 여행을 통해 인생의 의미를 깨닫게 하는 아름다운 우화입니다.",
    genre: "동화",
    rating: 4.9,
    reviewCount: 3200,
    coverEmoji: "🌹",
    coverColor: "#FFF4E6",
    isAvailable: false,
    availableCopies: 0,
    totalCopies: 3,
    isNew: true,
  },
  {
    id: "5",
    title: "달러구트 꿈 백화점",
    author: "이미예",
    publisher: "팬덤북스",
    publishedYear: 2020,
    description: "꿈을 파는 백화점에서 벌어지는 따뜻한 이야기들을 담은 소설입니다.",
    genre: "소설",
    rating: 4.6,
    reviewCount: 1850,
    coverEmoji: "🏪",
    coverColor: "#FFE6F0",
    isAvailable: true,
    availableCopies: 2,
    totalCopies: 4,
  },
  {
    id: "6",
    title: "1984",
    author: "조지 오웰",
    publisher: "문예출판사",
    publishedYear: 1949,
    description: "전체주의 사회를 그린 디스토피아 소설로, 현대에도 여전히 의미 있는 작품입니다.",
    genre: "소설",
    rating: 4.4,
    reviewCount: 1450,
    coverEmoji: "📖",
    coverColor: "#F0E6FF",
    isAvailable: true,
    availableCopies: 3,
    totalCopies: 5,
  },
  {
    id: "7",
    title: "미움받을 용기",
    author: "기시미 이치로",
    publisher: "인플루엔셜",
    publishedYear: 2013,
    description: "아들러 심리학을 바탕으로 인생을 바꾸는 용기에 대해 이야기합니다.",
    genre: "자기계발",
    rating: 4.3,
    reviewCount: 2300,
    coverEmoji: "💪",
    coverColor: "#FFE6CC",
    isAvailable: true,
    availableCopies: 4,
    totalCopies: 6,
    isNew: true,
  },
  {
    id: "8",
    title: "데미안",
    author: "헤르만 헤세",
    publisher: "문학동네",
    publishedYear: 1919,
    description: "청년의 성장과 자아 발견을 그린 철학적 소설입니다.",
    genre: "소설",
    rating: 4.5,
    reviewCount: 980,
    coverEmoji: "🌙",
    coverColor: "#E6E6FA",
    isAvailable: true,
    availableCopies: 2,
    totalCopies: 3,
  },
];

export function getBookById(id: string): Book | undefined {
  return BOOKS.find((book) => book.id === id);
}

export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase();
  return BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.genre.toLowerCase().includes(q)
  );
}

export function getBooksByGenre(genre: string): Book[] {
  return BOOKS.filter((book) => book.genre === genre);
}

export function getNewBooks(): Book[] {
  return BOOKS.filter((book) => book.isNew).slice(0, 6);
}

export function getPopularBooks(): Book[] {
  return [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 5);
}

export function getRecommendedBooks(): Book[] {
  return [...BOOKS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
}

export const GENRES = ["소설", "과학", "동화", "자기계발", "역사", "에세이"];
