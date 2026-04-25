FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 데이터베이스 마이그레이션
RUN pnpm db:push

# 빌드
RUN pnpm build

# 포트 노출
EXPOSE 3000

# 서버 시작
CMD ["pnpm", "start"]
