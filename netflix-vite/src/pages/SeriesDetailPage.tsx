import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  Play,
  Plus,
  ThumbsUp,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { type Credits, type Series } from "../types/movie";

import {
  type Video,
  getSeriesDetails,
  getSeriesVideos,
  getSimilarTv,
  getRecomendationsTv,
  getCreditsTv,
} from "../services/movieApi";

import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from "../services/favoritesApi";

import { useAddToHistoryMutation } from "../services/historyApi";
import { useAddForLaterMutation } from "../services/forLaterApi";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import RatingAndComments from "../components/RatingAndComments";

const SeriesDetailsPage = () => {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const { id } = useParams<{ id: string }>();
  const seriesId = Number(id);

  const navigate = useNavigate();

  // =========================================================
  // Refs
  // =========================================================

  const recommendationsRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // State
  // =========================================================

  const [series, setSeries] = useState<Series | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<Series[]>([]);
  const [recommendations, setRecommendations] = useState<Series[]>([]);
  const [creditsTv, setCreditsTv] = useState<Credits | null>(null);

  const [openedSeries, setOpenedSeries] =
    useState<Series | null>(null);

  const [inFavorites, setInFavorites] = useState(false);

  // =========================================================
  // API mutations
  // =========================================================

  const { data: favorites } = useGetFavoritesQuery();

  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const [addToHistory] = useAddToHistoryMutation();
  const [addForLater] = useAddForLaterMutation();

  // =========================================================
  // Load series
  // =========================================================

  useEffect(() => {
    if (!seriesId) return;

    const loadSeries = async () => {
      try {
        const details = await getSeriesDetails(
          seriesId,
          currentLanguage
        );

        setSeries(details);

        // Trailer
        const vids = await getSeriesVideos(
          seriesId,
          currentLanguage
        );

        setVideos(
          vids.results.filter(
            (video) =>
              video.site === "YouTube" &&
              video.type === "Trailer"
          )
        );

        // Similar
        const similarResult = await getSimilarTv(
          seriesId,
          1,
          currentLanguage
        );

        setSimilar(similarResult.results || []);

        // Recommendations
        const recommendationResult =
          await getRecomendationsTv(
            seriesId,
            1,
            currentLanguage
          );

        setRecommendations(
          recommendationResult.results || []
        );

        // Credits
        const credits = await getCreditsTv(
          seriesId,
          1,
          currentLanguage
        );

        setCreditsTv(credits);
      } catch (error) {
        console.error(
          "Error loading series:",
          error
        );

        toast.error(
          t("seriesDetails.loadingError")
        );
      }
    };

    loadSeries();
  }, [seriesId, currentLanguage, t]);

  // =========================================================
  // Check favorites
  // =========================================================

  useEffect(() => {
    if (!favorites) return;

    setInFavorites(
      favorites.some(
        (favorite) =>
          favorite.contentId === seriesId
      )
    );
  }, [favorites, seriesId]);

  // =========================================================
  // Scroll to trailer
  // =========================================================

  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =========================================================
  // Horizontal scroll
  // =========================================================

  const scrollContainer = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    const container = ref.current;

    if (!container) return;

    const amount =
      container.clientWidth * 0.85;

    container.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,
      behavior: "smooth",
    });
  };

  // =========================================================
  // Favorite
  // =========================================================

  const handleFavorite = async () => {
    try {
      if (inFavorites) {
        const favorite = favorites?.find(
          (item) =>
            item.contentId === seriesId
        );

        if (!favorite) return;

        await removeFavorite(
          favorite.id
        ).unwrap();

        setInFavorites(false);

        toast.info(
          t("seriesDetails.favorites.removed")
        );

        return;
      }

      await addFavorite({
        contentId: seriesId,
        contentType: "tv",
      }).unwrap();

      setInFavorites(true);

      toast.success(
        t("seriesDetails.favorites.added")
      );
    } catch (error: any) {
      console.error(error);

      if (error?.status === 409) {
        toast.info(
          t(
            "seriesDetails.favorites.alreadyAdded",
            "Already in favorites"
          )
        );
      } else {
        toast.error(
          t(
            "seriesDetails.favorites.error",
            "Something went wrong"
          )
        );
      }
    }
  };

  // =========================================================
  // Add to later
  // =========================================================

  const handleAdd = async (
    contentId: number
  ) => {
    try {
      await addForLater({
        contentId,
        contentType: "tv",
      }).unwrap();

      toast.success(
        t("seriesDetails.forLater.added")
      );
    } catch (error: any) {
      console.error(error);

      if (error?.status === 409) {
        toast.info(
          t(
            "seriesDetails.forLater.alreadyAdded",
            "Already in watch later"
          )
        );
      } else {
        toast.error(
          t(
            "seriesDetails.forLater.error",
            "Something went wrong"
          )
        );
      }
    }
  };

  // =========================================================
  // Play
  // =========================================================

  const handlePlay = async (
    contentId: number,
    name: string
  ) => {
    try {
      await addToHistory({
        id: contentId,
        mediaType: "tv",
        name,
      }).unwrap();

      navigate(`/tv/${contentId}`);

      window.location.reload();
    } catch (error) {
      console.error(
        "Error adding to history:",
        error
      );

      toast.error(
        t(
          "seriesDetails.playError",
          "Unable to play this series"
        )
      );
    }
  };

  // =========================================================
  // Like
  // =========================================================

  const handleLike = async (
    contentId: number
  ) => {
    try {
      await addFavorite({
        contentId,
        contentType: "tv",
      }).unwrap();

      toast.success(
        t("seriesDetails.favorites.added")
      );
    } catch (error: any) {
      console.error(error);

      if (error?.status === 409) {
        toast.info(
          t(
            "seriesDetails.favorites.alreadyAdded",
            "Already in favorites"
          )
        );
      } else {
        toast.error(
          t(
            "seriesDetails.favorites.error",
            "Something went wrong"
          )
        );
      }
    }
  };

  // =========================================================
  // Loading
  // =========================================================

  if (!series) {
    return (
      <div className="min-h-screen bg-[#090612] flex items-center justify-center relative overflow-hidden">
        {/* Background glow */}

        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-gray-300 text-lg animate-pulse">
          {t("seriesDetails.loading")}
        </div>
      </div>
    );
  }

  // =========================================================
  // Data
  // =========================================================

  const backdropUrl = series.backdrop_path
    ? `https://image.tmdb.org/t/p/original${series.backdrop_path}`
    : "";

  const trailer = videos[0];

  const writers = creditsTv?.crew
    ?.filter(
      (person) =>
        person.department === "Writing"
    )
    .slice(0, 10)
    .map(
      (person) =>
        person.original_name
    )
    .join(", ");

  const directors = creditsTv?.crew
    ?.filter(
      (person) =>
        person.department === "Directing"
    )
    .slice(0, 5)
    .map(
      (person) =>
        person.original_name
    )
    .join(", ");

  const producers = creditsTv?.crew
    ?.filter(
      (person) =>
        person.department === "Production"
    )
    .slice(0, 10)
    .map(
      (person) =>
        person.original_name
    )
    .join(", ");

  const actors = creditsTv?.cast
    ?.slice(0, 15)
    .map(
      (person) =>
        person.original_name
    )
    .join(", ");

  // =========================================================
  // Series card
  // =========================================================

  const SeriesCard = ({
    item,
  }: {
    item: Series;
  }) => {
    return (
      <div
        className="
          group
          min-w-[240px]
          sm:min-w-[260px]
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#120D1D]/95
          backdrop-blur-xl
          shadow-2xl
          shadow-purple-950/20
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-purple-500/40
          hover:shadow-purple-900/30
        "
      >
        {/* Poster */}

        <div
          className="relative cursor-pointer overflow-hidden"
          onClick={() =>
            handlePlay(
              item.id,
              item.name
            )
          }
        >
          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.name}
              className="
                w-full
                h-[330px]
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div className="
              w-full
              h-[330px]
              bg-[#1B1528]
              flex
              items-center
              justify-center
              text-gray-500
            ">
              No image
            </div>
          )}

          {/* Poster gradient */}

          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#120D1D]
            via-transparent
            to-transparent
            opacity-80
          " />
        </div>

        {/* Card body */}

        <div className="p-3">

          {/* Buttons */}

          <div className="flex items-center gap-2">

            {/* Play */}

            <button
              type="button"
              onClick={() =>
                handlePlay(
                  item.id,
                  item.name
                )
              }
              className="
                w-10
                h-10
                rounded-full
                bg-gradient-to-r
                from-purple-600
                to-violet-500
                text-white
                flex
                items-center
                justify-center
                transition
                hover:from-purple-500
                hover:to-violet-400
                hover:scale-110
                shadow-lg
                shadow-purple-900/30
              "
            >
              <Play
                size={17}
                fill="currentColor"
              />
            </button>

            {/* Add */}

            <button
              type="button"
              onClick={() =>
                handleAdd(item.id)
              }
              className="
                w-10
                h-10
                rounded-full
                border
                border-white/10
                bg-white/5
                text-gray-300
                flex
                items-center
                justify-center
                transition
                hover:bg-white/10
                hover:text-white
                hover:border-purple-500/40
              "
            >
              <Plus size={18} />
            </button>

            {/* Like */}

            <button
              type="button"
              onClick={() =>
                handleLike(item.id)
              }
              className="
                w-10
                h-10
                rounded-full
                border
                border-white/10
                bg-white/5
                text-gray-300
                flex
                items-center
                justify-center
                transition
                hover:bg-white/10
                hover:text-white
                hover:border-purple-500/40
              "
            >
              <ThumbsUp size={17} />
            </button>

            {/* Details */}

            <button
              type="button"
              onClick={() =>
                setOpenedSeries(item)
              }
              className="
                ml-auto
                w-10
                h-10
                rounded-full
                border
                border-white/10
                bg-white/5
                text-gray-300
                flex
                items-center
                justify-center
                transition
                hover:bg-white/10
                hover:text-white
                hover:border-purple-500/40
              "
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Tags */}

          <div className="flex gap-2 mt-3">

            <span className="
              px-2
              py-0.5
              rounded-md
              border
              border-white/10
              bg-white/5
              text-xs
              text-gray-400
            ">
              HD
            </span>

            <span className="
              px-2
              py-0.5
              rounded-md
              border
              border-white/10
              bg-white/5
              text-xs
              text-gray-400
            ">
              12+
            </span>

          </div>

          {/* Name */}

          <p className="
            mt-3
            text-sm
            font-medium
            text-gray-200
            truncate
          ">
            {item.name}
          </p>
        </div>
      </div>
    );
  };

  // =========================================================
  // Main
  // =========================================================

  return (
    <div className="
      min-h-screen
      bg-[#090612]
      text-white
      relative
      overflow-hidden
    ">

      {/* ===================================================== */}
      {/* Background glow */}
      {/* ===================================================== */}

      <div className="
        fixed
        -top-40
        -left-40
        w-[500px]
        h-[500px]
        rounded-full
        bg-purple-700/15
        blur-3xl
        pointer-events-none
        z-0
      " />

      <div className="
        fixed
        -bottom-40
        -right-40
        w-[500px]
        h-[500px]
        rounded-full
        bg-violet-600/15
        blur-3xl
        pointer-events-none
        z-0
      " />

      <div className="relative z-10">

        {/* =================================================== */}
        {/* Header */}
        {/* =================================================== */}

        <Header />

        {/* =================================================== */}
        {/* Hero */}
        {/* =================================================== */}

        <section className="relative">

          <div
            className="
              relative
              h-[75vh]
              min-h-[550px]
              w-full
              bg-cover
              bg-center
            "
            style={{
              backgroundImage: backdropUrl
                ? `url(${backdropUrl})`
                : undefined,
            }}
          >

            {/* Main gradient */}

            <div className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#090612]
              via-[#090612]/65
              to-[#090612]/10
            " />

            {/* Left gradient */}

            <div className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#090612]/90
              via-[#090612]/20
              to-transparent
            " />

            {/* Purple overlay */}

            <div className="
              absolute
              inset-0
              bg-purple-950/10
            " />

          </div>

          {/* ================================================= */}
          {/* Hero content */}
          {/* ================================================= */}

          <div className="
            max-w-7xl
            mx-auto
            px-4
            md:px-8
            -mt-72
            relative
            z-10
            pb-16
          ">

            <div className="
              max-w-5xl
              animate-fadeIn
            ">

              {/* Title */}

              <h1 className="
                text-5xl
                md:text-7xl
                lg:text-8xl
                font-extrabold
                tracking-tight
                text-white
                drop-shadow-2xl
              ">
                {series.name}
              </h1>

              {/* Tagline */}

              {series.tagline && (
                <p className="
                  mt-4
                  italic
                  text-gray-400
                  text-lg
                  md:text-xl
                ">
                  "{series.tagline}"
                </p>
              )}

              {/* ================================================= */}
              {/* Action buttons */}
              {/* ================================================= */}

              <div className="
                flex
                flex-wrap
                items-center
                gap-3
                mt-7
              ">

                {/* Watch */}

                <button
                  type="button"
                  onClick={scrollToTrailer}
                  className="
                    px-7
                    h-12
                    rounded-xl
                    bg-gradient-to-r
                    from-purple-600
                    to-violet-500
                    text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    hover:from-purple-500
                    hover:to-violet-400
                    hover:scale-[1.03]
                    shadow-lg
                    shadow-purple-900/30
                  "
                >
                  <Play
                    size={18}
                    fill="currentColor"
                  />

                  {t(
                    "seriesDetails.watch",
                    "Watch"
                  )}
                </button>

                {/* Add */}

                <button
                  type="button"
                  onClick={() =>
                    handleAdd(series.id)
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                    flex
                    items-center
                    justify-center
                    text-gray-300
                    transition
                    hover:bg-white/10
                    hover:text-white
                    hover:border-purple-500/50
                    hover:scale-105
                  "
                >
                  <Plus size={20} />
                </button>

                {/* Favorite */}

                <button
                  type="button"
                  onClick={handleFavorite}
                  className={`
                    w-12
                    h-12
                    rounded-full
                    border
                    backdrop-blur-xl
                    flex
                    items-center
                    justify-center
                    transition
                    hover:scale-105
                    ${
                      inFavorites
                        ? `
                          bg-purple-600/20
                          border-purple-500/60
                          text-purple-400
                        `
                        : `
                          bg-white/5
                          border-white/10
                          text-gray-300
                          hover:bg-white/10
                          hover:text-white
                        `
                    }
                  `}
                >
                  <ThumbsUp
                    size={20}
                    className={
                      inFavorites
                        ? "text-purple-400"
                        : ""
                    }
                  />
                </button>

              </div>

              {/* ================================================= */}
              {/* Series information */}
              {/* ================================================= */}

              <div className="
                mt-20
                rounded-2xl
                border
                border-white/10
                bg-[#120D1D]/90
                backdrop-blur-xl
                p-6
                md:p-8
                shadow-2xl
                shadow-purple-950/30
              ">

                <div className="
                  grid
                  md:grid-cols-2
                  gap-10
                  md:gap-16
                ">

                  {/* Left column */}

                  <div className="space-y-5">

                    {/* Year / episodes */}

                    <div className="
                      flex
                      flex-col
                      gap-2
                      text-lg
                      font-semibold
                    ">

                      <span className="text-gray-200">
                        {series.first_air_date?.slice(
                          0,
                          4
                        )}
                      </span>

                      <span className="text-gray-400">
                        {series.number_of_seasons}{" "}
                        {t(
                          "seriesDetails.seasons"
                        )}

                        {" • "}

                        {series.number_of_episodes}{" "}
                        {t(
                          "seriesDetails.episodes"
                        )}
                      </span>

                    </div>

                    <hr className="border-white/10" />

                    {/* Genres */}

                    <div className="
                      flex
                      flex-wrap
                      gap-2
                    ">

                      {series.genres?.map(
                        (genre) => (
                          <span
                            key={genre.id}
                            className="
                              px-3
                              py-1.5
                              rounded-lg
                              border
                              border-purple-500/20
                              bg-purple-500/5
                              text-sm
                              text-gray-300
                              transition
                              hover:bg-purple-500/10
                              hover:border-purple-500/40
                            "
                          >
                            {genre.name}
                          </span>
                        )
                      )}

                    </div>

                    <hr className="border-white/10" />

                    {/* Overview */}

                    <p className="
                      text-gray-300
                      text-sm
                      md:text-base
                      leading-relaxed
                    ">
                      {series.overview}
                    </p>

                  </div>

                  {/* Right column */}

                  <div className="
                    space-y-4
                    text-sm
                  ">

                    {/* Popularity */}

                    <p>
                      <span className="text-gray-500">
                        {t(
                          "seriesDetails.popularity"
                        )}
                        :
                      </span>{" "}
                      <span className="text-gray-200">
                        {series.popularity}
                      </span>
                    </p>

                    {/* Directors */}

                    {directors && (
                      <p>
                        <span className="text-gray-500">
                          Directors:
                        </span>{" "}
                        <span className="text-gray-300">
                          {directors}
                        </span>
                      </p>
                    )}

                    {/* Producers */}

                    {producers && (
                      <p>
                        <span className="text-gray-500">
                          Producers:
                        </span>{" "}
                        <span className="text-gray-300">
                          {producers}
                        </span>
                      </p>
                    )}

                    {/* Writers */}

                    {writers && (
                      <p>
                        <span className="text-gray-500">
                          Writers:
                        </span>{" "}
                        <span className="text-gray-300">
                          {writers}
                        </span>
                      </p>
                    )}

                    {/* Actors */}

                    {actors && (
                      <p>
                        <span className="text-gray-500">
                          Actors:
                        </span>{" "}
                        <span className="text-gray-300">
                          {actors}
                        </span>
                      </p>
                    )}

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================== */}
        {/* Trailer */}
        {/* =================================================== */}

        {trailer && (
          <section
            ref={trailerRef}
            className="
              max-w-7xl
              mx-auto
              px-4
              md:px-8
              mt-8
              animate-fadeIn
            "
          >

            <div className="
              rounded-2xl
              border
              border-white/10
              bg-[#120D1D]/90
              backdrop-blur-xl
              p-4
              md:p-6
              shadow-2xl
              shadow-purple-950/20
            ">

              <h2 className="
                text-2xl
                md:text-3xl
                font-bold
                mb-5
              ">
                {t(
                  "movieDetails.trailer"
                )}
              </h2>

              <div className="
                aspect-video
                overflow-hidden
                rounded-xl
                bg-black
                border
                border-white/10
              ">

                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />

              </div>

            </div>
          </section>
        )}

        {/* =================================================== */}
        {/* Last episode */}
        {/* =================================================== */}

        {series.last_episode_to_air && (
          <section className="
            max-w-7xl
            mx-auto
            px-4
            md:px-8
            mt-16
            animate-fadeIn
          ">

            <h2 className="
              text-2xl
              md:text-3xl
              font-bold
              mb-6
            ">
              {t(
                "seriesDetails.lastEpisode"
              )}
            </h2>

            <div className="
              flex
              flex-col
              md:flex-row
              gap-6
              rounded-2xl
              border
              border-white/10
              bg-[#120D1D]/90
              backdrop-blur-xl
              p-5
              md:p-6
              shadow-xl
              shadow-purple-950/20
            ">

              {/* Image */}

              {series.last_episode_to_air
                .still_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${series.last_episode_to_air.still_path}`}
                  alt={
                    series.last_episode_to_air
                      .name
                  }
                  className="
                    w-full
                    md:w-64
                    h-64
                    rounded-xl
                    object-cover
                  "
                />
              )}

              {/* Content */}

              <div className="
                flex-1
                flex
                flex-col
                justify-center
              ">

                <h3 className="
                  text-2xl
                  font-semibold
                  mb-2
                ">
                  {
                    series
                      .last_episode_to_air
                      .name
                  }
                </h3>

                <p className="
                  text-gray-500
                  text-sm
                  mb-5
                ">
                  {
                    series
                      .last_episode_to_air
                      .air_date
                  }

                  {" • "}

                  {t(
                    "seriesDetails.episode"
                  )}{" "}
                  {
                    series
                      .last_episode_to_air
                      .episode_number
                  }

                  {" ("}

                  {t(
                    "seriesDetails.season"
                  )}{" "}
                  {
                    series
                      .last_episode_to_air
                      .season_number
                  }

                  {")"}
                </p>

                <p className="
                  text-gray-300
                  leading-relaxed
                ">
                  {
                    series
                      .last_episode_to_air
                      .overview ||
                    t(
                      "seriesDetails.noOverview"
                    )
                  }
                </p>

              </div>
            </div>
          </section>
        )}

        {/* =================================================== */}
        {/* Recommendations */}
        {/* =================================================== */}

        {recommendations.length > 0 && (
          <section className="
            max-w-7xl
            mx-auto
            px-4
            md:px-8
            mt-16
            animate-fadeIn
          ">

            {/* Header */}

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <h2 className="
                text-2xl
                md:text-3xl
                font-bold
              ">
                {t(
                  "seriesDetails.recommendations"
                )}
              </h2>

              {/* Arrows */}

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    scrollContainer(
                      recommendationsRef,
                      "left"
                    )
                  }
                  className="
                    w-10
                    h-10
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    text-gray-300
                    flex
                    items-center
                    justify-center
                    transition
                    hover:bg-white/10
                    hover:text-white
                    hover:border-purple-500/40
                  "
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollContainer(
                      recommendationsRef,
                      "right"
                    )
                  }
                  className="
                    w-10
                    h-10
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    text-gray-300
                    flex
                    items-center
                    justify-center
                    transition
                    hover:bg-white/10
                    hover:text-white
                    hover:border-purple-500/40
                  "
                >
                  <ChevronRight size={20} />
                </button>

              </div>
            </div>

            {/* Cards */}

            <div
              ref={recommendationsRef}
              className="
                flex
                gap-5
                overflow-x-auto
                pb-5
                scrollbar-hide
                scroll-smooth
              "
            >
              {recommendations.map(
                (item) => (
                  <SeriesCard
                    key={item.id}
                    item={item}
                  />
                )
              )}
            </div>

          </section>
        )}

        {/* =================================================== */}
        {/* Similar */}
        {/* =================================================== */}

        {similar.length > 0 && (
          <section className="
            max-w-7xl
            mx-auto
            px-4
            md:px-8
            mt-16
            animate-fadeIn
          ">

            {/* Header */}

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <h2 className="
                text-2xl
                md:text-3xl
                font-bold
              ">
                {t(
                  "movieDetails.similar"
                )}
              </h2>

              {/* Arrows */}

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    scrollContainer(
                      similarRef,
                      "left"
                    )
                  }
                  className="
                    w-10
                    h-10
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    text-gray-300
                    flex
                    items-center
                    justify-center
                    transition
                    hover:bg-white/10
                    hover:text-white
                    hover:border-purple-500/40
                  "
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollContainer(
                      similarRef,
                      "right"
                    )
                  }
                  className="
                    w-10
                    h-10
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    text-gray-300
                    flex
                    items-center
                    justify-center
                    transition
                    hover:bg-white/10
                    hover:text-white
                    hover:border-purple-500/40
                  "
                >
                  <ChevronRight size={20} />
                </button>

              </div>
            </div>

            {/* Cards */}

            <div
              ref={similarRef}
              className="
                flex
                gap-5
                overflow-x-auto
                pb-5
                scrollbar-hide
                scroll-smooth
              "
            >
              {similar.map(
                (item) => (
                  <SeriesCard
                    key={item.id}
                    item={item}
                  />
                )
              )}
            </div>

          </section>
        )}

        {/* =================================================== */}
        {/* Rating and comments */}
        {/* =================================================== */}

        <section className="
          max-w-7xl
          mx-auto
          px-4
          md:px-8
          mt-16
          mb-20
        ">

          <div className="
            rounded-2xl
            border
            border-white/10
            bg-[#120D1D]/80
            backdrop-blur-xl
            p-5
            md:p-8
            shadow-2xl
            shadow-purple-950/20
          ">

            <RatingAndComments
              contentId={series.id}
              contentType="tv"
              vote_average={
                series.vote_average
              }
            />

          </div>
        </section>

        {/* =================================================== */}
        {/* Footer */}
        {/* =================================================== */}

        <Footer />

      </div>

      {/* ===================================================== */}
      {/* Details modal */}
      {/* ===================================================== */}

      {openedSeries && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            px-4
            bg-black/70
            backdrop-blur-sm
          "
          onClick={() =>
            setOpenedSeries(null)
          }
        >

          <div
            className="
              relative
              w-full
              max-w-lg
              rounded-2xl
              border
              border-white/10
              bg-[#120D1D]
              backdrop-blur-xl
              p-6
              shadow-2xl
              shadow-purple-950/50
              animate-fadeIn
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Close */}

            <button
              type="button"
              onClick={() =>
                setOpenedSeries(null)
              }
              className="
                absolute
                top-4
                right-4
                w-9
                h-9
                rounded-full
                border
                border-white/10
                bg-white/5
                text-gray-400
                flex
                items-center
                justify-center
                transition
                hover:bg-white/10
                hover:text-white
                hover:border-purple-500/40
              "
            >
              <X size={18} />
            </button>

            {/* Title */}

            <h3 className="
              text-xl
              md:text-2xl
              font-bold
              text-white
              pr-10
              mb-4
            ">
              {openedSeries.name}
            </h3>

            <div className="
              h-px
              bg-white/10
              mb-5
            " />

            {/* Overview */}

            <p className="
              text-sm
              leading-relaxed
              text-gray-300
              overflow-y-auto
              max-h-64
            ">
              {openedSeries.overview ||
                t(
                  "seriesDetails.noOverview"
                )}
            </p>

            {/* Modal button */}

            <button
              type="button"
              onClick={() =>
                handlePlay(
                  openedSeries.id,
                  openedSeries.name
                )
              }
              className="
                w-full
                mt-6
                py-3.5
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-violet-500
                text-white
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
                hover:from-purple-500
                hover:to-violet-400
                shadow-lg
                shadow-purple-900/20
              "
            >
              <Play
                size={18}
                fill="currentColor"
              />

              {t(
                "seriesDetails.watch",
                "Watch"
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default SeriesDetailsPage;

