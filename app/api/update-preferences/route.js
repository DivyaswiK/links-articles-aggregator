import ConnectToDb from "@/lib/mongodb";
import User from "@/models/users_db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
    const username = searchParams.get("username");

    if (!username) {
      return new Response(JSON.stringify({ message: "Username is required" }), { 
        status: 400, headers: { "Content-Type": "application/json" } 
      });
    }

    await ConnectToDb();
    console.log("Connected to database successfully");

    const user = await User.findOne({ username });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { 
        status: 404, headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response(
      JSON.stringify({ preferences: user.preferences || [] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching preferences:", error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, tags } = body;

    if (!username || !tags) {
      return new Response(JSON.stringify({ message: "Username and tags are required" }), { 
        status: 400, headers: { "Content-Type": "application/json" } 
      });
    }

    await ConnectToDb();
    console.log("Connected to database successfully");

    const user = await User.findOneAndUpdate(
      { username },
      { $set: { preferences: tags } },  // Use `$set` to prevent overwriting other fields
      { new: true, upsert: true }
    );

    return new Response(
      JSON.stringify({ message: "Preferences updated successfully", preferences: user.preferences }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error updating preferences:", error);
    return new Response(JSON.stringify({ message: "Something went wrong" }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}
