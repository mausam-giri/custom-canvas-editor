"use server";

export async function validateUser(
  userId?: string | null,
  templateId?: string | null
) {
  try {
    if (!userId || !templateId) {
      return false;
      //   throw Error("Invalid user data");
    }
    const response = await fetch(
      "http://localhost:3001/api/editor/validate-user",
      {
        method: "POST",
        body: JSON.stringify({
          userId,
          templateId,
        }),
      }
    );
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Unathorized", error);
    return false;
  }
}
