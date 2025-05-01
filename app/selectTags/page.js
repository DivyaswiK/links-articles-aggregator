'use client'
import { useState, useEffect } from 'react';
import Styles from './tags.module.css';
import { SettingsIcon } from 'lucide-react';

const TagSelector = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [userName, setUserName] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [selectedHeadings, setSelectedHeadings] = useState([]);
  const [isHeadingsSelected, setIsHeadingsSelected] = useState(false);
  const [isLoggedin, setIsLoggedIn] = useState(null);
  // Fetch the complete tags data
  useEffect(() => {
    fetch("/tags.json")
      .then((res) => res.json())
      .then((data) => setAllTags(data));
  }, []);

  //used for gettin the previous tags that are already present in session storage  
  useEffect(() => {
    const handleUserLog = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userStatus = localStorage.getItem('status');
      console.log(userStatus);
      if (userStatus === '1') {
        setIsLoggedIn(1);
      }
      if (storedUser && storedUser.preferences) {
        setSelectedTags(storedUser.preferences);
        setUserName(storedUser.username);
      }
    }
    handleUserLog();
    window.addEventListener('storage', handleUserLog);
    return () => {
      window.removeEventListener('storage', handleUserLog);
    }
  }, [isLoggedin]);

  // heading selection
  const onHeadingSelection = (heading) => {
    const updatedHeadings = selectedHeadings.includes(heading)
      ? selectedHeadings.filter((selectedHeading) => selectedHeading !== heading)
      : [...selectedHeadings, heading];

    setSelectedHeadings(updatedHeadings);

    // setIsHeadingsSelected(updatedHeadings.length >= 3);
  };

  // tag selection
  const onTagSelection = async (tag) => {
    const tagInLowerCase = tag.toLowerCase();
    console.log(tagInLowerCase)
    const updatedTags = selectedTags.includes(tagInLowerCase)
      ? selectedTags.filter((selectedTag) => selectedTag !== tagInLowerCase)
      : [...selectedTags, tagInLowerCase];

    setSelectedTags(updatedTags);

    try {
      const response = await fetch('/api/update-preferences', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tags: updatedTags, username: userName })
      });
      const data = await response.json();
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.preferences = updatedTags;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <div className='theContainer'>
      {isLoggedin === 1 && (
        <div>
          <h2>Select at least 3 categories</h2>
          <div className={Styles.headingSelection}>
            {allTags.map((category, index) => (
              <div key={index}>
                <button
                  onClick={() => onHeadingSelection(category.heading)}
                  className={selectedHeadings.includes(category.heading) ? Styles.headingSelected : Styles.headingButton}
                >
                  {category.heading}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {isLoggedin === 1 && (
        <div>
          <h3>Choose tags from the selected categories</h3>
          {allTags.map((category, index) => (
            selectedHeadings.includes(category.heading) && (
              <div key={index}>
                {/* <h4>{category.heading}</h4> */}
                <div className={Styles.tagList}>
                  {category.tags.map((tag) => (
                    <button
                      key={tag}
                      className={selectedTags.includes(tag.toLowerCase()) ? Styles.selected : Styles.tagButton}
                      onClick={() => onTagSelection(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>

  );
};

export default TagSelector;


//     <div className='theContainer'>
//       {allTags.map((category, index) => (
//         <div key={index}>
//           <h3>{category.heading}</h3>
//           {/* <div className={Styles.tagList}>
//             {category.tags.map((tag) => (
//               <button
//                 key={tag}
//                 className= {selectedTags.includes(tag) ?  Styles.selected : Styles.tagButton }
//                 // style={{
//                 //   backgroundColor: selectedTags.includes(tag) ? 'lightblue' : 'white',
//                 //   borderRadius: '15%',
//                 //   marginRight: '10px'
//                 // }}
//                 onClick={() => onTagSelection(tag)}
//               >
//                 {tag}
//               </button>
//             ))}
//           </div> */}
//         </div>
//       ))}
//     </div>
