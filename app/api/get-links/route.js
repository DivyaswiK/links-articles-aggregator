import Tag from '@/models/linkDb';
import ConnetToDb from "@/lib/mongodb";

export async function POST(request) {
    const { links, skip , limit  } = await request.json();

    console.log(links, " ", typeof (links));
    console.log(Array.isArray(links));
    try {
        await ConnetToDb();

        if (links && Array.isArray(links)) {
            let resultant_links = [];

            for (const tag of links) {
                // console.log(tag);
                const tagDoc = await Tag.findOne({ tag }).select('links.url');
                // console.log(tagDoc);
                if (tagDoc) {
                    const tagLinks = tagDoc.links.slice(skip, skip + limit).map(link => link.url);
                    // console.log(tagLinks);
                    resultant_links = [...resultant_links, ...tagLinks];
                    console.log(resultant_links.length);
                }
            }

            return new Response(JSON.stringify({
                message: "Links Fetched ",
                content: resultant_links,
            }));
        }


    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Error fetching links", error }), { status: 500 });
    }

}