import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getMoviesByCategory } from "../api/tmdb";
import { useNavigate } from "react-router-dom";
import   './Series.css'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

const Home = () => {
    const category = "popular"; 
    const categoryName = "Popular";

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const movieRefs = useRef({});
    const carouselRef = useRef(null);
    const menuOpen = useSelector((state) => state.ui.menuOpen);
    const navigate = useNavigate();

    // Get movies on mount
    useEffect(() => {
        setLoading(true);
        getMoviesByCategory(category)
            .then((data) => {
                console.log(data);
                
                setMovies(data);
            })
            .finally(() => setLoading(false));
    }, []);

    // Move carousel when focusedIndex changes
    useEffect(() => {
        if (movieRefs.current[focusedIndex] && carouselRef.current) {
            const focusedElement = movieRefs.current[focusedIndex];
            const carousel = carouselRef.current;

            const rect = focusedElement.getBoundingClientRect();
            const containerRect = carousel.getBoundingClientRect();

            if (rect.right > containerRect.right) {
                carousel.scrollBy({ left: rect.right - containerRect.right + 20, behavior: "smooth" });
            } else if (rect.left < containerRect.left) {
                carousel.scrollBy({ left: rect.left - containerRect.left - 20, behavior: "smooth" });
            }
        }
    }, [focusedIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") {
                setFocusedIndex((prev) => Math.min(prev + 1, movies.length - 1));
            } else if (e.key === "ArrowLeft") {
                setFocusedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
                navigate(`/series/${movies[focusedIndex]?.id}`);
            } else if (e.key === "Escape") {
                console.log("Open Menu");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [movies, focusedIndex, navigate]);

    return (
        <div className={`content ${menuOpen ? "content-minimized" : "content-expanded"}`}>
            <h2>{categoryName}</h2>

            {loading ? (
                <div className="loading">Loading movies...</div>
            ) : (
                <div className="carousel" ref={carouselRef}>
                    {movies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className={`movie-card ${focusedIndex === index ? "focused" : ""}`}
                            ref={(el) => (movieRefs.current[index] = el)}
                        >
                            <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                            <p>{movie.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
