# 도서기록 (Library Record)

도서 대여, 소개, 추천 기능을 갖춘 풀스택 모바일 + 웹 앱

## 🎯 프로젝트 개요

도서기록은 사용자가 도서를 대여하고, 소개하고, 추천할 수 있는 통합 플랫폼입니다.

### 주요 기능
- 📚 **도서 관리** — 도서 검색, 필터링, 상세 정보 조회
- 🔄 **대여 시스템** — 도서 대여, 반납, 연장 (최대 2회)
- ⭐ **리뷰 시스템** — 별점 및 텍스트 리뷰 작성
- 💡 **추천 기능** — 도서 추천 및 좋아요
- ❤️ **찜 목록** — 관심 도서 저장
- 👤 **프로필** — 닉네임 편집, 독서 통계

## 📁 프로젝트 구조

```
library/
├── backend/           # Node.js + tRPC + Supabase
│   ├── app/          # Expo 모바일 앱
│   ├── server/       # tRPC 백엔드 서버
│   ├── drizzle/      # 데이터베이스 스키마
│   └── package.json
├── frontend/         # React + Vite + Supabase
│   ├── src/
│   │   ├── pages/   # 5개 페이지
│   │   ├── components/
│   │   ├── lib/     # tRPC, Supabase 클라이언트
│   │   └── store/   # 상태 관리
│   └── package.json
└── README.md
```

## 🛠 기술 스택

### 모바일 앱 (Expo)
- React Native 0.81
- Expo Router 6
- NativeWind (Tailwind CSS)
- TypeScript 5.9
- AsyncStorage (로컬 상태)

### 웹 앱 (React)
- React 18
- Vite 5
- TypeScript 5
- Tailwind CSS 3
- tRPC 클라이언트

### 백엔드 (Node.js)
- Express
- tRPC 11
- Supabase
- PostgreSQL
- Drizzle ORM

### 데이터베이스
- Supabase PostgreSQL
- 7개 테이블 (books, rentals, reviews, recommendations, wishlist, user_profiles, users)

## 🚀 배포

### 웹 앱 (Vercel)
```bash
cd frontend
npm install
npm run build
# Vercel에 배포
```

### 백엔드 (Railway)
```bash
cd backend
pnpm install
pnpm build
# Railway에 배포
```

### 모바일 앱 (Expo Go)
```bash
cd backend
pnpm dev:metro
# QR 코드로 Expo Go에서 실행
```

## 📋 환경 변수

### Supabase
```
SUPABASE_URL=https://wcexzwngyuphqvkrkadc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://wcexzwngyuphqvkrkadc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TlWiEKgHhxPa7sTtHIntjQ_8SZ9zdQR
```

## 📱 화면 구성

### 모바일 앱
- **홈** — 이달의 추천, 신착, 인기 TOP 5
- **탐색** — 검색, 장르 필터, 정렬
- **대여** — 대여 신청, 반납, 연장
- **커뮤니티** — 추천 피드, 리뷰
- **마이** — 프로필, 통계, 찜 목록

### 웹 앱
- 모바일과 동일한 5개 페이지
- 반응형 디자인 (데스크톱 최적화)

## 💰 비용

| 서비스 | 가격 | 설명 |
|--------|------|------|
| Vercel | 무료 | 웹 프론트엔드 호스팅 |
| Railway | $5/월 | 백엔드 서버 호스팅 |
| Supabase | 무료 | PostgreSQL 데이터베이스 |
| **합계** | **$5/월** | |

## 🔗 배포 URL

- **웹 앱**: https://dosugirok-web.vercel.app
- **백엔드 API**: https://dosugirok-prod.up.railway.app
- **Supabase**: https://wcexzwngyuphqvkrkadc.supabase.co

## 📚 문서

- [배포 가이드](../DEPLOYMENT_CHECKLIST.md)
- [Vercel 배포](../VERCEL_DEPLOYMENT.md)
- [Supabase 배포](../SUPABASE_DEPLOYMENT_GUIDE.md)

## 🎨 디자인

- **색상**: 숲 초록 테마 (#4CAF50)
- **폰트**: 시스템 폰트
- **레이아웃**: 모바일 우선 (9:16)

## 📖 사용 방법

### 웹 앱 로컬 실행
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# http://localhost:5173
```

### 모바일 앱 로컬 실행
```bash
cd backend
pnpm install
pnpm dev
# Expo Go에서 QR 코드 스캔
```

### 백엔드 로컬 실행
```bash
cd backend
pnpm install
pnpm dev:server
# http://localhost:3000
```

## 🤝 기여

이 프로젝트는 개인 프로젝트입니다.

## 📝 라이선스

MIT

## 👨‍💻 개발자

Dosugirok Dev Team

---

**배포 준비 완료!** 🚀

각 서비스에 접속하여 배포를 진행하세요.
