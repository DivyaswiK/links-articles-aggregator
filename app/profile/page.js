"use client";
import './profile.css';
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [likedPosts, setlikedPosts] = useState([]);
    const [watchLater, setWatchLater] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [menuOpen, setMenuOpen] = useState(null);
    const [menuOpenwl, setMenuOpenwl] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            try {
                if (storedUser?.username) {
                    setUser(storedUser);
                } else {
                    throw new Error("Invalid user object");
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                toast.error("Corrupted user data.");
                localStorage.removeItem("user");
            }
        } else {
            toast.error("User not logged in!", { icon: "❌" });
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.username) return;
            try {
                const response = await fetch("/api/profile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: user.username }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmail(data.user.email);
                    setPreferences(data.user.preferences || []);
                    setlikedPosts(data.user.likedPosts || []);
                    setWatchLater(data.user.watchLater || []);
                }
            } catch (error) {
                console.error("Error fetching preferences:", error);
                toast.error("Error Fetching User Data");
            }
        };
        fetchUserData();
    }, [user]);


    const handleRemovePost = async (index, type) => {
        // e.stopPropagation();

        const status = localStorage.getItem("status");
        if (status === "0") {
            toast.error("Please log in to remove!", { icon: "🔒" });
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.username) {
            toast.error("Invalid session. Please log in again.");
            return;
        }
        if (type === 'liked') {
            const postToRemove = likedPosts[index];

            if (!postToRemove?.title || !postToRemove?.link) {
                toast.error("Invalid post data.");
                return;
            }

            console.log("Removing post:", {
                username: user.username,
                title: postToRemove.title,
                link: postToRemove.link,
            });

            const updatedPosts = [...likedPosts];
            updatedPosts.splice(index, 1);
            setlikedPosts(updatedPosts);

            try {
                const response = await fetch("/api/removePost", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: user.username,
                        title: postToRemove.title,
                        link: postToRemove.link,
                    }),
                });

                if (!response.ok) {
                    const responseData = await response.json();
                    setlikedPosts(likedPosts);
                    throw new Error(responseData.message || "Failed to remove post");
                }

                toast.success("Post removed!", { icon: "🗑️" });
            } catch (error) {
                console.error("Remove failed:", error);
                setlikedPosts(likedPosts);
                toast.error("Failed to remove. Try again!");
            }

        }
        if (type === 'watchLater') {
            const postToRemove = watchLater[index];

            if (!postToRemove?.title || !postToRemove?.link) {
                toast.error("Invalid post data.");
                return;
            }

            console.log("Removing post:", {
                username: user.username,
                title: postToRemove.title,
                link: postToRemove.link,
            });

            const updatedPosts = [...watchLater];
            updatedPosts.splice(index, 1);
            setWatchLater(updatedPosts);

            try {
                const response = await fetch("/api/removeWlPost", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: user.username,
                        title: postToRemove.title,
                        link: postToRemove.link,
                    }),
                });

                if (!response.ok) {
                    const responseData = await response.json();
                    setWatchLater(watchLater);
                    throw new Error(responseData.message || "Failed to remove post");
                }

                toast.success("Post removed!", { icon: "🗑️" });
            } catch (error) {
                console.error("Remove failed:", error);
                setWatchLater(watchLater);
                toast.error("Failed to remove. Try again!");
            }

        }
    };

    const toggleMenu = (index) => {
        setMenuOpen(menuOpen === index ? null : index);
    };
    const toggleMenuwl = (index) => {
        setMenuOpenwl(menuOpenwl === index ? null : index);
    };
    const truncateText = (text, wordLimit) => {
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };
    return (
        <div className="theContainer">
            <div className="profile-page">
                <Toaster position="top-center" />
                {user ? (
                    <>
                        {/* Profile Header */}
                        <div className="profile-header">
                            <Image
                                src="/default-avatar.png"
                                alt="User Avatar"
                                width={100}
                                height={100}
                                className="profile-avatar"
                            />
                            <div className="profile-info">
                                <h2><b>Username: </b>{user.username}</h2>
                                <p className="email"><b>Email: </b>{email || "Not Provided"}</p>
                            </div>
                        </div>
                        <br></br>
                        {/* Preferences Section */}
                        <div className="preferences-section">
                            <div className="section-title">Your Preferences</div>
                            <div className="preferences-container">
                                {preferences.length > 0 ? (
                                    preferences.map((pref, index) => (
                                        <span key={index} className="preference-item">
                                            {pref}
                                        </span>
                                    ))
                                ) : (
                                    <p>No preferences selected.</p>
                                )}
                            </div>
                        </div>
                        <br></br>
                        {/* Saved Posts Section */}
                        <div className="saved-posts-section">
                            <h3 className="section-title">Liked Posts</h3>
                            <div className="saved-posts-container">
                                {likedPosts.length > 0 ? (
                                    likedPosts.map((post, index) => (
                                        <div key={index} className="post-item">
                                            <div className="image-container">
                                                <Image
                                                    src={post.image || "/placeholder.png"}
                                                    alt={post.title}
                                                    width={120}
                                                    height={120}
                                                    className="post-image"
                                                />
                                            </div>
                                            <div className="post-content">
                                                <h1 className="post-title"><b>{post.title}</b></h1>

                                                <p className="post-text">{truncateText(post.content, 35)}</p><br></br>
                                                <a href={post.link} target="_blank" rel="noopener noreferrer" className="read-more">
                                                    <b>Read More</b>
                                                </a>
                                            </div>
                                            {/* Three-dot menu */}
                                            <div className="menu-container" style={{ position: "relative", display: "inline-block" }}>
                                                <button
                                                    className="menu-btn"
                                                    onClick={() => toggleMenu(index)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        fontSize: "24px",
                                                        cursor: "pointer",
                                                        padding: "5px",
                                                        transition: "color 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) => (e.target.style.color = "#B8860B")}
                                                    onMouseLeave={(e) => (e.target.style.color = "black")}
                                                >
                                                    ⋮
                                                </button>

                                                {menuOpen === index && (
                                                    <div
                                                        className="menu-dropdown"
                                                        style={{
                                                            position: "absolute",
                                                            top: "40px",
                                                            right: "0",
                                                            background: "white",
                                                            borderRadius: "8px",
                                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                                            overflow: "hidden",
                                                            width: "120px",
                                                            zIndex: "10",
                                                            animation: "fadeIn 0.3s ease-in-out",
                                                        }}
                                                    >
                                                        <button
                                                            className="menu-item"
                                                            onClick={() => handleRemovePost(index, 'liked')}
                                                            style={{
                                                                background: "white",
                                                                border: "none",
                                                                width: "100%",
                                                                textAlign: "center",
                                                                padding: "10px",
                                                                cursor: "pointer",
                                                                fontSize: "14px",
                                                                transition: "background 0.3s ease",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.background = "grey";
                                                                e.target.style.color = "white";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.background = "white";
                                                                e.target.style.color = "black";
                                                            }}
                                                        >
                                                            <b>Remove</b>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <p>No saved posts.</p>
                                )}
                            </div>
                        </div>
                        <div className="saved-posts-section">
                            <h3 className="section-title">WatchLater Posts</h3>
                            <div className="saved-posts-container">
                                {watchLater.length > 0 ? (
                                    watchLater.map((post, index) => (
                                        <div key={index} className="post-item">
                                            <div className="image-container">
                                                <Image
                                                    src={post.image || "/placeholder.png"}
                                                    alt={post.title}
                                                    width={120}
                                                    height={120}
                                                    className="post-image"
                                                />
                                            </div>
                                            <div className="post-content">
                                                <h1 className="post-title"><b>{post.title}</b></h1>

                                                <p className="post-text">{truncateText(post.content, 35)}</p><br></br>
                                                <a href={post.link} target="_blank" rel="noopener noreferrer" className="read-more">
                                                    <b>Read More</b>
                                                </a>
                                            </div>
                                            {/* Three-dot menu */}
                                            <div className="menu-container" style={{ position: "relative", display: "inline-block" }}>
                                                <button
                                                    className="menu-btn"
                                                    onClick={() => toggleMenuwl(index)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        fontSize: "24px",
                                                        cursor: "pointer",
                                                        padding: "5px",
                                                        transition: "color 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) => (e.target.style.color = "#B8860B")}
                                                    onMouseLeave={(e) => (e.target.style.color = "black")}
                                                >
                                                    ⋮
                                                </button>

                                                {menuOpenwl === index && (
                                                    <div
                                                        className="menu-dropdown"
                                                        style={{
                                                            position: "absolute",
                                                            top: "40px",
                                                            right: "0",
                                                            background: "white",
                                                            borderRadius: "8px",
                                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                                            overflow: "hidden",
                                                            width: "120px",
                                                            zIndex: "10",
                                                            animation: "fadeIn 0.3s ease-in-out",
                                                        }}
                                                    >
                                                        <button
                                                            className="menu-item"
                                                            onClick={() => handleRemovePost(index, 'watchLater')}
                                                            style={{
                                                                background: "white",
                                                                border: "none",
                                                                width: "100%",
                                                                textAlign: "center",
                                                                padding: "10px",
                                                                cursor: "pointer",
                                                                fontSize: "14px",
                                                                transition: "background 0.3s ease",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.background = "grey";
                                                                e.target.style.color = "white";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.background = "white";
                                                                e.target.style.color = "black";
                                                            }}
                                                        >
                                                            <b>Remove</b>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    ))
                                ) : (
                                    <p>No watchLater posts.</p>
                                )}
                            </div>
                        </div>                    </>
                ) : (
                    <p className="login-message">Please log in to view your profile.</p>
                )}
            </div>

        </div>
    );
};
export default Profile;