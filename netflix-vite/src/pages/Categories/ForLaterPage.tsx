
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import {
  useGetForLatersQuery,
  useRemoveForLaterMutation,
} from "../../services/forLaterApi";
import {
  getMovieDetails,
  getSeriesDetails,
} from "../../services/movieApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Play,
  ThumbsUp,
  ChevronDown,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAddFavoriteMutation } from "../../services/favoritesApi";
import { useAddToHistoryMutation } from "../../services/historyApi";
import { useTranslation } from "react-i18next";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface ForLaterItem {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  name?: string;
  genres?: { id: number; name: string }[];
  contentType: "movie" | "tv";
  contentId: number;
  forLaterId: number;
}

export default function ForLaterPage() {
  const {
    data: forLaters,
    isLoading,
    isError,
  } = useGetForLatersQuery();

  const [addFavorite] = useAddFavoriteMutation();
  const [removeForLater] = useRemoveForLaterMutation();
  const [addToHistory] = useAddToHistoryMutation();

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [forLaterItems, setForLaterItems] = useState<
    ForLaterItem[]
  >([]);

  const [loadingDetails, setLoadingDetails] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!forLaters || forLaters.length === 0) {
      setForLaterItems([]);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetails(true);

      try {
        const detailsPromises = forLaters.map(
          async (fl) => {
            if (fl.contentType === "movie") {
              const data = await getMovieDetails(
                fl.contentId,
                currentLanguage
              );

              return {
                ...data,
                contentType: "movie" as const,
                contentId: Number(fl.contentId),
                forLaterId: fl.id,
              };
            }

            const data = await getSeriesDetails(
              fl.contentId,
              currentLanguage
            );

            return {
              ...data,
              contentType: "tv" as const,
              contentId: Number(fl.contentId),
              forLaterId: fl.id,
            };
          }
        );

        const results = await Promise.all(
          detailsPromises
        );

        setForLaterItems(results);
      } catch (err: any) {
        console.error(
          "Error loading watch later details:",
          err
        );

        toast.error(
          "Error loading 'watch later' details 😢"
        );
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [forLaters, currentLanguage]);

  const handleAdd = async (
    id: number,
    type: string
  ) => {
    try {
      const payload = {
        contentId: id,
        contentType: type,
      };

      await addFavorite(payload).unwrap();

      toast.success(
        "Added to favorites ❤️"
      );
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info(
          "Вже у списку улюбленних"
        );
      } else {
        toast.error(
          "Помилка додавання в улюбленні"
        );
      }
    }
  };

  const handleRemove = async (
    forLaterId: number
  ) => {
    try {
      await removeForLater(
        forLaterId
      ).unwrap();

      toast.info(
        "Removed from 'watch later' list ❌"
      );

      setForLaterItems((prev) =>
        prev.filter(
          (item) =>
            item.forLaterId !== forLaterId
        )
      );
    } catch {
      toast.error(
        "Failed to remove 😢"
      );
    }
  };

  const handlePlay = async (
    content: ForLaterItem
  ) => {
    try {
      await addToHistory({
        id: content.id,
        mediaType: content.contentType,
        name:
          content.title ??
          content.name,
      }).unwrap();

      navigate(
        `/${content.contentType}/${content.id}`
      );
    } catch (err) {
      console.error(
        "Failed to add to history:",
        err
      );

      // Навіть якщо історія не записалась,
      // все одно відкриваємо контент
      navigate(
        `/${content.contentType}/${content.id}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#090612] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />

      <div className="absolute top-[35%] -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10">
          {/* Title */}
          <div className="mb-7">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Watch Later
            </h1>

            <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="rounded-xl border border-white/10 bg-[#120D1D] p-4 md:p-6">
            {/* Loading */}
            {(isLoading || loadingDetails) && (
              <div className="flex items-center justify-center py-16">
                <p className="text-gray-400">
                  Loading...
                </p>
              </div>
            )}

            {/* Error */}
            {isError &&
              !isLoading && (
                <div className="flex items-center justify-center py-16">
                  <p className="text-red-400">
                    Error loading 'watch later' list
                  </p>
                </div>
              )}

            {/* Empty */}
            {!isLoading &&
              !loadingDetails &&
              !isError &&
              forLaterItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-14 h-14 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <span className="text-2xl">
                      +
                    </span>
                  </div>

                  <p className="text-gray-400 text-center">
                    Your 'watch later' list is empty 😢
                  </p>
                </div>
              )}

            {/* Grid */}
            {!isLoading &&
              !loadingDetails &&
              forLaterItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                  {forLaterItems.map(
                    (content) => (
                      <div
                        key={content.id}
                        className="relative group cursor-pointer rounded-xl overflow-hidden border border-white/10 bg-[#0D0915] aspect-[2/3] shadow-lg shadow-black/20"
                      >
                        {/* Poster */}
                        <img
                          src={
                            content.poster_path
                              ? `${IMAGE_BASE_URL}${content.poster_path}`
                              : "/no-poster.png"
                          }
                          alt={
                            content.title ||
                            content.name
                          }
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

                        {/* Hover panel */}
                        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-[#0D0915]/95 backdrop-blur-sm p-3 border-t border-purple-500/10">
                          {/* Buttons */}
                          <div className="flex items-center gap-2 mb-3">
                            {/* Play */}
                            <button
                              type="button"
                              onClick={() =>
                                handlePlay(
                                  content
                                )
                              }
                              className="bg-white text-black rounded-full p-2 hover:scale-110 hover:bg-gray-200 transition"
                              title="Play"
                            >
                              <Play
                                size={17}
                                fill="currentColor"
                              />
                            </button>

                            {/* Add to favorites */}
                            <button
                              type="button"
                              onClick={() =>
                                handleAdd(
                                  content.id,
                                  content.contentType
                                )
                              }
                              className="border border-white/30 rounded-full p-2 text-white hover:bg-purple-600/30 hover:border-purple-400 transition"
                              title="Add to favorites"
                            >
                              <ThumbsUp size={17} />
                            </button>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemove(
                                  content.forLaterId
                                )
                              }
                              className="ml-auto border border-red-400/50 text-red-400 rounded-full p-2 hover:bg-red-500/20 hover:border-red-400 transition"
                              title="Remove from watch later"
                            >
                              <X size={17} />
                            </button>

                            {/* More */}
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

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                            <span className="px-2 py-0.5 rounded border border-white/20 bg-white/5">
                              HD
                            </span>

                            <span className="px-2 py-0.5 rounded border border-white/20 bg-white/5">
                              6+
                            </span>

                            {content.genres
                              ?.slice(0, 3)
                              .map(
                                (genre) => (
                                  <span
                                    key={
                                      genre.id
                                    }
                                    className="text-gray-400"
                                  >
                                    {
                                      genre.name
                                    }
                                  </span>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

