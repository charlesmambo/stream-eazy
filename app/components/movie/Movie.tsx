import axios from 'axios';

const API_URL = 'https://api.themoviedb.org/3';

export async function searchMovies(query: string): Promise<any[]> {
    try {
        const response = await axios.get(`${API_URL}/search/movie`, {
            params: {
                api_key: process.env.NEXT_PUBLIC_API_KEY,
                language: 'en-US',
                query: query,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

export default searchMovies;
