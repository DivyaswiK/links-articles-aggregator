import Tag from "@/models/linkDb"; 
import ConnetToDb from "@/lib/mongodb";


export async function POST(req) {


    const { tag, links } = await req.json();
    console.log(typeof(tag), tag);
    console.log(typeof(links) , links);
    if (!tag || !Array.isArray(links) || links.length === 0) {
        return new Response (JSON.stringify({ error: "Invalid request data" }),{status : 400});
    }

    try {

        await ConnetToDb();

        let tagDoc = await Tag.findOne({ tag });

        if (!tagDoc) {
            tagDoc = new Tag({ tag, links: [] });
        }

        links.forEach((link) => {
            if (!tagDoc.links.some((l) => l.url === link)) {
                tagDoc.links.push({ url: link, upvote: 0 });
            }
        });

        await tagDoc.save(); 

        return new Response(
            JSON.stringify({ message:`Stored ${links.length} links for tag: ${tag}`}),
            { status: 200 }
          );
    } catch (error) {
        console.error(error + "error");
        return new Response(
          JSON.stringify({ message: "Server Error" }),
          { status: 500 }
        );
    }
}