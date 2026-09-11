import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useForgotPasswordMutation } from "../services/authApi";
import logo from "../../public/logo-green.png";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await forgotPassword({ email }).unwrap();
      toast.success(t("forgotPassword.successToast"));
    } catch {
      setError(t("forgotPassword.errorToast"));
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090612] flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 p-6 md:p-8">
        <img
          src={logo}
          alt="logo"
          className="w-32 md:w-36 object-contain"
        />
      </div>

      {/* Form */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#120D1D]/95 backdrop-blur-xl p-7 md:p-9 shadow-2xl shadow-purple-950/30">

          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
            {t("forgotPassword.title")}
          </h2>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-7">
            {t("forgotPassword.instructionText")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder={t("forgotPassword.emailPlaceholder")}
              className="w-full px-4 py-3.5 rounded-xl bg-[#1B1528] border border-white/10 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold transition hover:from-purple-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
            >
              {isLoading
                ? t("forgotPassword.loadingButton")
                : t("forgotPassword.submitButton")}
            </button>
          </form>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-medium transition hover:bg-white/10 hover:text-white"
          >
            {t("forgotPassword.backButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;