import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSeasonEpisodes, getSeriesDetails } from "../api/tmdb";
import "./Series.css"; 

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const Series = () => {
    const { id } = useParams();
    const [series, setSeries] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [focusedSeasonIndex, setFocusedSeasonIndex] = useState(0);
    const [focusedEpisodeIndex, setFocusedEpisodeIndex] = useState(0);
    const menuOpen = useSelector((state) => state.ui.menuOpen);

    const seasonRefs = useRef({});
    const episodeRefs = useRef({});
    const seasonCarouselRef = useRef(null);
    const episodeListRef = useRef(null);

    // Get Series details on mount
    useEffect(() => {
        getSeriesDetails(id).then((data) => {
            setSeries(data);
            if (data.seasons.length > 0) {
                setSelectedSeason(data.seasons[0].season_number);
            }
        });
    }, [id]);

    // Get episodes from season when selectedSeason changes
    useEffect(() => {
        if (selectedSeason != null) {
            getSeasonEpisodes(id, selectedSeason).then(setEpisodes);
        }
    }, [selectedSeason, id]);

    // Move carousel  when focusedSeasonIndex changes
    useEffect(() => {
        if (seasonRefs.current[focusedSeasonIndex] && seasonCarouselRef.current) {
            seasonRefs.current[focusedSeasonIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [focusedSeasonIndex]);

    // Move episode list when focusedEpisodeIndex changes
    useEffect(() => {
        if (episodeRefs.current[focusedEpisodeIndex] && episodeListRef.current) {
            episodeRefs.current[focusedEpisodeIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [focusedEpisodeIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") {
                setFocusedSeasonIndex((prev) => Math.min(prev + 1, series?.seasons.length - 1));
            } else if (e.key === "ArrowLeft") {
                setFocusedSeasonIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
                setSelectedSeason(series?.seasons[focusedSeasonIndex].season_number);
                setFocusedEpisodeIndex(0); 
            } else if (e.key === "ArrowDown") {
                setFocusedEpisodeIndex((prev) => Math.min(prev + 1, episodes.length - 1));
            } else if (e.key === "ArrowUp") {
                setFocusedEpisodeIndex((prev) => Math.max(prev - 1, 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [series, focusedSeasonIndex, focusedEpisodeIndex, episodes]);

    if (!series) return <div className="loading">Loading...</div>;

    return (
        <div className={`content ${menuOpen ? "" : "full"}`} style={{ padding: "20px" }}>
            <div className="series-header">
                <h1>{series.name}</h1>
                <p>{series.overview}</p>
            </div>

            <h2>Seasons</h2>
            <div className="carousel" ref={seasonCarouselRef}>
                {series.seasons.map((season, index) => (
                    <div
                        key={season.id}
                        className={`season-card ${focusedSeasonIndex === index ? "focused" : ""}`}
                        ref={(el) => (seasonRefs.current[index] = el)}
                        onClick={() => setSelectedSeason(season.season_number)}
                    >
                        {season.poster_path ? (
                            <img src={`${IMAGE_BASE_URL}${season.poster_path}`} alt={season.name} />
                        ) : (
                            <div className="no-image"> Without Images</div>
                        )}
                        <p>{season.name}</p>
                    </div>
                ))}
            </div>

            <h2>Episodes</h2>
            <div className="episode-list" ref={episodeListRef}>
                {episodes.length === 0 ? (
                    <p>No Episodes available </p>
                ) : (
                    episodes.map((episode, index) => (
                        <div
                            key={episode.id}
                            className={`episode-card ${focusedEpisodeIndex === index ? "focused" : ""}`}
                            ref={(el) => (episodeRefs.current[index] = el)}
                        >
                            {episode.still_path && (
                                <img src={`https://image.tmdb.org/t/p/w300${episode.still_path}`} alt={episode.name} />
                            )}
                            <div>
                                <h3>{episode.episode_number}. {episode.name}</h3>
                                <p>{episode.overview}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Series;
