import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../../public/logo-green.png";
import { useAuth } from "../context/AuthContext";
import { useUpdateSubscriptionMutation } from "../services/subscriptionApi";
import { useGetProfileQuery } from "../services/userApi";

const plans = [
  {
    nameKey: "basic",
    price: "4,99 EUR",
    qualityKey: "good",
    resolution: "720p (HD)",
    devices: "TV, computer, mobile phone, tablet",
    streams: 1,
    downloads: 1,
  },
  {
    nameKey: "standard",
    price: "7,49 EUR",
    qualityKey: "great",
    resolution: "1080p (Full HD)",
    devices: "TV, computer, mobile phone, tablet",
    streams: 2,
    downloads: 2,
  },
  {
    nameKey: "premium",
    price: "9,99 EUR",
    qualityKey: "best",
    resolution: "4K (Ultra HD) + HDR",
    extraKey: "spatialAudioExtra",
    devices: "TV, computer, mobile phone, tablet",
    streams: 4,
    downloads: 6,
  },
];

const ChoosePlanPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { fullName, email, password } = location.state || {};
  const { googleTempToken, isAuthenticated } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState("");
  const [error, setError] = useState("");
  const [updateSubscription, { isLoading }] =
    useUpdateSubscriptionMutation();

  const { data: user } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const formatPlanType = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "basic":
        return "Basic";
      case "standard":
        return "Standard";
      case "premium":
        return "Premium";
      default:
        return plan;
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan) {
      setError(t("choosePlan.errors.noPlanSelected"));
      return;
    }

    setError("");

    if (isAuthenticated) {
      try {
        if (!user?.subscriptionId && !user?.cardId) {
          navigate("/payment", {
            state: {
              selectedPlan,
              fullName,
              email,
              password,
              googleTempToken,
            },
          });

          window.location.reload();
          return;
        }

        await updateSubscription({
          id: user?.subscriptionId,
          dto: {
            type: formatPlanType(selectedPlan),
          },
        }).unwrap();

        navigate("/profile");
        window.location.reload();
      } catch (e) {
        console.error("Update subscription failed:", e);
        setError(t("choosePlan.errors.updateFailed"));
      }
    } else {
      navigate("/payment", {
        state: {
          selectedPlan,
          fullName,
          email,
          password,
          googleTempToken,
        },
      });

      window.location.reload();
    }
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
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition font-medium"
        >
          {t("choosePlan.backButton")}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 pb-10">
        <div className="mb-7">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {t("choosePlan.title")}
          </h2>

          <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
        </div>

       {/* Plans */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
  {plans.map((plan) => {
    const isSelected = selectedPlan === plan.nameKey;

    return (
      <div
        key={plan.nameKey}
        onClick={() => setSelectedPlan(plan.nameKey)}
        className={`relative cursor-pointer rounded-xl border p-4 transition duration-200 ${
          isSelected
            ? "border-purple-500 bg-[#1A1228] shadow-lg shadow-purple-900/20"
            : "border-white/10 bg-[#120D1D] hover:border-purple-500/40 hover:bg-[#171020]"
        }`}
      >
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-500/50" />
        )}

        {/* Plan header */}
        <div
          className={`rounded-lg p-3 mb-4 border ${
            isSelected
              ? "bg-purple-600/15 border-purple-500/30"
              : "bg-white/5 border-white/5"
          }`}
        >
          <h3 className="font-bold text-lg text-white">
            {t(`choosePlan.plans.${plan.nameKey}.name`)}
          </h3>

          <p className="text-gray-400 text-xs mt-1">
            {plan.resolution}
          </p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs">
            {t("choosePlan.labels.price")}
          </p>

          <p className="text-xl font-bold text-white mt-1">
            {plan.price}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-gray-500">
              {t("choosePlan.labels.quality")}
            </p>

            <p className="text-gray-200 mt-1">
              {t(`choosePlan.plans.${plan.nameKey}.quality`)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              {t("choosePlan.labels.resolution")}
            </p>

            <p className="text-gray-200 mt-1">
              {plan.resolution}
            </p>
          </div>

          {plan.extraKey && (
            <div>
              <p className="text-gray-500">
                {t("choosePlan.labels.extra")}
              </p>

              <p className="text-gray-200 mt-1">
                {t(`choosePlan.labels.${plan.extraKey}`)}
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500">
              {t("choosePlan.labels.devices")}
            </p>

            <p className="text-gray-200 mt-1 leading-relaxed">
              {plan.devices}
            </p>
          </div>

          <div className="flex justify-between border-t border-white/5 pt-3">
            <div>
              <p className="text-gray-500">
                {t("choosePlan.labels.streams")}
              </p>

              <p className="text-gray-200 mt-1 font-medium">
                {plan.streams}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500">
                {t("choosePlan.labels.downloads")}
              </p>

              <p className="text-gray-200 mt-1 font-medium">
                {plan.downloads}
              </p>
            </div>
          </div>
        </div>


      </div>
    );
  })}
</div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mt-4 px-1">
            {error}
          </p>
        )}

        {/* Continue */}
        <div className="mt-7">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold text-lg transition duration-200 hover:from-purple-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
          >
            {isAuthenticated
              ? t("choosePlan.save")
              : t("choosePlan.buttons.next")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlanPage;