'use client'
import Link from "next/link";
// import Image from "next/image";
import Styles from './header.module.css';
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
export default function Header() {
    const [activeLnk, setActive] = useState('');
    const {status,logOut} = useAuth();
    const router = useRouter();


    const handleActive = (tagname) => {
        setActive(tagname);
    };

    const handleSignout = () =>{
        logOut();
        router.push('/');
    };

    return (
        <div className={Styles.headerDiv}>
            {/* <div className={Styles.curved}></div> */}
            <aside className={Styles.sidebar}>
                <div className={Styles.verticalButtons}>
                    <Link href='/selectTags' className={activeLnk === 'tags' ? Styles.active : ''} onClick={() => handleActive('tags')}>Tags</Link>
                    <Link href='/links' className={activeLnk === 'links' ? Styles.active : ''} onClick={() => handleActive('links')}>Links</Link>
                    {/* <Link href='/signup' className={activeLnk === 'signup' ? Styles.active :''} onClick={() => handleActive('signup')}>Sign up</Link> */}
                </div>
            </aside>
            <header className={Styles.header}>
                <nav className={Styles.navList}>
                    <ul className={Styles.leftNav}>
                        <li>
                            <Link href='/' >
                                {/* <Image src={'/logo.jpg'} alt='logo' className={Styles.logo} width={50} height={50}></Image> */}
                                <h3>LnA</h3>
                            </Link>
                        </li>
                    </ul>
                    <ul className={Styles.rightNav}>
                        <li><Link href='/' className={activeLnk === 'home' && status === 1 ? Styles.active : ''} onClick={() => handleActive('home')}>Home</Link></li>
                        <li><Link href='/about' className={activeLnk === 'about' && status === 1 ?  Styles.active : ''} onClick={() => handleActive('about')}>About</Link></li>
                        <li><Link href='/profile' className={activeLnk === 'profile' && status === 1 ? Styles.active : ''} onClick={() => handleActive('profile')}>Profile</Link></li>
                        {status === 0 ? (
                            <>
                                <li><Link href='/login' className={activeLnk === 'login'  ? Styles.active : ''} onClick={() => handleActive('login')}>Sign in</Link></li>
                                <li><Link href='/signup' className={activeLnk === 'signup'  ? Styles.active : ''} onClick={() => handleActive('signup')}>Sign up</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link href='/' className={activeLnk === 'signout' ? Styles.active : ''} onClick={handleSignout}>Sign out</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
        </div>
    )
};