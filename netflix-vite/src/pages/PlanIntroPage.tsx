
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../public/logo-green.png";
import { useTranslation } from "react-i18next";

const PlanIntroPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const formData = location.state || {};

  const handleNext = () => {
    navigate("/choose-plan", {
      state: formData,
    });
  };

  return (
    <div className="min-h-screen bg-[#090612] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center py-6 px-6 md:px-10 lg:px-16">
        <img
          src={logo}
          alt="logo"
          className="w-32 md:w-36 object-contain"
        />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition font-medium"
        >
          {t("planIntro.backButton", "Back")}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 pb-10">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="mb-7">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {t("planIntro.title")}
            </h2>

            <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
          </div>

          {/* Intro card */}
          <div className="rounded-xl border border-white/10 bg-[#120D1D] p-5 md:p-7">
            {/* Header */}
            <div className="rounded-lg p-4 mb-6 border border-white/5 bg-white/5">
              <h3 className="font-bold text-lg text-white">
                {t("planIntro.title")}
              </h3>

              <p className="text-gray-400 text-xs mt-1">
                Choose the plan that works best for you
              </p>
            </div>

            {/* Points */}
            <div className="space-y-3">
              <div className="flex gap-3 rounded-lg border border-white/5 bg-[#0D0915] p-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-purple-400 text-xs font-bold">
                    1
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("planIntro.point1")}
                </p>
              </div>

              <div className="flex gap-3 rounded-lg border border-white/5 bg-[#0D0915] p-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-purple-400 text-xs font-bold">
                    2
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("planIntro.point2")}
                </p>
              </div>

              <div className="flex gap-3 rounded-lg border border-white/5 bg-[#0D0915] p-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-purple-400 text-xs font-bold">
                    3
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("planIntro.point3")}
                </p>
              </div>
            </div>

            {/* Continue */}
            <div className="mt-7">
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold text-lg transition duration-200 hover:from-purple-500 hover:to-violet-400 shadow-lg shadow-purple-900/20"
              >
                {t("planIntro.nextButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanIntroPage;

