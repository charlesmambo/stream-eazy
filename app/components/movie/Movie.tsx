"use client";
import React, { useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import Image from 'next/image';
import axios from 'axios';
import Genre from '../genre/Genre';
import { FaStar, FaPlayCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface IMovie {
    id: number;
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

const AllContent: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isImgLoading, setIsImgLoading] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [trailer, setTrailer] = useState("");
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        setIsImgLoading(true);

        let searchMovie = searchParams.get("movie");

        const movieTitles = ["Boyka", "American Sniper", "Zero Dark Thirty", "Lone Survivor", "Guy Ritchie's The Covenant", "The Fall Guy","Kandahar", "The Social Network", "Antitrust", "Live Free or Die Hard"];
        const moviePromises = movieTitles.map((title) =>
            axios.get(`https://api.themoviedb.org/3/search/movie?query=avengers&api_key=b16cb8a8818bfb233846065d434a0dad`, {
                params: {
                    api_key: process.env.NEXT_PUBLIC_API_KEY,
                    query: title,
                },
            }).then((res) => axios.get(`https://api.themoviedb.org/3/movie/${res.data.results[0].id}?api_key=b16cb8a8818bfb233846065d434a0dad&append_to_response=videos`))
        );

        Promise.all(moviePromises).then((responses) => {
            setMovies(responses.map((response) => response.data));
            setIsLoading(false);
        });
    }, [searchParams]);

    useEffect(() => {
        if (selectedMovie) {
            const trailerIndex = selectedMovie.videos.results.findIndex((element) => element.type === "Trailer");
            const movieTrailer = `https://www.youtube.com/watch?v=${selectedMovie.videos.results[trailerIndex || 0]?.key}`;
            setTrailer(movieTrailer);
        }
    }, [selectedMovie]);

    function truncateText(text: string, maxLength: number): string {
        if (text && text.length > maxLength) {
            return text.substr(0, maxLength) + '...';
        }
        return text;
    }

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
        <div className="all-content">
            {isLoading && <Loading />}

            <div className="main-container">
                {movies.map((movie) => (
                    <div key={movie.id} className="box2">
                        <div className="movie-image-container">
                            <Image
                                src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
                                className='movie-poster'
                                alt='movie cover'
                                onLoad={() => setIsImgLoading(false)}
                                width={300}
                                height={500}
                                layout="responsive"
                            />
                            {isImgLoading && <Loading />}
                        </div>

                        <div className="abt-movie">
                            <div className="title">
                                <h3>{movie.title}</h3>
                            </div>

                            <div className="genres">
                                {movie.genres.map((genre, index) => (
                                    <Genre
                                        key={genre.id}
                                        index={index}
                                        length={movie.genres.length}
                                        name={genre.name}
                                    />
                                ))}
                            </div>

                            <div className="movie-info">
                                <p>Country: <span className='abt-movie-text'>{movie.production_countries.map(country => country.name).join(', ')}</span></p>
                                <p>Language: <span className='abt-movie-text'>{movie.original_language.toUpperCase()}</span></p>
                                <p>Release: <span className='abt-movie-text'>{movie.release_date}</span></p>
                                <p>Runtime: <span className='abt-movie-text'>{movie.runtime}</span> Min</p>
                                <div className="ratings">
                                    <p>Ratings: <span className='abt-movie-text'>{movie.vote_average}</span></p>
                                    {renderStars(movie.vote_average)}
                                </div>
                            </div>

                            <div className="overview">
                                <h3>Overview:</h3>
                                <p>{truncateText(movie.overview, 200)}</p>
                            </div>

                            <div className="play-btn">
                                <div className="watch-movie" onClick={() => { setShowPlayer(true); setSelectedMovie(movie); }}>
                                    <FaPlayCircle className='play-btn-icon' />
                                    <p>Watch</p>
                                </div>

                                <div className="close-btn" onClick={() => setShowPlayer(false)}>
                                    <p>Close</p>
                                    <IoIosCloseCircle className='close-btn-icon' onClick={() => setShowPlayer(false)} />
                                </div>
                            </div>
                        </div>

                        {showPlayer && selectedMovie?.id === movie.id && (
                            <div className="player">
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
                ))}
            </div>
        </div>
    );
};

export default AllContent;
