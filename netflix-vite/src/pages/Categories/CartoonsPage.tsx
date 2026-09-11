
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MediaGrid from "../../components/MediaGrid";
import { getMovieGenres, getCartoons } from "../../services/movieApi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MoviesPage() {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  useEffect(() => {
    getMovieGenres(1, currentLanguage).then((data) => {
      setGenres(data.genres);
    });
  }, [currentLanguage]);

  return (
    <div className="min-h-screen bg-[#090612] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />

      <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
          {/* Title */}
          <div className="mb-7">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Популярні фільми
            </h1>

            <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
          </div>

          {/* Movies */}
          <div className="rounded-xl border border-white/10 bg-[#120D1D] p-4 md:p-6">
            <MediaGrid
              title="Популярні фільми"
              fetchData={(page, filters) =>
                getCartoons(page ?? 1, currentLanguage, filters)
              }
              genres={genres}
            />
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

