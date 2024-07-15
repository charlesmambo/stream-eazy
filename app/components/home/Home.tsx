"use client";
import React, { useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Genre from '../genre/Genre';
import { FaStar } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

function Home() {
    interface IMovie {
        poster_path: string;
        title: string;
        genres: { name: string; id: string }[];
        production_countries: { iso_3166_1: string; name: string }[];
        original_language: string;
        release_date: string;
        director: string;
        production: string;
        runtime: string;
        vote_average: string;
        overview: string;
        videos: { results: { type: string; key: string }[] };
    }

    // Here we are checking if the page is loading or not 
    // if it is true it will render the Loading components
    const [isLoading, setIsLoading] = useState(false);

    // Image Loading
    const [isImgLoading, setIsImgLoading] = useState(false);

    const [showPlayer, setShowPlayer] = useState(false);

    const [trailer, setTrailer] = useState("");

    const [movie, setMovie] = useState<IMovie>();

    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        setIsImgLoading(true);

        let searchMovie = searchParams.get("movie");

        if (searchMovie === null) {
            searchMovie = "avengers";
        }

        axios.get(`https://api.themoviedb.org/3/search/movie?query=avengers&api_key=b16cb8a8818bfb233846065d434a0dad`, {
            params: {
                api_key: process.env.NEXT_PUBLIC_API_KEY,
                query: searchMovie,
            },
        }).then((res) => {
            axios.get(`https://api.themoviedb.org/3/movie/${res?.data?.results[0]?.id}?api_key=b16cb8a8818bfb233846065d434a0dad&append_to_response=videos`
            ).then((res) => {
                setMovie(res.data);
                setIsLoading(false);
                console.log(res.data);
            })
        });

    }, [searchParams]);

    useEffect(() => {
        // search for the video with a type equals to trailer
        const trailerIndex = movie?.videos?.results?.findIndex((element) => element.type === "Trailer");

        // Grab a trailer video from youtube
        const movieTrailer = `https://www.youtube.com/watch?v=${movie?.videos?.results[trailerIndex || 0]?.key}`;
        setTrailer(movieTrailer)
    }, [movie])

    return (
        <div className='home-container'>
            <div className="all-content">
                {isLoading && <Loading />}

                <div className="box">
                    <div className="box2">
                        <div className="box3">
                            <Image
                                src={`https://image.tmdb.org/t/p/w300/${movie?.poster_path}`}
                                className='movie-poster'
                                alt='movie cover'
                                onLoad={() => setIsImgLoading(false)}
                                priority
                                width={300}
                                height={300}
                            />
                            {isImgLoading && <Loading />}
                        </div>

                        <div className="abt-movie">
                            <div className="title">
                                <h3>{movie?.title}</h3>
                            </div>

                            <div className="genres">
                                {movie?.genres?.map((genre, index) => (
                                    <Genre
                                        key={genre?.id}
                                        index={index}
                                        length={movie?.genres?.length}
                                        name={genre?.name}
                                    />
                                ))}
                            </div>

                            <div className="movie-info">
                                <p>Country: <span className='abt-movie-text'>{movie?.production_countries?.map(country => country.name).join(', ')}</span></p>
                                <p>Language: <span className='abt-movie-text'>{movie?.original_language?.toUpperCase()}</span></p>
                                <p>Release: <span className='abt-movie-text'>{movie?.release_date}</span></p>
                                <p>Runtime: <span className='abt-movie-text'>{movie?.runtime}</span> Min</p>
                                <div className="ratings">
                                    <p>Ratings: <span className='abt-movie-text'>{movie?.vote_average}</span></p>
                                    <FaStar className='ratings-icon' />
                                    <FaStar className='ratings-icon' />
                                    <FaStar className='ratings-icon' />
                                </div>
                            </div>

                            <div className="overview">
                                <h3>Overview:</h3>
                                <p>{movie?.overview}</p>
                            </div>

                            {/* Watch button */}
                            <div className="play-btn">
                            <div className="watch-movie" onClick={() => setShowPlayer(true)}>
                                <FaCirclePlay className='play-btn-icon' />
                                <p>Watch</p>
                            </div>

                            <div className="close-btn" onClick={() => setShowPlayer(false)}>
                                    <p>Close</p>
                                    <IoIosCloseCircle  className='close-btn-icon' onClick={() => setShowPlayer(false)} />
                                </div>
                                                            
                                </div>

                        </div>

                        {showPlayer && (
                            <div className="player">
                                <ReactPlayer
                                    url={trailer}
                                    width="50%"
                                    height="50%"
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)"
                                    }}
                                    controls={true}
                                    playing={showPlayer}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
