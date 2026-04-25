import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../dosugirok/server/routers";

export const trpc = createTRPCReact<AppRouter>();
