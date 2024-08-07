"use client";
import { useRouter } from 'next/navigation';
import React, { useState, Dispatch, SetStateAction } from 'react';
import Link from 'next/link';

interface NavbarProps {
    setShowAllContent: Dispatch<SetStateAction<boolean>>;
    setShowSearchMovie: Dispatch<SetStateAction<boolean>>;
    setIsInputFocused: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setShowAllContent, setShowSearchMovie, setIsInputFocused }) => {
    const [input, setInput] = useState("");
    const router = useRouter();

    // Search Movie Function
    const searchMovie = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return; // Check if input is empty or just whitespace
        router.push(`?movie=${input}`);
        setInput("");
        setShowSearchMovie(true);
        setShowAllContent(false);
    };

    const handleInputFocus = () => {
        setShowAllContent(false);
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        setIsInputFocused(false);
    };

    const handleLogoClick = () => {
        setShowAllContent(true);
        setShowSearchMovie(false);
        setIsInputFocused(false);
    };

    return (
        <>
            <nav>
                {/* Logo Container */}
                <ul>
                    <li>
                        <Link className='nav-link' href="/" onClick={handleLogoClick}>StreamEazy</Link>
                    </li>
                </ul>

                {/* Search Bar  */}
                <form onSubmit={searchMovie}>
                    <div className="form-control">
                        <input type="text"
                            value={input}
                            placeholder='Search a Movie...' 
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    <button type="submit">
                        Search
                    </button>
                </form>
            </nav>
        </>
    );
}

export default Navbar;
