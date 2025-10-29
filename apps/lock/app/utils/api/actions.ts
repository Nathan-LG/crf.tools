"use server";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function revalidate(path) {
  revalidatePath(path);
}

export async function APIResponse(data: any, status = 200) {
  return new NextResponse(
    JSON.stringify({
      success: status < 400,
      ...data,
    }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}
