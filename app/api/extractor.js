const BASE_URL ="http://localhost:5001";

export default async function fetchLinker (tag){
    const endpoint = `${BASE_URL}/extract_links`;
    try{
        const Response = await fetch(endpoint,{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({tag})

        });
        if(!Response.ok){
            const errorData = await Response.json();
            console.log("Can't fetch the links",errorData.error);
            return [];
        }
        const data = await Response.json();
        return data.links || [];
    }catch(error){
        console.log("API / NETWORK Error",error.message);
        return [];
    }
};
