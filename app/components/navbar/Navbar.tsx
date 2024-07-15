"use client";
import { useRouter } from 'next/navigation';
import React, {useState} from 'react';
import Link from 'next/link'; 


const Navbar = () => {

const [input, setInput] = useState("");
const router = useRouter();


// Search Movie Function
const searchMovie = (e) =>{
    e.preventDefault();
    router.push(`?movie=${input}`);
    setInput("");
}



  return (
    <>
    <nav>
        {/* Logo Container */}
        <ul>
            <li>
            <Link className='nav-link' href="/">StreamEazy</Link>
            </li>
        </ul>

        {/* Search Bar  */}
        <form onSubmit={searchMovie}>
            <div className="form-control">
                <input type="text"
                value={input}
                placeholder='Search a Movie...' 
                onChange={(e) => setInput(e.target.value)}
                />
            </div>

            <button type="submit">
                Search
            </button>
        </form>
    </nav>
    </>
  )
}

export default Navbar