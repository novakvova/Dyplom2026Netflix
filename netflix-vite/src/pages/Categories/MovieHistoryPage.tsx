import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Play, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetHistoryQuery,
  useDeleteFromHistoryMutation,
  useClearHistoryMutation,
  useAddToHistoryMutation,
} from "../../services/historyApi";
import {
  getMovieDetails,
  getSeriesDetails,
} from "../../services/movieApi";
import { useTranslation } from "react-i18next";

export interface HistoryItemDetails {
  id: number;
  movieId: number;
  mediaType: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  viewedAt: string;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieHistoryPage() {
  const {
    data: history,
    isLoading,
    isError,
  } = useGetHistoryQuery();

  const [deleteFromHistory] =
    useDeleteFromHistoryMutation();

  const [clearHistory] =
    useClearHistoryMutation();

  const [addToHistory] =
    useAddToHistoryMutation();

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [items, setItems] =
    useState<HistoryItemDetails[]>([]);

  const [loadingDetails, setLoadingDetails] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!history || history.length === 0) {
      setItems([]);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);

      try {
        const results = await Promise.all(
          history.map(async (h) => {
            if (h.mediaType === "movie") {
              const data = await getMovieDetails(
                h.movieId,
                currentLanguage
              );

              return {
                ...data,
                id: h.id,
                mediaType: "movie" as const,
                movieId: h.movieId,
                viewedAt: h.viewedAt || "",
              };
            }

            const data = await getSeriesDetails(
              h.movieId,
              currentLanguage
            );

            return {
              ...data,
              id: h.id,
              mediaType: "tv" as const,
              movieId: h.movieId,
              viewedAt: h.viewedAt || "",
            };
          })
        );

        setItems(results);
      } catch (err) {
        console.error(
          "Failed to load history:",
          err
        );

        toast.error(
          "Failed to load history"
        );
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [history, currentLanguage]);

  const handleRemove = async (id: number) => {
    try {
      await deleteFromHistory(id).unwrap();

      setItems((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.info("Removed from history");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleClear = async () => {
    try {
      await clearHistory().unwrap();

      setItems([]);

      toast.info("History cleared 🗑️");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  const handlePlay = async (
    content: HistoryItemDetails
  ) => {
    try {
      await addToHistory({
        id: content.movieId,
        mediaType: content.mediaType,
        name:
          content.title ??
          content.name ??
          "No name",
      }).unwrap();
    } catch (err) {
      console.error(
        "Failed to update history:",
        err
      );
    }

    navigate(
      `/${content.mediaType}/${content.movieId}`
    );
  };

  return (
    <div className="min-h-screen bg-[#090612] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />

      <div className="absolute top-[35%] -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-3xl pointer-events-none" />

      <div className="relative z-20">
        <Header />
      </div>

      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Viewing History
              </h1>

              <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="shrink-0 px-5 py-2.5 rounded-xl border border-red-400/40 text-red-400 font-semibold hover:bg-red-500/10 hover:border-red-400 transition"
              >
                Clear History
              </button>
            )}
          </div>

          {/* Content */}
          <div className="rounded-xl border border-white/10 bg-[#120D1D] p-4 md:p-6">
            {(isLoading || loadingDetails) && (
              <div className="flex justify-center py-16">
                <p className="text-gray-400">
                  Loading...
                </p>
              </div>
            )}

            {isError && !isLoading && (
              <div className="flex justify-center py-16">
                <p className="text-red-400">
                  Error loading history
                </p>
              </div>
            )}

            {!isLoading &&
              !loadingDetails &&
              !isError &&
              items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-14 h-14 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">
                      ◷
                    </span>
                  </div>

                  <p className="text-gray-400">
                    History is empty
                  </p>
                </div>
              )}

            {!isLoading &&
              !loadingDetails &&
              items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                  {items.map((content) => (
                    <div
                      key={content.id}
                      className="relative group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-[#0D0915] aspect-[2/3] shadow-lg shadow-black/20"
                    >
                      <img
                        src={
                          content.poster_path
                            ? `${IMAGE_BASE_URL}${content.poster_path}`
                            : "/no-poster.png"
                        }
                        alt={
                          content.title ||
                          content.name ||
                          "Poster"
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-[#0D0915]/95 backdrop-blur-sm p-3 border-t border-purple-500/10">
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            type="button"
                            onClick={() =>
                              handlePlay(content)
                            }
                            className="bg-white text-black rounded-full p-2 hover:scale-110 hover:bg-gray-200 transition"
                            title="Play"
                          >
                            <Play
                              size={17}
                              fill="currentColor"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(content.id)
                            }
                            className="ml-auto border border-red-400/50 text-red-400 rounded-full p-2 hover:bg-red-500/20 hover:border-red-400 transition"
                            title="Remove"
                          >
                            <X size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toast.info(
                                "More details coming soon 😉"
                              )
                            }
                            className="border border-white/30 rounded-full p-2 text-white hover:bg-purple-600/30 hover:border-purple-400 transition"
                            title="More details"
                          >
                            <ChevronDown size={17} />
                          </button>
                        </div>

                        <div className="text-gray-400 text-xs mb-2">
                          {content.viewedAt
                            ? new Date(
                                content.viewedAt
                              ).toLocaleString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "Unknown date"}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded border border-purple-500/20 bg-purple-600/10 text-purple-300">
                            {content.mediaType.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

