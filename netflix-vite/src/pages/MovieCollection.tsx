
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Plus,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { getCollections } from "../services/movieApi";
import type { Collection } from "../types/movie";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import { useAddFavoriteMutation } from "../services/favoritesApi";
import { useAddForLaterMutation } from "../services/forLaterApi";

const MovieCollection = () => {
  const { id } = useParams<{ id: string }>();
  const collectionId = Number(id);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [collection, setCollection] =
    useState<Collection | null>(null);

  const [addFavorite] =
    useAddFavoriteMutation();

  const [AddForLater] =
    useAddForLaterMutation();

  useEffect(() => {
    if (!collectionId) return;

    const loadCollection = async () => {
      try {
        const data = await getCollections(
          collectionId,
          1,
          currentLanguage
        );

        setCollection(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadCollection();
  }, [collectionId, currentLanguage]);

  if (!collection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090612]">
        <p className="text-sm text-white/40">
          Downloading...
        </p>
      </div>
    );
  }

  const backdropUrl = collection.backdrop_path
    ? `https://image.tmdb.org/t/p/original${collection.backdrop_path}`
    : "/login-bg.png";

  const handleAdd = async (
    movieId: number
  ) => {
    try {
      await AddForLater({
        contentId: movieId,
        contentType: "movie",
      }).unwrap();

      toast.success(
        t(
          "mediaGrid.addToWatchLaterSuccess"
        )
      );
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info(
          t(
            "mediaGrid.alreadyInWatchLater"
          )
        );
      } else {
        toast.error(
          t(
            "mediaGrid.addToWatchLaterError"
          )
        );
      }
    }
  };

  const handleLike = async (
    movieId: number
  ) => {
    try {
      await addFavorite({
        contentId: movieId,
        contentType: "movie",
      }).unwrap();

      toast.success(
        t(
          "mediaGrid.addToFavoritesSuccess"
        )
      );
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info(
          t(
            "mediaGrid.alreadyInWatchLater"
          )
        );
      } else {
        toast.error(
          t(
            "mediaGrid.addToWatchLaterError"
          )
        );
      }
    }
  };

  const handleExpand = (
    movieId: number
  ) => {
    console.log(
      "Expand details:",
      movieId
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090612] text-white">
      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 top-[40%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-40 left-[20%] h-[450px] w-[450px] rounded-full bg-purple-700/10 blur-[140px]" />

      {/* ================= HEADER ================= */}

      <div className="relative z-30">
        <Header />
      </div>

      {/* ================= HERO ================= */}

      <section className="relative mt-16 h-[320px] w-full overflow-hidden sm:h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backdropUrl})`,
          }}
        />

        {/* Dark overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090612] via-[#090612]/60 to-[#090612]/20" />

        <div className="absolute inset-0 bg-black/30" />

        {/* Hero content */}

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-6 lg:px-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400/80">
              Collection
            </p>

            <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {collection.name}
            </h1>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <main className="relative z-10 px-5 pb-16 pt-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Section title */}

          <div className="mb-7">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Movies in collection
            </h2>

            <div className="mt-2 h-px w-24 bg-gradient-to-r from-purple-500 to-transparent" />
          </div>

          {/* ================= MOVIE GRID ================= */}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {collection.parts.map(
              (movie) => {
                const movieTitle =
                  movie.title ||
                  movie.original_title ||
                  "Movie";

                return (
                  <div
                    key={movie.id}
                    className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-white/5 bg-[#1B1528] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-[0_15px_40px_rgba(109,40,217,0.2)]"
                  >
                    {/* POSTER */}

                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/no-poster.png"
                      }
                      alt={movieTitle}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* GRADIENT */}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090612] via-transparent to-transparent opacity-70" />

                    {/* RATING */}

                    {movie.vote_average >
                      0 && (
                      <div className="absolute right-2 top-2 rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        ⭐{" "}
                        {movie.vote_average.toFixed(
                          1
                        )}
                      </div>
                    )}

                    {/* HOVER CONTENT */}

                    <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-[#090612] via-[#090612]/95 to-transparent p-3 pt-14 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      
                      {/* ACTION BUTTONS */}

                      <div className="mb-3 flex items-center gap-2">
                        {/* PLAY */}

                        <Link
                          to={`/movie/${movie.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all duration-200 hover:scale-110 hover:bg-purple-100"
                          aria-label={t(
                            "mediaGrid.playButton"
                          )}
                        >
                          <Play
                            size={16}
                            fill="currentColor"
                          />
                        </Link>

                        {/* WATCH LATER */}

                        <button
                          type="button"
                          onClick={() =>
                            handleAdd(
                              movie.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-purple-400/50 hover:bg-purple-500/20"
                          aria-label={t(
                            "mediaGrid.addButton"
                          )}
                        >
                          <Plus size={17} />
                        </button>

                        {/* LIKE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleLike(
                              movie.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-purple-400/50 hover:bg-purple-500/20"
                          aria-label={t(
                            "mediaGrid.likeButton"
                          )}
                        >
                          <ThumbsUp
                            size={16}
                          />
                        </button>

                        {/* DETAILS */}

                        <button
                          type="button"
                          onClick={() =>
                            handleExpand(
                              movie.id
                            )
                          }
                          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-purple-400/50 hover:bg-purple-500/20"
                          aria-label={t(
                            "mediaGrid.expandButton"
                          )}
                        >
                          <ChevronDown
                            size={17}
                          />
                        </button>
                      </div>

                      {/* TITLE */}

                      <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-white">
                        {movieTitle}
                      </h3>

                      {/* RELEASE DATE */}

                      {movie.release_date && (
                        <p className="mt-1 text-[11px] text-white/40">
                          {movie.release_date}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default MovieCollection;
