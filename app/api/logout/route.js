import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the token cookie
    cookies().set("token", "", { expires: new Date(0), path: "/" });

    return new Response(JSON.stringify({ message: "Logout successful" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Logout API error:", error);
    return new Response(
      JSON.stringify({ error: "An internal server error occurred" }),
      {
        status: 500,
      }
    );
  }
}
