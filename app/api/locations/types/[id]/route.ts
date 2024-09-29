import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  params: { params: { id: string } },
) {
  try {
    await prisma.locationType.delete({
      where: {
        id: Number(params.params.id),
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Category deleted successfully",
      }),
      {
        status: 200,
      },
    );
  }

  return new NextResponse(
    JSON.stringify({
      success: true,
      error: { message: "Unknown category id" },
    }),
    { status: 400 },
  );
}
