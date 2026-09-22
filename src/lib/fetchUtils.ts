import { supabase } from "./supabase/client";
export { supabase };

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(input, init);
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch {
      // JSON parse failed
    }
  }

  const text = await res.text();
  let cleanMessage = text;

  if (
    text.includes("A server error") ||
    text.includes("FUNCTION_INVOCATION_FAILED")
  ) {
    cleanMessage = "حدث خطأ في الخادم. يرجى التحقق من الاتصال بقاعدة البيانات.";
  } else if (!res.ok) {
    cleanMessage = `خطأ من الخادم (رمز الحالة: ${res.status})`;
  }

  return {
    ok: res.ok,
    status: res.status,
    data: {
      success: false,
      error: cleanMessage,
    } as unknown as T,
  };
}

// 1. دالة جلب قائمة الكروت للداشبورد من Supabase
export async function getCardsApi() {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      status: 400,
      data: { success: false, error: error.message, cards: [] },
    };
  }

  return { ok: true, status: 200, data: { success: true, cards: data || [] } };
}

// 2. دالة إنشاء كارت فردي عبر Supabase مباشرة
export async function createCardApi(cardId: string) {
  const { data, error } = await supabase
    .from("cards")
    .insert([{ card_id: cardId, is_active: false }])
    .select()
    .single();

  if (error) {
    return {
      ok: false,
      status: 400,
      data: { success: false, error: error.message },
    };
  }

  return { ok: true, status: 200, data: { success: true, card: data } };
}

// 3. دالة توليد كروت كميات (Bulk Generate)
export async function createBulkCardsApi(startId: string, endId: string) {
  const startNum = parseInt(startId.replace(/\D/g, ""), 10);
  const endNum = parseInt(endId.replace(/\D/g, ""), 10);
  const prefix = startId.replace(/\d+/g, "");

  if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
    return {
      ok: false,
      status: 400,
      data: { success: false, error: "نطاق المعرفات غير صالح" },
    };
  }

  const cardsToInsert = [];
  for (let i = startNum; i <= endNum; i++) {
    const formattedId = `${prefix}${String(i).padStart(2, "0")}`;
    cardsToInsert.push({ card_id: formattedId, is_active: false });
  }

  const { data, error } = await supabase
    .from("cards")
    .insert(cardsToInsert)
    .select();

  if (error) {
    return {
      ok: false,
      status: 400,
      data: { success: false, error: error.message },
    };
  }

  return { ok: true, status: 200, data: { success: true, createdCards: data } };
}

// 4. دالة تحديث كارت
export async function updateCardApi(
  cardId: string,
  updates: Partial<{
    client_name: string;
    target_url: string;
    is_active: boolean;
  }>,
) {
  const { data, error } = await supabase
    .from("cards")
    .update(updates)
    .eq("card_id", cardId)
    .select()
    .single();

  if (error) {
    return {
      ok: false,
      status: 400,
      data: { success: false, error: error.message },
    };
  }

  return { ok: true, status: 200, data: { success: true, card: data } };
}

// 5. دالة حذف كارت من Supabase
export async function deleteCardApi(cardId: string) {
  const { error } = await supabase.from("cards").delete().eq("card_id", cardId);

  if (error) {
    return {
      ok: false,
      status: 400,
      data: { success: false, error: error.message },
    };
  }

  return { ok: true, status: 200, data: { success: true } };
}
