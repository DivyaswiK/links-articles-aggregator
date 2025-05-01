// 'use client';
// import Styles from './Container.module.css';
// import { useState, useEffect, useRef } from 'react';
// import fetchBlog from '../app/api/extract_link';
// import fetchLinks from '../app/api/links_Fetch';
// import HoverCard from '@/components/HoverCard';
// import { useArticles } from '@/app/contexts/ArticleContext';

// export default function ComponentContainer() {
//     const {articles, setArticles} = useArticles();
//     const [siteLinks, setSiteLinks] = useState([]);
//     const loadedLinks = useRef(new Set());
//     const loadref = useRef(false);
//     const containerRef = useRef(null);
//     const [status, setStatus] = useState(null);
//     const [userTags, setUserTags] = useState([]);
//     const [skip, setSkip] = useState(0);
//     const [limit] = useState(10); 
//     const [newLinks, setNewLinks] = useState([]);


//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const defaultTags = ['entrepreneurship', 'journaling', 'investing', 'love', 'management'];
//             console.log(typeof(defaultTags)+ 'asd');
//             const storedStatus = localStorage.getItem('status');
//             setStatus(storedStatus);
//             const usrPrefs = JSON.parse(localStorage.getItem('user'));
//             if (usrPrefs && usrPrefs.preferences.length >= 1) {
//                 setUserTags(usrPrefs.preferences);
//             } else {
//                 setUserTags(defaultTags);
//             }
//         }
//     }, []);

//     // Fetch initial site links
//     useEffect(() => {
//         if (userTags && userTags.length > 0) {
//             const loadLinks = async () => {
//                 try {
//                     const response = await fetch('/api/get-links',{
//                         method : 'POST',
//                         headers : {
//                             "Content-Type" : "application/json",
//                         },
//                          body: JSON.stringify({links : userTags, skip : skip,limit : limit}),
//                     });

//                     if(response.ok){
//                         const data = await response.json();
//                         setSiteLinks(data.content);
//                         setSkip(data.skip);
//                     }
//                 } catch (error) {
//                     console.error('Error fetching links:', error);
//                 }
//             };
//             console.log(userTags);
//             loadLinks();
//         }

//     }, [userTags]);
//     useEffect(() => {
//         if (siteLinks.length === 0) return;
      
//         siteLinks.forEach(link => {
//           if (loadedLinks.current.has(link)) return;
//           loadedLinks.current.add(link);
//           fetchBlog(link).then(data => {
//             if (data) {
//               const newCard = {
//                 src: data.image_url,
//                 title: data.title,
//                 content: data.content,
//                 link: link,
//               };
//               setArticles(prev => [...prev, newCard]);
//             }
//           }).catch(err => {
//             console.error(`Error fetching blog for ${link}:`, err);
//           });
//         });
//       }, [siteLinks, setArticles]);
      
//     // Infinite scrolling logic
//     useEffect(() => {
        
//         if (!status || status === '0') {
//             return;
//         }

//         const container = containerRef.current;
//         if (!container) return;

//         const handleScroll = () => {
//             if (loadref.current || !container) return;

//             const scrollTop = Math.round(container.scrollTop);
//             const scrollHeight = container.scrollHeight;
//             const clientHeight = container.clientHeight;
//             const offset = 5;
//             // console.log("scroll Top", scrollTop ,'client height',clientHeight,'scroll height',scrollHeight);
//             const isAtBottom = scrollHeight - scrollTop <= clientHeight + offset;
//             // const offset = 2; 
//             // const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= offset;
//             if (isAtBottom) {
//                 loadref.current = true;
//                 // const userPreferredTags2 = ['journaling','blockchain','motherhood'];
//                 const loadMore = async () => {
//                     console.log(skip,'skipped')
//                     console.log(limit,'limited')

//                     try {
//                         const response = await fetch('/api/get-links', {
//                             method: 'POST',
//                             headers: {
//                                 "Content-Type": "application/json",
//                             },
//                             body: JSON.stringify({ links: userTags,skip : skip,limit : limit}),
//                         });
                
//                         if (response.ok) {
//                             const data = await response.json();
//                             setNewLinks(data.content);
//                             setSiteLinks((prevlinks) => {
//                                 const unqlinks = newLinks.filter((link) => !prevlinks.includes(link));
//                                 return [...prevlinks, ...unqlinks];
//                             });
//                             setSkip(data.skip);

//                         }
//                     } catch (error) {
//                         console.error('Error fetching links:', error);
//                     }
//                     loadref.current = false;
//                 };
                
