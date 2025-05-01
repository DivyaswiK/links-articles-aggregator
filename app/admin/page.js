'use client'
import { useState, useEffect } from "react";
import fetchLinker from "../api/extractor";

const AdminPage = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/tags.json")
            .then(res => res.json())
            .then(data => setTags(data));
    }, []);

    const fetchLinks = async (tag) => {
        console.log(`Fetching links for: ${tag}`);
        const links = await fetchLinker(tag.toLowerCase());
        console.log(links, typeof links);

        if (!links || links.length === 0) {
            console.warn(`No links found for: ${tag}`);
            return;
        }

        try {
            const res = await fetch("/api/store_links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag, links }),
            });

            const data = await res.json();
            console.log(`Response from store_links for ${tag}:`, data.message);
        } catch (error) {
            console.error(`Error storing links for ${tag}:`, error);
        }
    };

    const fetchAllTags = async () => {
        setLoading(true);
        
        for (const category of tags) {
            for (const tag of category.tags) {
                await fetchLinks(tag);  // Wait for the response before continuing
            }
        }

        setLoading(false);
        alert("All tags processed!");
    };

    return (
        <div className="theContainer">
            <h1>Scrape Links</h1>
            <button onClick={fetchAllTags} disabled={loading}>
                {loading ? "Fetching all..." : "Fetch All Tags"}
            </button>
            {tags.map((category) => (
                <div key={category.heading}>
                    <h2>{category.heading}</h2>
                    {category.tags.map((tag) => (
                        <button key={tag} onClick={() => fetchLinks(tag)} disabled={loading}>
                            {loading ? "Fetching..." : `${tag}` + ' '}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AdminPage;
