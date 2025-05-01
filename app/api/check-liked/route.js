import ConnectToDb from "@/lib/mongodb";
import User from "@/models/users_db";

export async function POST(request) {
  const { username, title, link } = await request.json();

  try {
    if (!username || !title || !link) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    await ConnectToDb();


    const user = await User.findOne({ username });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const savedStatus = user.likedPosts.some(
      (post) => post.title === title && post.link === link
    );

    return new Response(
      JSON.stringify({ savedStatus }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 500 }
    );
  }
}