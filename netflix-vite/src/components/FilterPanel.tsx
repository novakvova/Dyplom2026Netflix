import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFilters } from "../context/FilterContext";
import { getMovieGenres, getTvGenres } from "../services/movieApi";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Genre {
  id: number;
  name: string;
}

const FilterPanel = ({ onClose }: { onClose: () => void }) => {
  const { filters, setFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(filters); // локальні зміни
  const [genres, setGenres] = useState<Genre[]>([]);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language; // 'ua' або 'en'

  useEffect(() => {
    const loadGenres = async () => {
      if (
        location.pathname.includes("movies") ||
        location.pathname.includes("cartoons") ||
        location.pathname.includes("new")
      ) {
        const res = await getMovieGenres(1, currentLanguage);
        setGenres(res.genres);
      } else if (
        location.pathname.includes("series") ||
        location.pathname.includes("anime")
      ) {
        const res = await getTvGenres(1, currentLanguage);
        setGenres(res.genres);
      }
    };
    loadGenres();

    // блокуємо скрол сторінки
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname]);

  const toggleGenre = (id: number) => {
    setLocalFilters({
      ...localFilters,
      genres: localFilters.genres.includes(id)
        ? localFilters.genres.filter((g) => g !== id)
        : [...localFilters.genres, id],
    });
  };

  const handleSubmit = () => {
    setFilters(localFilters); // застосовуємо глобально
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({ ratingFrom: 1, ratingTo: 10, genres: [] }); // скидаємо локально
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative flex h-screen w-full max-w-md flex-col overflow-hidden border-l border-white/10 bg-[#090612] shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
        {/* Purple background glow, як на LoginPage */}
        <div className="pointer-events-none absolute -right-32 top-10 h-[300px] w-[300px] rounded-full bg-purple-700/20 blur-[140px]" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-600/15 blur-[140px]" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Select filters
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 space-y-8 overflow-y-auto p-6">
          {/* IMDb Rating */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white">
              IMDb Rating
            </label>

            <div className="rounded-xl border border-white/10 bg-[#1B1528] p-4">
              <input
                type="range"
                min={1}
                max={10}
                value={localFilters.ratingFrom}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    ratingFrom: Number(e.target.value),
                  })
                }
                className="w-full accent-purple-500"
              />
              <input
                type="range"
                min={1}
                max={10}
                value={localFilters.ratingTo}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    ratingTo: Number(e.target.value),
                  })
                }
                className="mt-3 w-full accent-purple-500"
              />

              <div className="mt-2 flex justify-between text-sm text-purple-200/45">
                <span>From {localFilters.ratingFrom}</span>
                <span>To {localFilters.ratingTo}</span>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white">
              Select genre
            </label>

            <div className="grid grid-cols-2 gap-2">
              {genres.map((g) => {
                const active = localFilters.genres.includes(g.id);
                return (
                  <label
                    key={g.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                      active
                        ? "border-purple-500/60 bg-purple-500/10 text-white"
                        : "border-white/10 bg-[#1B1528] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleGenre(g.id)}
                      className="h-4 w-4 rounded border-white/20 bg-[#1B1528] accent-purple-600"
                    />
                    {g.name}
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleClear}
              className="mt-4 text-sm font-semibold text-purple-300 transition hover:text-purple-200 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/10 p-6">
          <button
            onClick={handleSubmit}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-base font-bold text-white shadow-[0_10px_30px_rgba(109,40,217,0.2)] transition-all duration-200 hover:from-purple-500 hover:to-violet-400 hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;