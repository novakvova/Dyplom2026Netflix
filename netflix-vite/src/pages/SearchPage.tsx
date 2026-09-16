
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Movie, TMDBResponse } from '../types/movie';
import Header from '../components/Header/Header';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer/Footer';
import { toast } from 'react-toastify';
import {
  Play,
  Plus,
  ChevronDown,
  ThumbsUp,
  Search,
  Loader2,
} from 'lucide-react';

import { useAddForLaterMutation } from '../services/forLaterApi';
import { useAddFavoriteMutation } from '../services/favoritesApi';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function searchTMDB(
  query: string,
  language: string
): Promise<TMDBResponse<Movie>> {
  const url =
    `${BASE_URL}/search/multi` +
    `?api_key=${API_KEY}` +
    `&language=${language}` +
    `&query=${encodeURIComponent(query)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to perform search');
  }

  return res.json();
}

interface SearchItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  genres?: {
    id: number;
    name: string;
  }[];
  media_type: 'movie' | 'tv';
}

const SearchPage = () => {
  const { t, i18n } = useTranslation();
  const { search } = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const query = params.get('query') || '';

  const [results, setResults] = useState<SearchItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [addForLater] = useAddForLaterMutation();
  const [addFavorite] = useAddFavoriteMutation();

  // ==========================================
  // SEARCH
  // ==========================================

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    searchTMDB(query, i18n.language)
      .then((data) => {
        const filtered = data.results.filter(
          (item) =>
            item.media_type === 'movie' ||
            item.media_type === 'tv'
        );

        setResults(filtered);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, i18n.language]);

  // ==========================================
  // WATCH LATER
  // ==========================================

  const handleAdd = async (
    id: number,
    type: 'movie' | 'tv'
  ) => {
    try {
      await addForLater({
        contentId: id,
        contentType: type,
      }).unwrap();

      toast.success(
        "Added to 'Watch Later' list ❤️"
      );
    } catch {
      toast.error(
        "Failed to add to 'Watch Later' list 😢"
      );
    }
  };

  // ==========================================
  // FAVORITE
  // ==========================================

  const handleLike = async (
    id: number,
    type: 'movie' | 'tv'
  ) => {
    try {
      await addFavorite({
        contentId: id,
        contentType: type,
      }).unwrap();

      toast.success(
        'Added to favorites ❤️'
      );
    } catch {
      toast.error(
        'Failed to add to favorites 😢'
      );
    }
  };

  // ==========================================
  // OPEN MOVIE / TV
  // ==========================================

  const handleOpen = (
    id: number,
    type: 'movie' | 'tv'
  ) => {
    navigate(`/${type}/${id}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090612] text-white">

      {/* ==========================================
          BACKGROUND GLOW
      ========================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-700/20
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            -right-40
            top-[25%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-violet-700/10
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            -bottom-60
            left-[25%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-purple-800/15
            blur-[160px]
          "
        />

      </div>

      {/* ==========================================
          MAIN
      ========================================== */}

      <div className="relative z-10">

        <Header />

        <main
          className="
            mx-auto
            w-full
            max-w-[1600px]
            px-4
            pb-20
            pt-28
            sm:px-6
            lg:px-8
          "
        >

          {/* ======================================
              TITLE
          ====================================== */}

          <div className="mb-10">

            <div className="mb-4 flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-purple-400/20
                  bg-purple-500/10
                "
              >
                <Search
                  size={21}
                  className="text-purple-300"
                />
              </div>

              <span className="text-sm font-medium text-purple-300">
                {t(
                  'searchResults.label',
                  'Search'
                )}
              </span>

            </div>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
              "
            >
              {t(
                'searchResults.title',
                'Search Results'
              )}
            </h1>

            {query && (
              <p className="mt-3 text-gray-400">
                Results for:{' '}
                <span className="font-medium text-purple-300">
                  "{query}"
                </span>
              </p>
            )}

          </div>

          {/* ======================================
              LOADING
          ====================================== */}

          {loading && (
            <div
              className="
                flex
                min-h-[400px]
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-white/10
                bg-[#120D1D]/70
                backdrop-blur-xl
              "
            >

              <Loader2
                size={42}
                className="
                  animate-spin
                  text-purple-400
                "
              />

              <p className="mt-5 text-gray-400">
                {t(
                  'searchResults.loading',
                  'Searching...'
                )}
              </p>

            </div>
          )}

          {/* ======================================
              ERROR
          ====================================== */}

          {!loading && error && (
            <div
              className="
                rounded-2xl
                border
                border-red-400/20
                bg-red-500/10
                px-6
                py-5
                backdrop-blur-xl
              "
            >
              <p className="text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* ======================================
              NO RESULTS
          ====================================== */}

          {!loading &&
            !error &&
            results.length === 0 && (
              <div
                className="
                  flex
                  min-h-[400px]
                  flex-col
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#120D1D]/70
                  backdrop-blur-xl
                "
              >

                <div
                  className="
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-purple-400/20
                    bg-purple-500/10
                  "
                >
                  <Search
                    size={28}
                    className="text-purple-300"
                  />
                </div>

                <h2 className="mb-2 text-xl font-semibold">
                  {t(
                    'searchResults.noResults',
                    'Nothing found'
                  )}
                </h2>

                <p className="text-center text-sm text-gray-400">
                  Try searching for another movie
                  or TV series.
                </p>

              </div>
            )}

          {/* ======================================
              RESULTS
          ====================================== */}

          {!loading &&
            !error &&
            results.length > 0 && (

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                  sm:grid-cols-3
                  sm:gap-5
                  md:grid-cols-4
                  lg:grid-cols-5
                  xl:grid-cols-6
                "
              >

                {results.map((content) => {

                  const title =
                    content.title ||
                    content.name ||
                    'Untitled';

                  return (
                    <div
                      key={`${content.media_type}-${content.id}`}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#120D1D]
                        shadow-lg
                        shadow-purple-950/20
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-purple-400/30
                        hover:shadow-xl
                        hover:shadow-purple-900/30
                      "
                    >

                      {/* ==================================
                          POSTER
                      =================================== */}

                      <div className="relative aspect-[2/3]">

                        <img
                          src={
                            content.poster_path
                              ? `${IMAGE_BASE_URL}${content.poster_path}`
                              : '/no-poster.png'
                          }
                          alt={title}
                          loading="lazy"
                          className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />

                        {/* Dark gradient */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#090612]
                            via-[#090612]/20
                            to-transparent
                          "
                        />

                        {/* ==================================
                            TYPE
                        =================================== */}

                        <div className="absolute left-3 top-3 z-20">

                          <span
                            className="
                              rounded-full
                              border
                              border-white/10
                              bg-black/60
                              px-2.5
                              py-1
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-wider
                              text-purple-200
                              backdrop-blur-md
                            "
                          >
                            {content.media_type === 'tv'
                              ? 'TV'
                              : 'Movie'}
                          </span>

                        </div>

                        {/* ==================================
                            BUTTONS
                            
                            IMPORTANT:
                            NO opacity-0
                            NO group-hover
                            ALWAYS VISIBLE
                        =================================== */}

                        <div
                          className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            z-50
                            p-3
                          "
                        >

                          <div
                            className="
                              flex
                              w-full
                              items-center
                              gap-2
                              rounded-2xl
                              border
                              border-white/10
                              bg-[#120D1D]/95
                              p-2
                              shadow-2xl
                              shadow-black/60
                              backdrop-blur-xl
                            "
                          >

                            {/* PLAY */}

                            <button
                              type="button"
                              onClick={() =>
                                handleOpen(
                                  content.id,
                                  content.media_type
                                )
                              }
                              title="Watch"
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                bg-gradient-to-r
                                from-purple-600
                                to-violet-600
                                text-white
                                shadow-lg
                                shadow-purple-900/40
                                transition
                                hover:scale-110
                              "
                            >
                              <Play
                                size={16}
                                fill="currentColor"
                              />
                            </button>

                            {/* PLUS */}

                            <button
                              type="button"
                              onClick={() =>
                                handleAdd(
                                  content.id,
                                  content.media_type
                                )
                              }
                              title="Watch later"
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/20
                                bg-white/10
                                text-white
                                transition
                                hover:scale-110
                                hover:border-purple-400/50
                                hover:bg-purple-500/30
                              "
                            >
                              <Plus size={17} />
                            </button>

                            {/* LIKE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleLike(
                                  content.id,
                                  content.media_type
                                )
                              }
                              title="Like"
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/20
                                bg-white/10
                                text-white
                                transition
                                hover:scale-110
                                hover:border-purple-400/50
                                hover:bg-purple-500/30
                              "
                            >
                              <ThumbsUp size={16} />
                            </button>

                            {/* MORE */}

                            <button
                              type="button"
                              onClick={() =>
                                toast.info(
                                  'More details coming soon 😉'
                                )
                              }
                              title="More details"
                              className="
                                ml-auto
                                flex
                                h-9
                                w-9
                                shrink-0
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/20
                                bg-white/10
                                text-white
                                transition
                                hover:scale-110
                                hover:border-purple-400/50
                                hover:bg-purple-500/30
                              "
                            >
                              <ChevronDown
                                size={17}
                              />
                            </button>

                          </div>

                        </div>

                      </div>

                      {/* ==================================
                          INFO
                      =================================== */}

                      <div className="p-4">

                        <h2
                          className="
                            line-clamp-1
                            text-sm
                            font-semibold
                            text-white
                            transition-colors
                            group-hover:text-purple-300
                          "
                        >
                          {title}
                        </h2>

                        {content.genres &&
                          content.genres.length > 0 && (

                            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">

                              {content.genres
                                .slice(0, 3)
                                .map((genre, index) => (

                                  <span
                                    key={genre.id}
                                    className="
                                      text-[11px]
                                      text-gray-500
                                    "
                                  >

                                    {index > 0 && (
                                      <span className="mr-2 text-gray-700">
                                        •
                                      </span>
                                    )}

                                    {genre.name}

                                  </span>

                                ))}

                            </div>

                          )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </main>

        <Footer />

      </div>
    </div>
  );
};

export default SearchPage;

