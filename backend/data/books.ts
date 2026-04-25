export type Genre =
  | "소설"
  | "에세이"
  | "자기계발"
  | "과학"
  | "역사"
  | "어린이"
  | "경제"
  | "철학";

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  genre: Genre;
  description: string;
  coverColor: string; // 표지 배경색 (이미지 대신)
  coverEmoji: string; // 표지 이모지
  rating: number; // 0~5
  reviewCount: number;
  isAvailable: boolean;
  totalCopies: number;
  availableCopies: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const BOOKS: Book[] = [
  {
    id: "1",
    title: "채식주의자",
    author: "한강",
    publisher: "창비",
    publishedYear: 2007,
    genre: "소설",
    description:
      "어느 날 갑자기 채식주의자가 된 한 여성과 그 주변 사람들의 이야기를 세 편의 연작 소설로 담아낸 작품. 인간의 욕망과 폭력, 자유와 억압에 대한 깊은 성찰을 담고 있다.",
    coverColor: "#E8F5E9",
    coverEmoji: "🌿",
    rating: 4.7,
    reviewCount: 1243,
    isAvailable: true,
    totalCopies: 3,
    availableCopies: 2,
    isFeatured: true,
  },
  {
    id: "2",
    title: "82년생 김지영",
    author: "조남주",
    publisher: "민음사",
    publishedYear: 2016,
    genre: "소설",
    description:
      "1982년에 태어난 평범한 한국 여성 김지영의 삶을 통해 한국 사회의 성차별 문제를 날카롭게 조명한 소설. 출간 이후 사회적으로 큰 반향을 일으켰다.",
    coverColor: "#FCE4EC",
    coverEmoji: "👩",
    rating: 4.5,
    reviewCount: 2891,
    isAvailable: false,
    totalCopies: 2,
    availableCopies: 0,
    isFeatured: true,
  },
  {
    id: "3",
    title: "아몬드",
    author: "손원평",
    publisher: "창비",
    publishedYear: 2017,
    genre: "소설",
    description:
      "감정을 느끼지 못하는 소년 윤재가 세상과 소통하며 성장해가는 이야기. 공감 능력과 인간관계에 대한 따뜻한 시선을 담고 있다.",
    coverColor: "#FFF3E0",
    coverEmoji: "🌰",
    rating: 4.6,
    reviewCount: 1876,
    isAvailable: true,
    totalCopies: 4,
    availableCopies: 1,
    isNew: true,
  },
  {
    id: "4",
    title: "코스모스",
    author: "칼 세이건",
    publisher: "사이언스북스",
    publishedYear: 1980,
    genre: "과학",
    description:
      "우주의 탄생부터 인류 문명의 발전까지, 광대한 우주와 인간의 관계를 탁월한 문체로 풀어낸 과학 교양서의 고전.",
    coverColor: "#E3F2FD",
    coverEmoji: "🌌",
    rating: 4.9,
    reviewCount: 3421,
    isAvailable: true,
    totalCopies: 2,
    availableCopies: 2,
    isFeatured: true,
  },
  {
    id: "5",
    title: "미움받을 용기",
    author: "기시미 이치로, 고가 후미타케",
    publisher: "인플루엔셜",
    publishedYear: 2013,
    genre: "자기계발",
    description:
      "아들러 심리학을 바탕으로 인간관계의 본질과 행복의 의미를 탐구한 책. 철학자와 청년의 대화 형식으로 삶의 용기를 이야기한다.",
    coverColor: "#F3E5F5",
    coverEmoji: "💪",
    rating: 4.4,
    reviewCount: 4567,
    isAvailable: true,
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    id: "6",
    title: "사피엔스",
    author: "유발 하라리",
    publisher: "김영사",
    publishedYear: 2011,
    genre: "역사",
    description:
      "인류의 탄생부터 현재까지 호모 사피엔스의 역사를 거시적 관점에서 조망한 역작. 인지 혁명, 농업 혁명, 과학 혁명을 중심으로 인류 문명을 재해석한다.",
    coverColor: "#EFEBE9",
    coverEmoji: "🦴",
    rating: 4.8,
    reviewCount: 5234,
    isAvailable: false,
    totalCopies: 3,
    availableCopies: 0,
  },
  {
    id: "7",
    title: "어린 왕자",
    author: "생텍쥐페리",
    publisher: "문학동네",
    publishedYear: 1943,
    genre: "어린이",
    description:
      "사막에 불시착한 비행사가 만난 어린 왕자의 이야기. 어른들이 잊어버린 순수함과 사랑의 본질을 아름다운 문체로 담아낸 세계적인 명작.",
    coverColor: "#FFFDE7",
    coverEmoji: "🌹",
    rating: 4.9,
    reviewCount: 7823,
    isAvailable: true,
    totalCopies: 6,
    availableCopies: 4,
    isNew: true,
  },
  {
    id: "8",
    title: "부의 추월차선",
    author: "엠제이 드마코",
    publisher: "토트",
    publishedYear: 2011,
    genre: "경제",
    description:
      "평범한 직장인이 아닌 사업가의 관점에서 부를 창출하는 방법을 설명한 책. 기존의 재테크 상식을 뒤집는 도발적인 시각을 제시한다.",
    coverColor: "#E8F5E9",
    coverEmoji: "🚀",
    rating: 4.2,
    reviewCount: 2134,
    isAvailable: true,
    totalCopies: 3,
    availableCopies: 1,
  },
  {
    id: "9",
    title: "소크라테스의 변명",
    author: "플라톤",
    publisher: "문예출판사",
    publishedYear: -399,
    genre: "철학",
    description:
      "철학자 소크라테스가 재판에서 자신을 변호하는 내용을 담은 플라톤의 대화편. 진리와 정의, 죽음에 대한 소크라테스의 철학적 사유를 담고 있다.",
    coverColor: "#E0F2F1",
    coverEmoji: "🏛️",
    rating: 4.6,
    reviewCount: 1567,
    isAvailable: true,
    totalCopies: 2,
    availableCopies: 2,
  },
  {
    id: "10",
    title: "달러구트 꿈 백화점",
    author: "이미예",
    publisher: "팩토리나인",
    publishedYear: 2020,
    genre: "소설",
    description:
      "꿈을 파는 백화점에서 일하게 된 페니의 이야기. 따뜻하고 신비로운 세계관 속에서 인간의 욕망과 꿈에 대해 이야기한다.",
    coverColor: "#EDE7F6",
    coverEmoji: "🌙",
    rating: 4.5,
    reviewCount: 3456,
    isAvailable: true,
    totalCopies: 4,
    availableCopies: 2,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "11",
    title: "파친코",
    author: "이민진",
    publisher: "인플루엔셜",
    publishedYear: 2017,
    genre: "소설",
    description:
      "일제강점기부터 현대까지 재일 한국인 가족 4대의 삶을 그린 대하소설. 정체성과 차별, 생존에 대한 이야기를 웅장한 서사로 풀어낸다.",
    coverColor: "#FBE9E7",
    coverEmoji: "🎰",
    rating: 4.8,
    reviewCount: 2890,
    isAvailable: false,
    totalCopies: 2,
    availableCopies: 0,
    isNew: true,
  },
  {
    id: "12",
    title: "총, 균, 쇠",
    author: "재레드 다이아몬드",
    publisher: "문학사상",
    publishedYear: 1997,
    genre: "역사",
    description:
      "왜 어떤 문명은 다른 문명을 정복했는가? 지리적, 환경적 요인이 인류 역사에 미친 영향을 탐구한 퓰리처상 수상작.",
    coverColor: "#E8EAF6",
    coverEmoji: "⚔️",
    rating: 4.7,
    reviewCount: 4123,
    isAvailable: true,
    totalCopies: 3,
    availableCopies: 1,
  },
];

export const GENRES: Genre[] = [
  "소설",
  "에세이",
  "자기계발",
  "과학",
  "역사",
  "어린이",
  "경제",
  "철학",
];

export function getBookById(id: string): Book | undefined {
  return BOOKS.find((b) => b.id === id);
}

export function getBooksByGenre(genre: Genre): Book[] {
  return BOOKS.filter((b) => b.genre === genre);
}

export function getFeaturedBooks(): Book[] {
  return BOOKS.filter((b) => b.isFeatured);
}

export function getNewBooks(): Book[] {
  return BOOKS.filter((b) => b.isNew);
}

export function getTopRatedBooks(limit = 10): Book[] {
  return [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase();
  return BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q)
  );
}
