export function dbError(error: unknown): string {
  console.error("[db]", error);
  return "Database operation failed";
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}