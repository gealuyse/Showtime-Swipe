import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'PLACEHOLDER_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'en-US', // Keep English for UI consistency, or 'th-TH' if preferred
        region: 'TH'
    }
});

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const getNowPlayingMovies = async (page = 1) => {
    try {
        const response = await tmdb.get('/movie/now_playing', {
            params: { page }
        });

        return response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
            voteAverage: movie.vote_average,
            releaseDate: movie.release_date,
            overview: movie.overview,
            genreIds: movie.genre_ids
        }));
    } catch (error) {
        console.error("Error fetching now playing movies:", error);
        return [];
    }
};

export const getMovieDetail = async (id) => {
    try {
        // Append release_dates to get certification
        const response = await tmdb.get(`/movie/${id}`, {
            params: { append_to_response: 'release_dates' }
        });
        const movie = response.data;

        // Parse Certification (Priority: TH -> US -> First Available)
        let rating = 'NR';
        if (movie.release_dates && movie.release_dates.results) {
            const thRelease = movie.release_dates.results.find(r => r.iso_3166_1 === 'TH');
            const usRelease = movie.release_dates.results.find(r => r.iso_3166_1 === 'US');

            const targetRelease = thRelease || usRelease || movie.release_dates.results[0];

            if (targetRelease && targetRelease.release_dates) {
                // Find first non-empty certification
                const cert = targetRelease.release_dates.find(d => d.certification !== '');
                if (cert) rating = cert.certification;
            }
        }

        // Fallback for Adult if no cert found
        if (rating === 'NR' && movie.adult) rating = 'R';

        return {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
            voteAverage: movie.vote_average,
            releaseDate: movie.release_date,
            overview: movie.overview,
            rating: rating,
            durationMinutes: movie.runtime || 120,
            genreIds: movie.genres.map(g => g.id),
            genres: movie.genres
        };
    } catch (error) {
        console.error(`Error fetching movie detail for ID ${id}:`, error);
        return null;
    }
};
