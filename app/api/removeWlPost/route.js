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

    // Filter out the post with matching title & link
    const updatedPosts = user.watchLater.filter(
      (post) => !(post.title === title && post.link === link)
    );

    if (updatedPosts.length === user.watchLater.length) {
      return new Response(JSON.stringify({ message: "Post not found" }), { status: 404 });
    }

    user.watchLater = updatedPosts;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Post removed successfully" }),
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