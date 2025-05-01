//From the given website this code fetches the links for the applicable tags that are provided by the user
const BASE_URL ="http://localhost:5000";

export default async function fetchLinks (tag){
    const endpoint = `${BASE_URL}/fetch_links`;
    try{
        const Response = await fetch(endpoint,{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({source:tag})

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


// current limitaions or improvements 
/*
    1. The links_fetch works by getting the input of single tag and try to fetch the links related to tag. only single tag is taken as an input.
        i. as the user will have many liked preferences so we may need to add all the tags for searching, as we have need to show many preferences not only from a website, have to collect all the articles from a website that have the user prefered tags
    2. This api currently only being used for fetching from medium website .
        i. should make a common api to keep it simple
*/ 