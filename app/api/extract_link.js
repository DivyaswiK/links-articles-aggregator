const BASE_URL = 'http://localhost:5000'; //flask runs at port 5000

export default async function fetchBlog(url) {
    const endpoint = `${BASE_URL}/fetch_blog?url=${encodeURIComponent(url)}`;
    try{
        const Response = await fetch(endpoint);
        if(!Response.ok){
            const errorData = Response.json();
            console.log("Error fetching Links:",errorData.error);
            return null;
        }
        const data = Response.json();
        console.log("fetched")
        return data;
    }catch(error){
        console.log("Net / Api error",error.message);
        return null;
    }
}
