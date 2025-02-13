import axios from "axios"

const API_KEY = "d934f1f44b599c665a285e628506c2f2"
const BASE_URL = "https://api.themoviedb.org/3"

export const getPopularMovies = async () => {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es`)
    return response.data.results
}

export const getMoviesByCategory = async (category) => {
    const categories = {
        popular: 'movie/popular',
        top_rated: 'movie/top_rated',
        trending: 'trending/movie/week'
    }

    const response = await axios.get(`${BASE_URL}/${categories[category]}?api_key=${API_KEY}&language=es`)
    return response.data.results
}

export const getSeriesDetails = async (serieId) => {
    const response = await axios.get(`${BASE_URL}/tv/${serieId}?api_key=${API_KEY}&language=es`)
    return response.data
}

export const getSeasonEpisodes = async (serieId, seasonNumber) => {
    const response = await axios.get(`${BASE_URL}/tv/${serieId}/season/${seasonNumber}?api_key=${API_KEY}&language=es`)
    return response.data.episodes
}