import React from "react";
import { type Movie } from "../types/movie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaPlay, FaTimes } from "react-icons/fa";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePlayClick = () => {
    onClose();
    if (movie.media_type === "movie") {
      navigate(`/movie/${movie.id}`);
    } else {
      navigate(`/tv/${movie.id}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#120D1D]/95 backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl mx-auto w-full max-h-[90vh] relative shadow-[0_25px_80px_rgba(0,0,0,0.55)] animate-slideInUp overflow-hidden">
        {/* Purple background glow, як на LoginPage */}
        <div className="pointer-events-none absolute -right-32 -top-10 h-[300px] w-[300px] rounded-full bg-purple-700/20 blur-[140px] z-0" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-600/15 blur-[140px] z-0" />

        <div className="relative w-full h-96">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#090612] via-transparent to-[#090612]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090612] to-transparent" />
          </div>
        </div>

        <button
          className="absolute top-3 right-3 text-white/70 text-xl p-2 rounded-full transition z-50 hover:bg-white/10 hover:text-white"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <div className="p-8 relative z-10 -mt-24 md:-mt-36">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
            <img
              src={`${IMG_BASE}${movie.poster_path}`}
              alt={movie.title || movie.original_title}
              className="w-24 md:w-40 rounded-lg shadow-lg border-2 border-purple-500/60"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {movie.title || movie.original_title || "Unknown"}
                </h3>
                <div className="flex items-center gap-4 text-purple-200/45 text-sm">
                  {movie.release_date && (
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-yellow-500">
                      <path d="M12 .587l3.668 7.425L24 9.425l-6 5.856L19.332 24 12 20.255 4.668 24 6 15.281 0 9.425l8.332-1.413L12 .587z" />
                    </svg>
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="border border-white/15 rounded-full px-2 py-0.5 text-xs text-white">
                    {movie.media_type || 'movie'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white px-6 py-3 rounded-xl shadow-[0_10px_30px_rgba(109,40,217,0.2)] hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)] transition-all duration-200 flex items-center justify-center gap-2 font-bold w-full mt-4 md:mt-0"
              >
                <FaPlay />
                {t("heroBanner.watchButton")}
              </button>
            </div>
          </div>
          <p className="text-white/60 mb-6 text-sm md:text-base">
            {movie.overview || t("landingPage.noDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;