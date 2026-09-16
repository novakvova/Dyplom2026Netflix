import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Collection, Credits, Movie } from "../types/movie";
import {
  type Video,
  getCollections,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getRecomendationsMovies,
  getSimilarMovies,
} from "../services/movieApi";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";
import { toast } from "react-toastify";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useAddToHistoryMutation } from "../services/historyApi";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { useAddForLaterMutation } from "../services/forLaterApi";
import RatingAndComments from "../components/RatingAndComments";
import { useTranslation } from "react-i18next";


// interface MediaGridProps {
//   title: string;
//   fetchData: (page?: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => Promise<any>;
//   genres: { id: number; name: string }[];
// }


const MovieDetailsPage = () => {

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; 
  
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [collections, setCollections] = useState<Collection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);
  const [director, setDirector] = useState<string | null>(null);
  const [producers, setProducers] = useState<string[]>([]);
  const [writers, setWriters] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);

  const [openedRec, setOpenedRec] = useState<Movie | null>(null); 


  const { data: favorites } = useGetFavoritesQuery();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [inFavorites, setInFavorites] = useState(false);

  const [addToHistory] = useAddToHistoryMutation();
  const [AddForLater] = useAddForLaterMutation();

  const trailerRef = useRef<HTMLDivElement>(null);

  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scroll2 = (direction: 'left' | 'right') => {
    const container2 = container2Ref.current;
    if (!container2) return;
    const scrollAmount = container2.clientWidth;
    container2.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };


  useEffect(() => {
    if (!movieId) return;
    
    (async () => {
      try {
 
        const details = await getMovieDetails(movieId, currentLanguage);
        setMovie(details);

        const credits = await getMovieCredits(movieId, currentLanguage); 
        const newActors = credits.cast.slice(0, 5).map(a => a.name); 
        setActors(newActors);

        const newProducers = credits.crew.filter(c => c.job === "Producer").map(c => c.name);
        setProducers(newProducers);
        
        const newWriters = credits.crew.filter(c => ["Writer", "Screenplay", "Story"].includes(c.job)).map(c => c.name);
        setWriters(newWriters);
        
        const newDirector = credits.crew.find(c => c.job === "Director")?.name || "N/A";
        setDirector(newDirector);

        const similarMovies = await getSimilarMovies(movieId, 1, currentLanguage);
        setSimilar(similarMovies.results || []);

        const recMovies = await getRecomendationsMovies(movieId, 1, currentLanguage);
        setRecommendations(recMovies.results || []);


        if (details.belongs_to_collection) {
          const collectionData = await getCollections(details.belongs_to_collection.id, 1,currentLanguage);
          setCollections(collectionData);
        } else {
          setCollections(null);
        }

        const vids = await getMovieVideos(movieId, currentLanguage);
        setVideos(
          vids.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          )
        );
      } catch (e) {
        console.error(e);
      }
    })();

  }, [movieId, currentLanguage]);

  useEffect(() => {
    if (favorites) {
      setInFavorites(favorites.some((f) => f.contentId === movieId));
    }
  }, [favorites, movieId]);

  const handleFavorite = async () => {
    try {
      const payload = { contentId: movieId, contentType: "movie" };
      if (inFavorites) {
        const favorite = favorites?.find((f) => f.contentId === movieId);
        if (!favorite) return;

        await removeFavorite(favorite.id).unwrap();
        setInFavorites(false);
        toast.info(t("movieDetails.favorites.removed"));
      } else {
        await addFavorite(payload).unwrap();
        setInFavorites(true);
        toast.success(t("movieDetails.favorites.added"));
      }
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info("Вже у списку улюбленних"); // 👈 нове повідомлення
      } else {
        toast.error("Помилка додавання в улюбленне");
      }
    }
  };


  const formatRuntime = (totalMinutes: number) => {
    if (!totalMinutes) return "—";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;


    const hoursText = hours > 0 ? `${hours} ${t('time.hour', { count: hours })}` : '';
    const minutesText = minutes > 0 ? `${minutes} ${t('time.min', { count: minutes })}` : '';
    
    if (hours > 0 && minutes > 0) {
      return `${hoursText} ${minutesText}`;
    } else if (hours > 0) {
      return hoursText;
    } else {
      return minutesText;
    }
  };


  const handlePlay = async (id: number, name: string) => {
    await addToHistory({
      id: id,
      mediaType: "movie",
      name: name,
    }).unwrap();
    navigate(`/movie/${id}`);
    window.location.reload();
  };


  const handleAdd = async (id: number) => {
    try {
      await AddForLater({ contentId: id, contentType: "movie" }).unwrap();
      toast.success(t("movieDetails.forLater.added"));
    } catch (err: any) {
          if (err?.status === 409) {
            toast.info("Вже у списку на потім"); // 👈 нове повідомлення
          } else {
            toast.error("Помилка додавання в список на потім");
          }
        }
  };


  const handleLike = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "movie" };
      await addFavorite(payload).unwrap();
      toast.success(t("movieDetails.favorites.added"));
      console.log("➕ Added to favorites:", id);
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info("Вже у списку улюбленних"); // 👈 нове повідомлення
      } else {
        toast.error("Помилка додавання в улюбленне");
      }
    }
  };
  
  const handleExpand = (id: number) => {
    // Ця функція зараз не використовується, оскільки ми перейшли на відкриття модального вікна
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    setExpandedItems(newExpandedItems);
  };


  if (!movie){
    return (
      <div className="min-h-screen bg-[#090612] flex items-center justify-center relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
        <p className="relative z-10 text-gray-300 text-lg animate-pulse">
          {t("movieDetails.loading")}
        </p>
      </div>
    );
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const trailer = videos[0];



  return (
    <div className="bg-[#090612] text-white min-h-screen relative overflow-hidden">

      {/* Background glow */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none z-0" />

      <div className="relative z-10">

      <Header />

      {/* Backdrop */}
      <div
        className="relative h-[80vh] top-20 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#090612] via-[#090612]/70 to-transparent"></div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 -mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-24 animate-fadeIn">
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-8xl font-extrabold">{movie.title}</h1>
            {movie.tagline && (
              <p className="italic text-gray-400 text-xl">"{movie.tagline}"</p>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={scrollToTrailer}
                className="bg-gradient-to-r from-purple-600 to-violet-500 gap-2 text-2xl text-white font-semibold rounded-xl w-1/4 h-12 flex items-center justify-center hover:from-purple-500 hover:to-violet-400 hover:scale-[1.03] shadow-lg shadow-purple-900/30 transition"
              >
                <Play size={18} fill="currentColor" />
                {t("movieDetails.watchButton")}
              </button>

              <button
                onClick={() => handleAdd(movie.id)}
                className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-full w-12 h-12 flex items-center justify-center ml-8 text-gray-300 hover:bg-white/10 hover:text-white hover:border-purple-500/50 hover:scale-105 transition"
              >
                <Plus size={18} />
              </button>

              <button
                onClick={handleFavorite}
                className={`border rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-xl hover:scale-105 transition ${
                  inFavorites
                    ? "bg-purple-600/20 border-purple-500/60 text-purple-400"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ThumbsUp
                  className={`w-6 h-6 ${inFavorites ? "text-purple-400" : ""}`}
                />
              </button>
            </div>

            <div className="mt-56 text-gray-300">

              <div className="grid md:grid-cols-2 gap-24">
                <div className="flex flex-col gap-2 text-sm">
                  {collections?.name && (
                    <p className="leading-relaxed text-3xl mb-0 font-regular text-white">{collections.name}</p>
                  )}
                  <div className="text-2xl font-semibold text-gray-400">
                    <span>{movie.release_date?.slice(0, 4)}</span>
                  </div>
                  <div className="text-2xl font-medium text-gray-400">
                    {movie.runtime ? formatRuntime(movie.runtime) : "—"}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-3 text-2xl font-semibold text-gray-400">
                    {movie.genres?.map((g, index) => (
                      <span
                        key={g.id}
                        className={`${index > 0 ? ' relative pl-6 before:absolute before:left-0 before:content-["•"] before:text-white/80 before:font-black' : ''}`}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>

                  
                  <p className="leading-relaxed text-base text-white">{movie.overview}</p>
                </div>

                <div className="space-y-2 text-sm font-sans">
                  <p>
                    <span className="text-gray-400 text-lg font-regular mr-1">{t("movieDetails.popularity")}:</span>{" "}
                    <span className="text-white text-lg font-regular">{movie.popularity}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">{t("movieDetails.director")}:</span>{" "}
                    <span className="text-white text-lg font-regular">{director}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">{t("movieDetails.producers")}:</span>{" "}
                    <span className="text-white text-lg font-regular">{producers.join(", ")}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">{t("movieDetails.actors")}:</span>{" "}
                    <span className="text-white text-lg font-regular">{actors.join(", ")}</span>
                  </p>
                  <p>
                    <span className="text-gray-400 text-lg font-regular">{t("movieDetails.writers")}:</span>{" "}
                    <span className="text-white text-lg font-regular">{writers.join(", ")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div ref={trailerRef} id="trailer-section" className="relative mt-20 max-w-7xl mx-auto px-4 md:px-0 animate-fadeIn">
          <h2 className="text-3xl bg-[#120D1D] border border-white/10 rounded-xl text-center absolute -mt-10 h-24 w-1/6 font-semibold flex items-center justify-center">{t("movieDetails.trailer")}</h2>
          <div className="aspect-video z-100 overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-purple-950/20 z-10 relative">

            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}


      {collections != null && collections.parts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <h2 className="text-3xl font-semibold mb-6">{t("movieDetails.collection")}</h2>
          <div className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth ">
              {collections.parts.map((c) => (

              <div
                key={c.id}
                className="cursor-pointer hover:-translate-y-2 transition-all duration-300 rounded-2xl border border-white/10 bg-[#120D1D]/95 backdrop-blur-xl shadow-2xl shadow-purple-950/20 hover:border-purple-500/40 hover:shadow-purple-900/30 min-w-[256px]"
                onClick={() => handlePlay(c.id, c.title)} // Клік на картку веде на фільм
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${c.poster_path}`}
                  alt={c.title}
                  className="rounded-t-2xl shadow-md w-full h-80 object-cover"
                />
              <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePlay(c.id, c.title); }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white flex items-center justify-center hover:from-purple-500 hover:to-violet-400 hover:scale-110 shadow-lg shadow-purple-900/30 transition"
                >
                  <Play size={17} fill="currentColor" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAdd(c.id); }}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(c.id); }}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <ThumbsUp size={17} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenedRec(c as Movie); }}
                  className="ml-auto w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="px-2 py-0.5 border border-white/10 bg-white/5 rounded-md">HD</span>
                <span className="px-2 py-0.5 border border-white/10 bg-white/5 rounded-md">16+</span>
                {/* Оскільки c.genres недоступний тут, тимчасово ігноруємо, або припустимо, що в c є genre_ids */}
                <span className="text-sm font-semibold text-gray-200">{c.title.split(' ').pop()}</span>
              </div>
              </div>
            </div>
            ))}
          </div>
          </div>
        
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <div className="inline-flex justify-between w-full">
            <h2 className="text-3xl font-semibold mb-6">{t("movieDetails.recommendations")}</h2>
            <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
            >
              <span className="text-3xl font-regular">‹</span>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
            >
              <span className="text-3xl font-regular">›</span>
            </button>
          </div>
          </div>
          
          
          <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="cursor-pointer hover:-translate-y-2 transition-all duration-300 rounded-2xl border border-white/10 bg-[#120D1D]/95 backdrop-blur-xl shadow-2xl shadow-purple-950/20 hover:border-purple-500/40 hover:shadow-purple-900/30 relative min-w-[256px]"
                onClick={() => handlePlay(rec.id, rec.title)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                  alt={rec.title}
                  className="rounded-t-2xl shadow-md w-full h-80 object-cover "
                />
                <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePlay(rec.id, rec.title); }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white flex items-center justify-center hover:from-purple-500 hover:to-violet-400 hover:scale-110 shadow-lg shadow-purple-900/30 transition"
                >
                  <Play size={17} fill="currentColor" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAdd(rec.id); }} 
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(rec.id); }} 
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <ThumbsUp size={17} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenedRec(rec); }}
                  className="ml-auto w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="px-2 py-0.5 border border-white/10 bg-white/5 rounded-md">HD</span>
                <span className="px-2 py-0.5 border border-white/10 bg-white/5 rounded-md">16+</span>
              
              </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 animate-fadeIn">
          <div className="inline-flex justify-between w-full">
          <h2 className="text-3xl font-semibold mb-6">{t("movieDetails.similar")}</h2>
            <div className="flex gap-2">
            <button
              onClick={() => scroll2('left')}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
            >
              <span className="text-3xl font-regular">‹</span>
            </button>
            <button
              onClick={() => scroll2('right')}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
            >
              <span className="text-3xl font-regular">›</span>
            </button>
          </div>
          </div>
          <div ref={container2Ref} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
            {similar.map((sm) => (
              <div
                key={sm.id}
                className="cursor-pointer hover:-translate-y-2 transition-all duration-300 rounded-2xl border border-white/10 bg-[#120D1D]/95 backdrop-blur-xl shadow-2xl shadow-purple-950/20 hover:border-purple-500/40 hover:shadow-purple-900/30 min-w-[256px]"
                onClick={() => handlePlay(sm.id, sm.title)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${sm.poster_path}`}
                  alt={sm.title}
                  className="rounded-t-2xl shadow-md w-full h-80 object-cover "
                />
                <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePlay(sm.id, sm.title); }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-500 text-white flex items-center justify-center hover:from-purple-500 hover:to-violet-400 hover:scale-110 shadow-lg shadow-purple-900/30 transition"
                >
                  <Play size={17} fill="currentColor" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAdd(sm.id); }}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(sm.id); }}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <ThumbsUp size={17} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenedRec(sm); }}
                  className="ml-auto w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <span className="px-2 py-0.5 border border-white/10 bg-white/5 rounded-md">HD</span>
                <span className="px-2 py-0.5 border border-white/10 bg-white/5 rounded-md">12+</span>
                
              </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 mt-16 mb-20 gap-12">
        <div className="rounded-2xl border border-white/10 bg-[#120D1D]/80 backdrop-blur-xl p-5 md:p-8 shadow-2xl shadow-purple-950/20">
          <RatingAndComments
            contentId={movie.id}
            contentType="movie"
            vote_average={movie.vote_average}
          />
        </div>
      </div>

      {openedRec && (
          <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
              onClick={() => setOpenedRec(null)} 
          >
              <div 
                  className="bg-[#120D1D] border border-white/10 max-w-lg w-full rounded-2xl p-6 relative shadow-2xl shadow-purple-950/50 animate-fadeIn transform transition-all"
                  onClick={(e) => e.stopPropagation()}
              >
                  <button
                      onClick={() => setOpenedRec(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/10 bg-white/5 text-gray-400 flex items-center justify-center hover:bg-white/10 hover:text-white hover:border-purple-500/40 transition"
                  >
                      ✕
                  </button>
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-4 pr-10 border-b border-white/10 pb-4">{openedRec.title || openedRec.original_title}</h3>
                  <p className="text-base text-gray-300 overflow-y-auto max-h-64 mt-4">
                      {openedRec.overview || t("movieDetails.noOverview")}
                  </p>
                  <div className="mt-6 flex justify-end">
                      <button
                          onClick={() => {
                              handlePlay(openedRec.id, openedRec.title);
                              setOpenedRec(null);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:from-purple-500 hover:to-violet-400 shadow-lg shadow-purple-900/20 transition"
                      >
                          <Play size={16} fill="currentColor" />
                          {t("movieDetails.play")}
                      </button>
                  </div>
              </div>
          </div>
      )}

      <Footer />
      </div>
    </div>
  );
};

export default MovieDetailsPage;