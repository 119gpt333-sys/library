import { httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import { trpc } from "./trpc";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});

export { trpcClient, queryClient };
