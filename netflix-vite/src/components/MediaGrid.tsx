import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { useAddFavoriteMutation } from "../services/favoritesApi";
import { useAddForLaterMutation } from "../services/forLaterApi";
import { useFilters } from "../context/FilterContext";
import { useAddToHistoryMutation } from "../services/historyApi";
import { useTranslation } from "react-i18next";

interface MediaGridProps {
  title: string;
  fetchData: (
    page?: number,
    filters?: {
      ratingFrom: number;
      ratingTo: number;
      genres: number[];
    }
  ) => Promise<any>;
  genres: { id: number; name: string }[];
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MediaGrid = ({ title, fetchData, genres }: MediaGridProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [addFavorite] = useAddFavoriteMutation();
  const [AddForLater] = useAddForLaterMutation();
  const [addToHistory] = useAddToHistoryMutation();

  const { filters } = useFilters();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    loadData(1, true);
  }, [fetchData, filters]);

  const loadData = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchData(pageNum, filters);

      setItems((prev) =>
        reset ? data.results : [...prev, ...data.results]
      );

      setPage(pageNum);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const getGenres = (genreIds: number[]) => {
    return genreIds
      ?.map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
  };

  // Визначаємо тип контенту
  const getMediaType = (item: any): "movie" | "tv" => {
    if (item.media_type === "tv") {
      return "tv";
    }

    if (item.media_type === "movie") {
      return "movie";
    }

    return item.first_air_date ? "tv" : "movie";
  };

  const handlePlay = async (item: any) => {
    const mediaType = getMediaType(item);
    const name = item.title || item.name || "Unknown";

    try {
      await addToHistory({
        id: item.id,
        mediaType,
        name,
      }).unwrap();

      if (mediaType === "tv") {
        navigate(`/series/${item.id}`);
      } else {
        navigate(`/movie/${item.id}`);
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to add to history:", error);

      if (mediaType === "tv") {
        navigate(`/series/${item.id}`);
      } else {
        navigate(`/movie/${item.id}`);
      }
    }
  };

  const handleAdd = async (item: any) => {
    try {
      const mediaType = getMediaType(item);

      const payload = {
        contentId: item.id,
        contentType: mediaType,
      };

      await AddForLater(payload).unwrap();

      toast.success("Added to 'Watch Later' list");
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info(t("mediaGrid.alreadyInWatchLater"));
      } else {
        toast.error(t("mediaGrid.addToWatchLaterError"));
      }
    }
  };

  const handleLike = async (item: any) => {
    try {
      const mediaType = getMediaType(item);

      const payload = {
        contentId: item.id,
        contentType: mediaType,
      };

      await addFavorite(payload).unwrap();

      toast.success("Added to favorites 👍");
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info(t("mediaGrid.alreadyInWatchLater"));
      } else {
        toast.error(t("mediaGrid.addToWatchLaterError"));
      }
    }
  };

  if (error) {
    return (
      <p className="text-red-500 text-center">
        {error}
      </p>
    );
  }

  return (
    <div>
      {/* TITLE */}
      <div className="mb-7">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {title}
        </h2>

        <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {items.map((item) => {
          const mediaType = getMediaType(item);

          return (
            <div
              key={`${mediaType}-${item.id}`}
              className="relative group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-[#120D1D] hover:border-purple-500/50 transition-colors aspect-[2/3]"
            >
              {/* POSTER */}
              <div className="relative w-full h-full">
                <img
                  src={
                    item.poster_path
                      ? `${IMAGE_BASE_URL}${item.poster_path}`
                      : "/no-poster.png"
                  }
                  alt={item.title || item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* RATING */}
                <div className="absolute top-2 right-2 z-10 rounded-md bg-black/80 px-2 py-1 text-sm font-semibold text-yellow-400 backdrop-blur-sm">
                  ⭐{" "}
                  {item.vote_average != null
                    ? Number(item.vote_average).toFixed(1)
                    : "—"}
                </div>
              </div>

              {/* HOVER WINDOW */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-[#090612]/95 backdrop-blur-sm p-3 rounded-t-lg border-t border-white/10">
                
                {/* ONLY 3 BUTTONS */}
                <div className="flex items-center gap-3 mb-3">
                  
                  {/* PLAY */}
                  <button
                    onClick={() => handlePlay(item)}
                    className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                    aria-label="Play"
                  >
                    <Play size={18} />
                  </button>

                  {/* WATCH LATER */}
                  <button
                    onClick={() => handleAdd(item)}
                    className="border border-white/30 rounded-full p-2 text-white hover:border-purple-400 hover:text-purple-300 transition"
                    aria-label="Add to watch later"
                  >
                    <Plus size={18} />
                  </button>

                  {/* FAVORITE */}
                  <button
                    onClick={() => handleLike(item)}
                    className="border border-white/30 rounded-full p-2 text-white hover:border-purple-400 hover:text-purple-300 transition"
                    aria-label="Add to favorites"
                  >
                    <ThumbsUp size={18} />
                  </button>

                </div>

                {/* INFO */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  <span className="px-2 py-0.5 border border-white/20 rounded">
                    HD
                  </span>

                  <span className="px-2 py-0.5 border border-white/20 rounded">
                    6+
                  </span>

                  <span className="px-2 py-0.5 border border-yellow-500/30 rounded text-yellow-400">
                    ⭐{" "}
                    {item.vote_average != null
                      ? Number(item.vote_average).toFixed(1)
                      : "—"}
                  </span>

                  {getGenres(item.genre_ids)?.map((g, idx) => (
                    <span key={idx}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE */}
      <div className="flex justify-center mt-8">
        {loading ? (
          <p className="text-gray-400">
            Loading...
          </p>
        ) : (
          <button
            onClick={() => loadData(page + 1)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaGrid;