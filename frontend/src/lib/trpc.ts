import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@trpc/server";

// AppRouter 타입 정의 (실제로는 백엔드에서 제공)
type AppRouterType = any;

export const trpc = createTRPCReact<AppRouterType>();
