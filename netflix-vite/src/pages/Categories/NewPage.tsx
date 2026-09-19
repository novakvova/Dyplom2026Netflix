
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MediaGrid from "../../components/MediaGrid";
import {
  getMovieGenres,
  getTopRatedMovies,
} from "../../services/movieApi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MoviesPage() {
  const [genres, setGenres] = useState<
    { id: number; name: string }[]
  >([]);

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getMovieGenres(1, currentLanguage);

        if (data?.genres) {
          setGenres(data.genres);
        }
      } catch (error) {
        console.error("Failed to load movie genres:", error);
      }
    };

    loadGenres();
  }, [currentLanguage]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090612] text-white">
      {/* ================= BACKGROUND GLOW ================= */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/20 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 top-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-40 left-[20%] h-[450px] w-[450px] rounded-full bg-purple-700/10 blur-[140px]" />

      {/* ================= HEADER ================= */}

      <div className="relative z-30">
        <Header />
      </div>

      {/* ================= MAIN ================= */}

      <main className="relative z-10 px-4 pb-16 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">

          {/* PAGE HEADER */}

          <div className="mb-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400/70">
                  Movies
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Топ фільми
                </h1>

                <p className="mt-2 max-w-xl text-sm text-white/40">
                  Переглядайте найпопулярніші та найкращі фільми.
                </p>
              </div>
            </div>

            {/* Gradient line */}

            <div className="mt-6 h-px w-full bg-gradient-to-r from-purple-500/70 via-violet-500/30 to-transparent" />
          </div>

          {/* ================= MOVIES CARD ================= */}

          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#120D1D]/90 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">

            {/* Card glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-purple-600/10 blur-[90px]" />

            <div className="relative z-10">
              <MediaGrid
                title="Популярні фільми"
                fetchData={(page, filters) =>
                  getTopRatedMovies(
                    page ?? 1,
                    currentLanguage,
                    filters
                  )
                }
                genres={genres}
              />
            </div>
          </section>
        </div>
      </main>

      {/* ================= FOOTER ================= */}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
