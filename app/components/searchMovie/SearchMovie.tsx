"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Loading from '../loading/Loading';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Genre from '../genre/Genre';
import { FaStar } from "react-icons/fa";
import { FaPlayCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import dynamic from 'next/dynamic';

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

function SearchMovie() {
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

    const [isLoading, setIsLoading] = useState(false);
    const [isImgLoading, setIsImgLoading] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [trailer, setTrailer] = useState("");
    const [movie, setMovie] = useState<IMovie>();
    const searchParams = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setIsImgLoading(true);
        setError(null);

        let searchMovie = searchParams.get("movie") || "";

        if (searchMovie === null) {
            searchMovie = "";
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
        }).catch((err) => {
            console.error(err);
            setIsLoading(false);
            setIsImgLoading(false);
        }).finally(() => {
            setIsLoading(false);
            setIsImgLoading(false);
        });

    }, [searchParams]);

    useEffect(() => {
        const trailerIndex = movie?.videos?.results?.findIndex((element) => element.type === "Trailer");
        const movieTrailer = `https://www.youtube.com/watch?v=${movie?.videos?.results[trailerIndex || 0]?.key}`;
        setTrailer(movieTrailer)
    }, [movie])

    const renderStars = (vote: number) => {
        const stars = [];
        const fullStars = Math.floor(vote / 2);
        const halfStars = vote % 2 >= 0.5 ? 1 : 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className='ratings-icon' />);
        }

        if (halfStars) {
            stars.push(<FaStar key={fullStars} className='ratings-icon half-star' />);
        }

        return stars;
    };

    return (
        <div className='home-container'>
            <div className="all-content">
                {isLoading && <Loading />}
                <div className="main-container">
                    <div className="search">
                        <div className="search-movie-card">
                            <div className="search-movie-img-container">
                                <Image
                                    src={`https://image.tmdb.org/t/p/w300/${movie?.poster_path}`}
                                    className='search-movie-img'
                                    alt='movie cover'
                                    onLoad={() => setIsImgLoading(false)}
                                    width={300}
                                    height={500}
                                    layout="responsive"
                                />
                                {isImgLoading && <Loading />}
                            </div>
                            <div className="search-your-movie">
                                <div className="title">
                                    <h1>{movie?.title}</h1>
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
                                <div className="search-moive-content">
                                    <p>Country: <span className='search-movie-highlightext'>{movie?.production_countries?.map(country => country.name).join(', ')}</span></p>
                                    <p>Language: <span className='search-movie-highlightext'>{movie?.original_language?.toUpperCase()}</span></p>
                                    <p>Release: <span className='search-movie-highlightext'>{movie?.release_date}</span></p>
                                    <p>Runtime: <span className='search-movie-highlightext'>{movie?.runtime}</span> Min</p>
                                    <div className="ratings">
                                        <p>Ratings: <span className='search-movie-highlightext'>{movie?.vote_average}</span></p>
                                        {movie?.vote_average && renderStars(Number(movie.vote_average))}
                                    </div>
                                </div>
                                <div className="overview">
                                    <h2 className='overview-title'>Overview:</h2>
                                    <p className='overview-text'>{movie?.overview}</p>
                                </div>
                                <div className="search-play-btn">
                                    <div className="watch-movie" onClick={() => setShowPlayer(true)}>
                                        <FaPlayCircle className='play-btn-icon' />
                                        <p>Watch</p>
                                    </div>
                                    <div className="close-btn" onClick={() => setShowPlayer(false)}>
                                        <p>Close</p>
                                        <IoIosCloseCircle className='close-btn-icon' />
                                    </div>
                                </div>
                            </div>
                            {showPlayer && (
                                <div className="play-search-movie">
                                    <ReactPlayer
                                        url={trailer}
                                        width="85%"
                                        height="65%"
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
        </div>
    )
}

export default function SearchMovieWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <SearchMovie />
        </Suspense>
    );
}
