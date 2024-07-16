"use client";
import React, { useState } from 'react';
import AllContent from '../movie/Movie';
import SearchMovie from '../searchMovie/SearchMovie';
import Navbar from '../navbar/Navbar';

function Home() {
    const [showAllContent, setShowAllContent] = useState(true);
    const [showSearchMovie, setShowSearchMovie] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    return (
        <div className='home-container'>
            <Navbar 
                setShowAllContent={setShowAllContent} 
                setShowSearchMovie={setShowSearchMovie}
                setIsInputFocused={setIsInputFocused}
            />
            {isInputFocused && !showSearchMovie && (
                <h4 style={{ 
                    color: '#17153b', 
                    fontSize: '20px',
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    Searching For a Movie ...
                </h4>
            )}
            {showSearchMovie && <SearchMovie />}
            {showAllContent && <AllContent />}
        </div>
    );
}

export default Home;
