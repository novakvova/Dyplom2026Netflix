import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useAddFavoriteMutation } from "../services/favoritesApi";
import { useAddForLaterMutation } from "../services/forLaterApi";
import { useFilters } from "../context/FilterContext";
import { useAddToHistoryMutation } from "../services/historyApi";
import { useTranslation } from "react-i18next";

interface MediaGridProps {
  title: string;
  fetchData: (page?: number, filters?: { ratingFrom: number; ratingTo: number; genres: number[] }) => Promise<any>;
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
  const { filters } = useFilters();
  const [addToHistory] = useAddToHistoryMutation();
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    loadData(1, true);
  }, [fetchData, filters]);

  const loadData = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const data = await fetchData(pageNum, filters);
      setItems((prev) => (reset ? data.results : [...prev, ...data.results]));
      setPage(pageNum);
    } catch (err: any) {
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
      const payload = { contentId: id, contentType: "movie" };
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

  const handleLike = async (id: number) => {
    try {
      const payload = { contentId: id, contentType: "movie" };
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

  const handleExpand = (id: number) => {
    console.log("🔽 Expand details:", id);
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-[#120D1D] hover:border-purple-500/50 transition-colors aspect-[2/3]"
          >
            <img
              src={
                item.poster_path
                  ? `${IMAGE_BASE_URL}${item.poster_path}`
                  : "/no-poster.png"
              }
              alt={item.title || item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-[#090612]/95 backdrop-blur-sm p-3 rounded-t-lg border-t border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => handlePlay(item.id, item.title)}
                  className="bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={() => handleAdd(item.id)}
                  className="border border-white/30 rounded-full p-2 text-white hover:border-purple-400 hover:text-purple-300 transition"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => handleLike(item.id)}
                  className="border border-white/30 rounded-full p-2 text-white hover:border-purple-400 hover:text-purple-300 transition"
                >
                  <ThumbsUp size={18} />
                </button>
                <button
                  onClick={() => handleExpand(item.id)}
                  className="ml-auto border border-white/30 rounded-full p-2 text-white hover:border-purple-400 hover:text-purple-300 transition"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 border border-white/20 rounded">HD</span>
                <span className="px-2 py-0.5 border border-white/20 rounded">6+</span>
                {getGenres(item.genre_ids)?.map((g, idx) => (
                  <span key={idx}>{g}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
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