import { useNavigate } from "react-router-dom";
import { useGetBlockInfoQuery } from "../services/userApi";
import { useTranslation } from "react-i18next";
import logo from "../../public/logo-green.png";

export default function BlockedPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetBlockInfoQuery();
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090612] text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px]" />

        <div className="relative z-10 text-purple-300 animate-pulse">
          {t("blockedPage.loading")}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#090612] text-white flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px]" />

        <div className="absolute left-6 md:left-20 top-8 z-20">
          <img src={logo} alt="logo" className="w-32" />
        </div>

        <div className="relative z-10 w-full max-w-md bg-[#120D1D]/95 border border-purple-500/20 rounded-xl p-8 text-center shadow-[0_25px_80px_rgba(88,28,135,0.25)]">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <span className="text-3xl text-purple-400">!</span>
          </div>

          <h2 className="text-2xl font-bold mb-3">
            {t("blockedPage.error.title")}
          </h2>

          <p className="text-purple-200/50 text-sm mb-6">
            {t("blockedPage.error.description")}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full h-12 rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-bold transition shadow-[0_0_25px_rgba(139,92,246,0.15)]"
          >
            {t("blockedPage.error.loginAgain")}
          </button>
        </div>
      </div>
    );
  }

  const reason = data.reason || t("blockedPage.defaultReason");

  const blockedDate = new Date(data.blockedAt).toLocaleString(
    i18n.language,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const unblockDate = data.durationDays
    ? new Date(
        new Date(data.blockedAt).getTime() +
          data.durationDays * 24 * 60 * 60 * 1000
      ).toLocaleString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#090612] text-white flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Logo */}
      <div className="absolute left-6 md:left-20 top-6 md:top-8 z-20">
        <img
          src={logo}
          alt="logo"
          className="w-28 md:w-32"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-24 relative z-10">
        <div className="w-full max-w-xl bg-[#120D1D]/95 border border-purple-500/20 rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(88,28,135,0.25)] backdrop-blur-xl">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-5">
            <span className="text-3xl font-bold text-purple-400">
              !
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            {t("blockedPage.title")}
          </h1>

          <p className="text-purple-200/60 text-base md:text-lg mb-7">
            {t("blockedPage.details")}
          </p>

          {/* Information */}
          <div className="space-y-5">
            {/* User email */}
            <div>
              <label className="block text-sm font-semibold text-purple-200/70 mb-2">
                {t("blockedPage.yourEmail")}
              </label>

              <input
                type="text"
                value={data.userEmail}
                readOnly
                className="w-full h-12 px-4 rounded-lg bg-[#1B1528] border border-purple-900 text-white text-sm outline-none cursor-not-allowed"
              />
            </div>

            {/* Admin email */}
            <div>
              <label className="block text-sm font-semibold text-purple-200/70 mb-2">
                {t("blockedPage.administratorEmail")}
              </label>

              <input
                type="text"
                value={data.adminEmail}
                readOnly
                className="w-full h-12 px-4 rounded-lg bg-[#1B1528] border border-purple-900 text-white text-sm outline-none cursor-not-allowed"
              />
            </div>

            {/* Reason */}
            <div className="rounded-lg bg-[#1B1528] border border-purple-900 p-4">
              <span className="block text-sm font-semibold text-purple-300/70 mb-1">
                {t("blockedPage.blockingReason")}
              </span>

              <p className="text-white text-sm leading-6">
                {reason}
              </p>
            </div>

            {/* Blocked date */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg bg-[#1B1528] border border-purple-900 p-4">
              <span className="text-sm font-semibold text-purple-300/70">
                {t("blockedPage.blockedOn")}
              </span>

              <span className="text-sm text-white sm:text-right">
                {blockedDate}
              </span>
            </div>

            {/* Unblock date */}
            {unblockDate && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 p-4">
                <span className="text-sm font-semibold text-purple-300">
                  {t("blockedPage.unblockingExpected")}
                </span>

                <span className="text-sm text-purple-100 sm:text-right">
                  {unblockDate}
                </span>
              </div>
            )}
          </div>

          {/* Login button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full h-12 mt-8 rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-bold transition-all duration-200 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-[0.98]"
          >
            {t("blockedPage.error.loginAgain")}
          </button>
        </div>
      </div>
    </div>
  );
}