//                 loadMore();
                
//             }
//         };

//         const handleResize = () => {
//             clearTimeout(debounceTimeout);
//             debounceTimeout = setTimeout(() => {
//                 if (status !== '0' && status !== null) handleScroll();
//             }, 200);
//         };

//         container.addEventListener('scroll', handleScroll);
//         window.addEventListener('scroll', handleResize);
//         return () => {
//             container.removeEventListener('scroll', handleScroll);
//             window.removeEventListener('scroll', handleResize);
//         };
//     }, [userTags, status,newLinks]);

//     return (
//         <div
//             className={Styles.container}
//             ref={containerRef}
//             style={{ overflowY: 'scroll' }}
//         >
//             <div className="row">
//                 {/* {cardData.length > 0 ? ( */}
//                 {articles.length > 0 ? (
//                     articles.map((card, index) => (
//                     // cardData.map((card, index) => (
//                         <HoverCard
//                             key={index}
//                             src={card.src}
//                             title={card.title}
//                             content={card.content}
//                             link={card.link}
//                         />
//                     ))
//                 ) : (
//                     <p>Loading...</p>
//                 )}
//             </div>
//         </div>
//     );
// }



'use client';
import Styles from './Container.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import fetchBlog from '../app/api/extract_link';
import HoverCard from '@/components/HoverCard';
import { useArticles } from '@/app/contexts/ArticleContext';

export default function ComponentContainer() {
    const { articles, setArticles } = useArticles();
    const [siteLinks, setSiteLinks] = useState([]);
    const loadedLinks = useRef(new Set());
    const loadref = useRef(false);
    const containerRef = useRef(null);
    const [status, setStatus] = useState(null);
    const [userTags, setUserTags] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit] = useState(10);  // limit is constant
    const debounceTimeout = useRef(null);

    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const defaultTags = ['entrepreneurship', 'journaling', 'investing', 'love', 'management'];
            setStatus(localStorage.getItem('status'));
            const usrPrefs = JSON.parse(localStorage.getItem('user'));
            setUserTags(usrPrefs?.preferences?.length ? usrPrefs.preferences : defaultTags);
        }
    }, []);


    useEffect(() => {
        if (!userTags.length) return;

        const fetchInitialLinks = async () => {
            try {
                const response = await fetch('/api/get-links', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ links: userTags, skip :0, limit }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setSiteLinks(data.content);
                    setSkip(data.content.length);
                }
            } catch (error) {
                console.error('Error fetching links:', error);
            }
        };

        fetchInitialLinks();
    }, [userTags]);

    
    useEffect(() => {
        if (!siteLinks.length) return;

        siteLinks.forEach(link => {
            if (loadedLinks.current.has(link)) return;
            loadedLinks.current.add(link);

            fetchBlog(link)
                .then(data => {
                    if (data) {
                        setArticles(prev => [...prev, {
                            src: data.image_url,
                            title: data.title,
                            content: data.content,
                            link: link,
                        }]);
                    }
                })
                .catch(err => console.error(`Error fetching blog for ${link}:`, err));
        });
    }, [siteLinks, setArticles]);

    const loadMore = useCallback(async () => {
        if (loadref.current) return;
        loadref.current = true;

        try {
            const response = await fetch('/api/get-links', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ links: userTags, skip, limit }),
            });

            if (response.ok) {
                const data = await response.json();

                setSiteLinks(prevLinks => {
                    const uniqueLinks = data.content.filter(link => !prevLinks.includes(link));
                    return [...prevLinks, ...uniqueLinks];
                });

                setSkip(prev => prev + data.content.length);
            }
        } catch (error) {
            console.error('Error fetching links:', error);
        }

        loadref.current = false;
    }, [userTags, skip, limit]);

    
    useEffect(() => {
        if (!status || status === '0') return;

        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (loadref.current || !container) return;

            const scrollTop = Math.round(container.scrollTop);
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            const offset = 2;

            if (scrollHeight - scrollTop <= clientHeight + offset) {
                loadMore();
            }
        };

        const handleResize = () => {
            clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => {
                if (status !== '0' && status !== null) handleScroll();
            }, 200);
        };

        container.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [status, loadMore]);

    return (
        <div className={Styles.container} ref={containerRef} style={{ overflowY: 'scroll' }}>
            <div className="row">
                {articles.length > 0 ? (
                    articles.map((card, index) => (
                        <HoverCard
                            key={index}
                            src={card.src}
                            title={card.title}
                            content={card.content}
                            link={card.link}
                        />
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}
