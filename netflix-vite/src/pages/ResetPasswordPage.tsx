import { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../services/authApi";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../public/logo-green.png";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.passwordsDontMatch"));
      return;
    }

    try {
      await resetPassword({ email, token, newPassword }).unwrap();
      toast.success(t("resetPassword.success"));
      navigate("/login");
    } catch (err: any) {
      setError(err?.data?.message || t("resetPassword.error"));
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

          <h2 className="text-white text-2xl md:text-3xl font-bold mb-7 text-center">
            {t("resetPassword.title")}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder={t("resetPassword.newPasswordPlaceholder")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-[#1B1528] border border-white/10 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/10"
            />

            <input
              type="password"
              placeholder={t("resetPassword.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-[#1B1528] border border-white/10 text-white placeholder:text-gray-500 outline-none transition focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/10"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold transition duration-200 hover:from-purple-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
            >
              {isLoading
                ? t("resetPassword.loading")
                : t("resetPassword.changePassword")}
            </button>
          </form>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-medium transition hover:bg-white/10 hover:text-white"
          >
            {t("resetPassword.back")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;