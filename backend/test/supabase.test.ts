import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Connection", () => {
  it("should connect to Supabase successfully", async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // 데이터베이스 연결 테스트
    const { data, error } = await supabase.from("books").select("*").limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should validate Supabase URL format", () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    expect(supabaseUrl).toMatch(/^https:\/\/.*\.supabase\.co$/);
  });

  it("should validate Supabase Key format", () => {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(supabaseKey).toMatch(/^eyJ/); // JWT 토큰 시작
  });
});
