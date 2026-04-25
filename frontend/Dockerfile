FROM node:18-alpine AS build

WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 프로덕션 이미지
FROM node:18-alpine

WORKDIR /app

# 정적 파일 제공을 위한 간단한 서버 설치
RUN npm install -g serve

# 빌드된 파일 복사
COPY --from=build /app/dist ./dist

# 포트 노출
EXPOSE 3000

# 서버 시작
CMD ["serve", "-s", "dist", "-l", "3000"]
