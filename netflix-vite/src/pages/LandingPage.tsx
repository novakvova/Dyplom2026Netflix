
import React, { useRef, useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import logo from "/logo-green.png";
import Footer from "../components/Footer/Footer";

import { FaDownload, FaChild } from "react-icons/fa";
import { GiFilmProjector } from "react-icons/gi";
import { MdOutlineScreenSearchDesktop } from "react-icons/md";

import { type Movie, type TMDBResponse } from "../types/movie";
import { getPopularMovies } from "../services/movieApi";

import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAuth } from "../context/AuthContext";
import { useGetProfileQuery } from "../services/userApi";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w780";

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, isAuthReady } = useAuth();

  const {
    data: userProfile,
    isLoading: isProfileLoading,
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.offsetWidth / 2;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data: TMDBResponse<Movie> = await getPopularMovies(
          1,
          currentLanguage
        );

        setMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error("Помилка завантаження:", error);
      }
    };

    fetchMovies();
  }, [currentLanguage]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#090612] text-white selection:bg-purple-500/30">
      {/* HEADER */}
      <header className="absolute left-0 top-0 z-30 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link to="/home">
            <img
              src={logo}
              alt="Logo"
              className="w-24 transition-transform duration-300 hover:scale-105 md:w-32"
            />
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <LanguageSwitcher />

            {isAuthReady ? (
              isAuthenticated ? (
                <Link to="/profile">
                  <div className="group relative">
                    <img
                      src={
                        userProfile?.profilePictureUrl
                          ? `http://localhost:5170/${userProfile.profilePictureUrl}`
                          : "/default-avatar.png"
                      }
                      alt="User Avatar"
                      className={`h-10 w-10 cursor-pointer rounded-full border-2 border-purple-500/60 object-cover transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] ${
                        isProfileLoading ? "animate-pulse" : ""
                      }`}
                    />
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <button
                    type="button"
                    className="rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-purple-400/40 hover:bg-purple-600/80 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]"
                  >
                    {t("landingPage.login")}
                  </button>
                </Link>
              )
            ) : (
              <div className="h-10 w-24 animate-pulse rounded-lg bg-purple-900/30" />
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/land-bg.jpg"
            alt="Background"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#090612]/75" />

          <div className="absolute inset-0 bg-gradient-to-b from-[#090612]/40 via-[#090612]/60 to-[#090612]" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#090612]/80 via-transparent to-[#090612]/80" />
        </div>

        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-[160px]" />

        <div className="relative z-10 max-w-5xl px-5 pt-16 text-center md:pt-20">
          <div className="mb-7 inline-flex items-center rounded-full border border-purple-400/20 bg-white/5 px-5 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            <span className="text-sm text-purple-200">
              {t("landingPage.popularNow")}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
            <Trans i18nKey="landingPage.heroTitle">
              Movies, series and lots of other content
              <br />
              without limits
            </Trans>
          </h1>

          <h2 className="mx-auto mb-5 max-w-3xl text-lg leading-relaxed text-purple-100/75 sm:text-xl md:text-2xl">
            <Trans i18nKey="landingPage.heroSubtitle">
              From{" "}
              <span className="font-bold text-purple-400">
                4,99 EUR
              </span>
              . You can cancel subscription anytime
            </Trans>
          </h2>

          {!isAuthenticated && (
            <>
              <p className="mx-auto mb-7 max-w-2xl text-purple-200/60">
                {t("landingPage.heroText")}
              </p>

              <div className="mx-auto flex max-w-2xl flex-col justify-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:flex-row">
                <input
                  type="email"
                  placeholder={t("landingPage.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 rounded-xl border border-white/10 bg-[#120D1D]/80 px-5 text-white outline-none transition placeholder:text-purple-200/30 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 sm:h-14"
                />

                <button
                  type="button"
                  onClick={() =>
                    navigate("/register", {
                      state: { email },
                    })
                  }
                  className="h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-7 font-bold text-white transition-all duration-300 hover:from-purple-500 hover:to-violet-400 hover:shadow-[0_0_35px_rgba(139,92,246,0.35)] active:scale-[0.98] sm:h-14"
                >
                  {t("landingPage.startButton")}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* TRANSITION */}
      <div className="relative h-10">
        <div className="absolute -top-10 left-0 h-20 w-full rounded-t-[50%] bg-gradient-to-b from-transparent via-purple-900/10 to-[#090612]" />
      </div>

      {/* POPULAR MOVIES */}
      <section className="relative bg-[#090612] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">
                {t("landingPage.popularNow")}
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("landingPage.popularNow")}
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl text-purple-200 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/15 hover:text-white"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl text-purple-200 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-500/15 hover:text-white"
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-visible px-2 py-8 scrollbar-hide scroll-smooth md:gap-7"
          >
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedMovie(movie)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedMovie(movie);
                  }
                }}
                className="group relative min-w-[170px] flex-shrink-0 cursor-pointer transition-all duration-500 hover:-translate-y-2 sm:min-w-[200px] md:min-w-[220px]"
              >
                <div className="absolute -left-5 -top-10 z-20 text-[110px] font-black leading-none text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.2)] [-webkit-text-stroke:2px_rgba(139,92,246,0.65)] sm:text-[140px]">
                  {index + 1}
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#120D1D] shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:border-purple-500/35 group-hover:shadow-[0_25px_60px_rgba(88,28,135,0.28)]">
                  <img
                    src={`${IMG_BASE}${movie.poster_path}`}
                    alt={movie.title || movie.original_title}
                    className="h-[270px] w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-[310px] md:h-[335px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#090612] via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="truncate text-sm font-semibold">
                      {movie.title || movie.original_title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MOVIE MODAL */}
          {selectedMovie && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
              onClick={() => setSelectedMovie(null)}
            >
              <div
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-purple-500/20 bg-[#120D1D] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64 w-full overflow-hidden rounded-t-2xl sm:h-80">
                  {selectedMovie.backdrop_path ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${BACKDROP_BASE}${selectedMovie.backdrop_path})`,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-950 to-[#120D1D]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#120D1D] via-[#120D1D]/20 to-transparent" />
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-2xl text-white transition hover:bg-purple-600"
                  onClick={() => setSelectedMovie(null)}
                >
                  ×
                </button>

                <div className="relative z-10 -mt-8 px-6 pb-8 sm:px-8">
                  <h3 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                    {selectedMovie.title || selectedMovie.original_title}
                  </h3>

                  <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-purple-200/60">
                    {selectedMovie.release_date && (
                      <span>
                        {new Date(
                          selectedMovie.release_date
                        ).getFullYear()}
                      </span>
                    )}

                    {selectedMovie.genres &&
                      selectedMovie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedMovie.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      )}

                    {selectedMovie.vote_average !== undefined && (
                      <span className="flex items-center gap-1 text-purple-300">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                        >
                          <path d="M12 .587l3.668 7.425L24 9.425l-6 5.856L19.332 24 12 20.255 4.668 24 6 15.281 0 9.425l8.332-1.413L12 .587z" />
                        </svg>

                        {selectedMovie.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p className="mb-7 leading-7 text-purple-100/70">
                    {selectedMovie.overview ||
                      t("landingPage.noDescription")}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate(`/movie/${selectedMovie.id}`);
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 px-6 font-bold text-white transition-all duration-200 hover:from-purple-500 hover:to-violet-400 hover:shadow-[0_0_35px_rgba(139,92,246,0.35)]"
                  >
                    {t("landingPage.startButton")}

                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                    >
                      <path d="M5 3l14 9-14 9z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* REASONS */}
      <section className="relative bg-[#090612] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              {t("landingPage.moreReasons")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ReasonCard
              icon={<GiFilmProjector />}
              title={t("landingPage.reasons.tv.title")}
              subtitle={t("landingPage.reasons.tv.subtitle")}
            />

            <ReasonCard
              icon={<FaDownload />}
              title={t("landingPage.reasons.download.title")}
              subtitle={t("landingPage.reasons.download.subtitle")}
            />

            <ReasonCard
              icon={<MdOutlineScreenSearchDesktop />}
              title={t("landingPage.reasons.anywhere.title")}
              subtitle={t("landingPage.reasons.anywhere.subtitle")}
            />

            <ReasonCard
              icon={<FaChild />}
              title={t("landingPage.reasons.kids.title")}
              subtitle={t("landingPage.reasons.kids.subtitle")}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#090612] px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              {t("landingPage.faq.title")}
            </h2>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <details
                key={item}
                className="group overflow-hidden rounded-xl border border-purple-500/15 bg-[#120D1D] transition-all duration-300 hover:border-purple-500/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-base font-semibold text-white md:text-lg">
                  <span>
                    {t(`landingPage.faq.q${item}`)}
                  </span>

                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-xl text-purple-400 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="px-5 pb-5">
                  <p className="text-sm leading-7 text-purple-200/60 md:text-base">
                    <Trans i18nKey={`landingPage.faq.a${item}`} />
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface ReasonCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const ReasonCard: React.FC<ReasonCardProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <div className="group relative flex min-h-[230px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-7 text-center shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-purple-500/30 hover:bg-white/[0.055] hover:shadow-[0_25px_60px_rgba(88,28,135,0.2)]">
      <div className="relative z-10 mb-5 text-5xl text-purple-400 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="relative z-10 mb-3 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="relative z-10 text-sm leading-6 text-purple-200/55">
        {subtitle}
      </p>

      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-700/15 blur-3xl" />

      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />
    </div>
  );
};

export default LandingPage;
