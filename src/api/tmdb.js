import axios from "axios"

const API_KEY = "d934f1f44b599c665a285e628506c2f2"
const BASE_URL = "https://api.themoviedb.org/3"

export const getPopularMovies = async () => {
    
    try {
        const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es`)
        return response.data.results
    } catch (error) {
        console.log("Error fetching popular movies", error);
        return []
    }

}

export const getMoviesByCategory = async (category) => {
   
    try {
        const response = await axios.get(`${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=es`)
        return response.data.results
        
    } catch (error) {
        console.log("Error fetching popular movies", error);
        return []   
    }
}

export const getSeriesDetails = async (serieId) => {
    
    try {
        const response = await axios.get(`${BASE_URL}/tv/${serieId}?api_key=${API_KEY}&language=es`)
        return response.data
        
    } catch (error) {
        console.log("Error fetching serie details", error);
        return []
       
    }
   
}

export const getSeasonEpisodes = async (serieId, seasonNumber) => {
    try {
        const response = await axios.get(`${BASE_URL}/tv/${serieId}/season/${seasonNumber}?api_key=${API_KEY}&language=es`)
        return response.data.episodes
        
    } catch (error) {
        console.log("Error fetching season episodes", error);
        return []
    }
}

export const getTvShowsByCategory = async (category) => {
   try {
    const response = await axios.get(`${BASE_URL}/tv/${category}?api_key=${API_KEY}&language=es-ES`);
        return response.data.results;
   } catch (error) {
    console.log("Error fetching popular series", error);
    return []
   }
};