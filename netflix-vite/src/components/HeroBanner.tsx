import { useEffect, useState } from "react";
import type { Movie, TMDBResponse } from "../types/movie";
import { getPopularMovies } from "../services/movieApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAddToHistoryMutation } from "../services/historyApi";

interface HeroBannerProps {
  onAboutClick: (movie: Movie) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onAboutClick }) => {
  // Отримуємо функцію перекладу (t) та об'єкт i18n, щоб отримати поточну мову
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; // 'ua' або 'en'
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();
  const [addToHistory] = useAddToHistoryMutation();

  useEffect(() => {
    (async () => {
      try {
        // ВИПРАВЛЕННЯ: Тепер передаємо поточну мову в getPopularMovies
        const data: TMDBResponse<Movie> = await getPopularMovies(1, currentLanguage);
        const pick =
          data.results[Math.floor(Math.random() * data.results.length)];
        setMovie(pick);
      } catch (err) {
        console.error(t("heroBanner.errorLoading"));
        console.error(err);
      }
    })();
    // ДОДАНО: currentLanguage до залежностей. Якщо мова змінюється, фільм перезавантажиться.
  }, [t, currentLanguage]);

  if (!movie) return null;

  // Оскільки HeroBanner використовується у HomePage, яка викликає його як <HeroBanner onAboutClick={handleOpenModal} />, 
  // тут не потрібно робити змін з мовою
  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div
      className="relative h-[85vh] w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backdrop})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#090612] via-[#090612]/90 to-transparent " />

      {/* Purple glow, як на LoginPage */}
      <div className="pointer-events-none absolute -left-20 bottom-10 h-[350px] w-[350px] rounded-full bg-purple-700/20 blur-[140px]" />

      <div className="absolute bottom-36 left-14 w-[750px] text-white ">
        <h1 className="text-7xl font-black
             text-white
             drop-shadow-[1px_1px_1px_rgba(139,92,246,0.9)]
             
             [text-shadow:0_0_10px_rgba(0,0,0,0.8)]">
          {movie.title || movie.original_title}
        </h1>

        <p className="mt-6 text-lg text-gray-200 font-bold line-clamp-3 drop-shadow-md">
          {movie.overview}
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={async () => {
                await addToHistory({
                  id: movie.id,
                  mediaType: "movie",
                  name: movie.title ,
                }).unwrap();
                navigate(`/movie/${movie.id}`);
              }}
            className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white px-8 py-2 rounded-xl w-50 text-lg font-semibold shadow-[0_10px_30px_rgba(109,40,217,0.2)] hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)] transition-all duration-200"
          >
            {t("heroBanner.watchButton")}
          </button>
          <button
            onClick={() => onAboutClick(movie)}
            className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-8 py-2 rounded-xl w-50 text-lg font-semibold transition backdrop-blur-sm"
          >
            {t("heroBanner.aboutButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;