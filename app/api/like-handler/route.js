import ConnectToDb from "@/lib/mongodb";
import User from "@/models/users_db";

export async function POST(request) {
    const { username, title, content, image, link, action } = await request.json();

    try {
      if (!username || (action === "save" && (!title || !content)) || (action === "unsave" && !title)) {
        return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
      }
  
      await ConnectToDb();
      let user = await User.findOne({ username });
  
      if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
      }
  
      if (action === "save") {
        const newPost = { title, content, image, link };
        //handling duplicates
        if (!user.likedPosts.some(post => post.title === title)) {
          user.likedPosts.push(newPost);
          await user.save();
  
          return new Response(JSON.stringify({ 
            message: "Post saved successfully", 
            likedPosts: user.likedPosts,
            success : true,
          }), { status: 200 });
        }
  
        return new Response(JSON.stringify({ message: "Post already Liked", likedPosts: user.likedPosts }), { status: 200 });
      }
  
      if (action === "unsave") {
        user.likedPosts = user.likedPosts.filter(post => post.title !== title);
        await user.save();
  
        return new Response(JSON.stringify({ 
          message: "Post removed successfully", 
          likedPosts: user.likedPosts,
          success : true,
        }), { status: 200 });
      }
  
      return new Response(JSON.stringify({ message: "Invalid action" }), { status: 400 });
  
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response(JSON.stringify({ message: "Something went wrong" }), { status: 500 });
    }
  }