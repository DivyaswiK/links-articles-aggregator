import React, { useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import Styles from "./card.module.css";
import { Bookmark, Clock, ThumbsUp } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const HoverCard = ({ src, title, content, link }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const loadSavedState = async () => {
      const status = localStorage.getItem("status");
      if (status === '0'){
        setIsLoaded(true);
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.username) {
        try {

          const response = await fetch("/api/check-liked", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: user.username,
              title: title,
              link : link,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setIsLiked(data.savedStatus);
          }
          const response1 = await fetch("/api/check-saved", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: user.username,
              title: title,
              link : link,
            }),
          });

          if (response1.ok) {
            const data1 = await response1.json();
            setIsSaved(data1.savedStatus);
          }

        } catch (error) {
          console.error("Error fetching saved state:", error);
        } finally {
          setIsLoaded(true);
        }
      }
    };
    loadSavedState();
  }, [title,link]);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = () => {
    window.open(link, "_blank");
  };
  // const handleSave = (e) => {
  //   e.stopPropagation(); // Prevent triggering modal open
  //   setIsSaved((prev) => !prev); // Toggle save state
  // };
  

  const handleWatchLater = async (e) => {
    e.stopPropagation(); 

    const newSaveState = !isSaved;
    setIsSaved(newSaveState);  
  
    // Check if the user is logged in
    const status = localStorage.getItem("status");
    if (status === '0') {
      toast.error("Please log in to save!", { icon: "🔒" });
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.username) {
      toast.error("Invalid session. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("/api/watch-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          title: title,
          content: content,
          image: src,
          link: link,
          action: newSaveState ? "save" : "unsave",
        }),
      });
  
      if (!response.ok) {
        setIsSaved(!newSaveState);
        throw new Error("Failed to Save");
      }
  
      const responseData = await response.json();
  
      if (responseData.success) {
        toast.success(newSaveState ? "Added to Watch Later" : "Removed!", { icon: newSaveState ? "📍" : "🗑️" });
      } else {
        setIsSaved(!newSaveState);
        toast.error("Failed to save. Try again!");
      }
  
    } catch (error) {
      console.error("save failed:", error);
      setIsSaved(!newSaveState);
      toast.error("Failed to save. Try again!");
    }


  }
  const handleSave = async (e) => {
    e.stopPropagation(); 
  
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);  
  
    // Check if the user is logged in
    const status = localStorage.getItem("status");
    if (status === '0') {
      toast.error("Please log in to save!", { icon: "🔒" });
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.username) {
      toast.error("Invalid session. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("/api/like-handler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          title: title,
          content: content,
          image: src,
          link: link,
          action: newLikedState ? "save" : "unsave",
        }),
      });
  
      if (!response.ok) {
        setIsLiked(!newLikedState);
        throw new Error("Failed to update Liked");
      }
  
      const responseData = await response.json();
  
      if (responseData.success) {
        toast.success(newLikedState ? "Liked! Saved to Liked Post" : "Like removed!", { icon: newLikedState ? "👍" : "🗑️" });
      } else {
        setIsLiked(!newLikedState);
        toast.error("Failed to Like. Try again!");
      }
  
    } catch (error) {
      console.error("Like failed:", error);
      setIsLiked(!newLikedState);
      toast.error("Failed to Like. Try again!");
    }
  };
  
  // Adjust the threshold as needed to trigger scrolling
  const isContentLarge = content.length > 50; // Condition to check if content length requires scrolling
  
  return (
    <div>
      <Toaster position="top-center" />
      {/* Small Card */}
      <div className="card my-20" onClick={openModal}>
        <div className={Styles.cardBody}>
          <Image
            className={Styles.cardImgTop}
            src={`https://python-cnku.onrender.com/proxy_image?url=${encodeURIComponent(src)}`}
            alt="Card img cap"
            width={150}
            height={200}
          />
          <h5
            className="card-title"
            style={{
              color: "black",
              padding: "5px",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
                        <div
              className={Styles.saveIcon}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "100px",
                cursor: "pointer",
                // zIndex: 0,
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
              onClick={handleWatchLater}
            >
              <Clock
              size={20}
              color={isSaved ? "#B8860B" : "gray"}
              />
            </div>
            {/* Save Icon */}
            <div
              className={Styles.saveIcon}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                cursor: "pointer",
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
              onClick={handleSave}
            >
              <ThumbsUp
                size={20}
                color={isLiked ? "#B8860B" : "gray"}
                fill={isLiked? "#B8860B" : "none"}
              />
            </div>
            {title}
          </h5>
        </div>
      </div>

      {/* Large Card (Modal) */}
      {isModalOpen && (
        <div className="hoverContainer">
          <div className={Styles.modalOverlay} onClick={closeModal}>
            <div
              className={Styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                position: "relative",
                width: "80%",
                maxWidth: "600px",
                height: "85vh",
              }}
            >
              {/* Header with Open Post Button */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <button
                  onClick={handleNavigate}
                  className="btn btn-primary px-4 py-2 shadow border-0 outline-0"
                  style={{ backgroundColor: "grey" }}
                >
                  Open Post
                </button>
              </div>
              {/* Scrollable Content */}
              <div
                className={isContentLarge ? Styles.modalContentScrollable : ""}
                style={{
                  flexGrow: 1,
                  padding: "20px",
                }}
              >
                <Image
                  className={Styles.cardImgExp}
                  src={`https://python-cnku.onrender.com/proxy_image?url=${encodeURIComponent(src)}`}
                  alt="Card img cap"
                  width={400}
                  height={500}
                />
                <div className={Styles.cardBody}>
                  <h5
                    className="card-title"
                    style={{
                      color: "black",
                      fontSize: "2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {title}
                  </h5>
                  <p
                    className="card-text"
                    style={{ color: "gray", fontSize: "1rem" }}
                  >
                    {content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverCard;
