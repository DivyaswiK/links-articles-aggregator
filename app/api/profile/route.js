import ConnetToDb from "@/lib/mongodb";
import User from '@/models/users_db';
export async function POST(request){
    const {username} = await request.json();

    if(!username){
        return new Response(
            JSON.stringify({message : "UserName is not found" }),
            {status :400}
        )
    };

    try{
        await ConnetToDb();
        const user = await User.findOne({username});
        if(!user){
            return new Response(
                JSON.stringify({message : "User Not Found"}),
                {status : 400}
            );
        };

        const userLog =  {
            email : user.email,
            likedPosts : user.likedPosts,
            preferences : user.preferences,
            watchLater : user.watchLater,
        };

        return new Response(
            JSON.stringify({message : "Loaded data",user : userLog}),
            {status : 200}
        );
    }catch(error){
        console.log("error : " + error);
        return new Response(
            JSON.stringify({message : "Server Error"}),
            {status : 500}
        );
    };
};