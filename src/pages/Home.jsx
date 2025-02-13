import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getMoviesByCategory,getTvShowsByCategory } from "../api/tmdb";
import   './Series.css'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

const categories = [
    { key: "popular", name: "Popular Movies", type: "movie" },
    { key: "top_rated", name: "Best Rated", type: "movie" },
    { key: "tv_popular", name: "Popular Series", type: "tv" }
]

const Home = () => {

    const [moviesData, setMoviesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [focusedRowIndex, setFocusedRowIndex] = useState(0);
    const [focusedColIndex, setFocusedColIndex] = useState(0);
    const movieRefs = useRef({});
    const carouselsRef = useRef({});
    const menuOpen = useSelector((state) => state.ui.menuOpen);


    // Get movies on mount

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const data = {}
            for (let category of categories) {
                if(category.type === "movie") {
                    data[category.key] = await getMoviesByCategory(category.key)
                } else {
                    data[category.key] = await getTvShowsByCategory("popular")
                }
            }
            setMoviesData(data)
            setLoading(false)
        }
        fetchData()

    }, []);

    

    useEffect(() => {
        const focusedElement = movieRefs.current[`${focusedRowIndex}-${focusedColIndex}`];
        const carousel = carouselsRef.current[focusedRowIndex];

        if (focusedElement && carousel) {
            const rect = focusedElement.getBoundingClientRect();
            const containerRect = carousel.getBoundingClientRect();

            if (rect.right > containerRect.right) {
                carousel.scrollBy({ left: rect.right - containerRect.right + 20, behavior: "smooth" });
            } else if (rect.left < containerRect.left) {
                carousel.scrollBy({ left: rect.left - containerRect.left - 20, behavior: "smooth" });
            }
        }
    }, [focusedRowIndex, focusedColIndex]);


    // Keyboard navigation

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") {
                setFocusedColIndex((prev) => Math.min(prev + 1, moviesData[categories[focusedRowIndex]?.key]?.length - 1));
            } else if (e.key === "ArrowLeft") {
                setFocusedColIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "ArrowDown") {
                setFocusedRowIndex((prev) => Math.min(prev + 1, categories.length - 1));
                setFocusedColIndex(0);
            } else if (e.key === "ArrowUp") {
                setFocusedRowIndex((prev) => Math.max(prev - 1, 0));
                setFocusedColIndex(0);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [moviesData, focusedRowIndex, focusedColIndex]);


    return (
        <div className={`content ${menuOpen ? "content-minimized" : "content-expanded"}`}>
            {loading ? (
                <div className="loading">Loading movies and tv shows...</div>
            ) : (
                categories.map((category, rowIndex) => (
                    <div key={category.key} className="playlist">
                        <h2>{category.name}</h2>
                        <div className="carousel" ref={(el) => (carouselsRef.current[rowIndex] = el)}>
                            {moviesData[category.key]?.map((movie, colIndex) => (
                                <div
                                    key={movie.id}
                                    className={`movie-card ${category.type === "tv" ? "horizontal" : "poster"} ${focusedRowIndex === rowIndex && focusedColIndex === colIndex ? "focused" : ""}`}
                                    ref={(el) => (movieRefs.current[`${rowIndex}-${colIndex}`] = el)}
                                >
                                    <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title || movie.name} />
                                    <p>{movie.title || movie.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Home;
