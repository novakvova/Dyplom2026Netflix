
import React from "react";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#090612]/80 px-5 py-6 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Purple glow */}
      <div className="pointer-events-none absolute h-[350px] w-[350px] rounded-full bg-purple-700/20 blur-[140px]" />

      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#120D1D]/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top purple glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-600/20 blur-[70px]" />

        <div className="relative flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
            <LogOut
              size={30}
              strokeWidth={1.8}
              className="text-purple-400"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {t("profile.LogOutModal.title") || "Sign out"}
          </h2>

          {/* Message */}
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
            {t("profile.LogOutModal.message") ||
              "Are you sure you want to sign out of your account?"}
          </p>
        </div>

        {/* Buttons */}
        <div className="relative mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 transition-all duration-200 hover:border-white/15 hover:bg-white/10 hover:text-white"
          >
            {t("profile.LogOutModal.cancel") || "Cancel"}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-4 text-sm font-bold text-white shadow-[0_10px_30px_rgba(109,40,217,0.2)] transition-all duration-200 hover:from-purple-500 hover:to-violet-400 hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)]"
          >
            {t("profile.LogOutModal.confirmLogout") || "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
