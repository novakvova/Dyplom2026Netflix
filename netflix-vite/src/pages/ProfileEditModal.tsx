
import { useState, useEffect } from "react";
import { useUpdateUserMutation } from "../services/userApi";
import type { UserProfile } from "../types/user";
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: string | null;
  user: UserProfile | null;
}

const ProfileEditModal = ({
  isOpen,
  onClose,
  field,
  user,
}: ProfileEditModalProps) => {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setAvatar(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const formData = new FormData();

    formData.append("Id", user.id.toString());
    formData.append("FullName", fullName);
    formData.append("Email", email);

    let shouldUpdate = false;

    if (field === "fullName") {
      if (
        fullName.trim() !==
        (user.fullName || "").trim()
      ) {
        shouldUpdate = true;
      }
    } else if (field === "email") {
      if (
        email.trim() !==
        (user.email || "").trim()
      ) {
        shouldUpdate = true;
      }
    } else if (field === "password") {
      if (password) {
        formData.append("Password", password);
        shouldUpdate = true;
      }
    } else if (field === "photo") {
      if (avatar) {
        formData.append(
          "ProfilePictureFile",
          avatar
        );
        shouldUpdate = true;
      }
    }

    if (!shouldUpdate) {
      onClose();
      return;
    }

    try {
      await updateUser(formData).unwrap();
      onClose();
    } catch (err) {
      console.error(
        t("profileEditModal.error"),
        err
      );
    }
  };

  if (!isOpen) return null;

  const currentAvatar =
    avatar
      ? URL.createObjectURL(avatar)
      : user?.profilePictureUrl || "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      {/* Затемнення */}
      <div
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/80
          backdrop-blur-md
        "
      />

      {/* Фіолетове світіння */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[450px]
          w-[450px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-700/20
          blur-[140px]
        "
      />

      {/* Modal */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#120D1D]
          text-white
          shadow-2xl
          shadow-purple-950/40
          backdrop-blur-2xl
        "
      >
        {/* Верхня декоративна лінія */}
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-purple-500
            to-transparent
          "
        />

        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-6
            py-5
            sm:px-7
          "
        >
          <div>
            <p
              className="
                mb-1
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-purple-400
              "
            >
              Profile
            </p>

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("profileEditModal.title")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              text-gray-400
              transition-all
              duration-200
              hover:border-purple-400/30
              hover:bg-purple-500/10
              hover:text-white
            "
          >
            <X size={21} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 sm:p-7"
        >
          {/* PHOTO */}
          {field === "photo" && (
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Avatar container */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-purple-400/20
                    bg-gradient-to-br
                    from-purple-600/20
                    via-[#120D1D]
                    to-violet-600/10
                    p-1
                    shadow-xl
                    shadow-purple-950/30
                  "
                >
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={t(
                        "profileEditModal.avatarAlt"
                      )}
                      className="
                        h-56
                        w-56
                        rounded-xl
                        bg-[#090612]
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-56
                        w-56
                        items-center
                        justify-center
                        rounded-xl
                        bg-gradient-to-br
                        from-purple-600
                        to-violet-800
                        text-5xl
                        font-bold
                      "
                    >
                      {user?.fullName
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Upload */}
                <label
                  className="
                    absolute
                    bottom-3
                    right-3
                    flex
                    h-11
                    w-11
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-purple-300/30
                    bg-gradient-to-br
                    from-purple-600
                    to-violet-600
                    text-white
                    shadow-lg
                    shadow-purple-950/50
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:from-purple-500
                    hover:to-violet-500
                  "
                >
                  <ImageIcon size={19} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setAvatar(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Choose a new profile picture
              </p>
            </div>
          )}

          {/* FULL NAME */}
          {field === "fullName" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                {t("profile.overview.name")}
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-purple-400
                  "
                />

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder={t(
                    "profileEditModal.namePlaceholder"
                  )}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    py-3
                    pl-11
                    pr-4
                    text-white
                    placeholder-gray-500
                    outline-none
                    transition-all
                    duration-200
                    focus:border-purple-400/40
                    focus:bg-purple-500/10
                    focus:ring-2
                    focus:ring-purple-500/10
                  "
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          {field === "email" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                {t("profile.overview.email")}
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-purple-400
                  "
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder={t(
                    "profileEditModal.emailPlaceholder"
                  )}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    py-3
                    pl-11
                    pr-4
                    text-white
                    placeholder-gray-500
                    outline-none
                    transition-all
                    duration-200
                    focus:border-purple-400/40
                    focus:bg-purple-500/10
                    focus:ring-2
                    focus:ring-purple-500/10
                  "
                />
              </div>
            </div>
          )}

          {/* PASSWORD */}
          {field === "password" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                {t("profile.overview.password")}
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-purple-400
                  "
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder={t(
                    "profileEditModal.passwordPlaceholder"
                  )}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    py-3
                    pl-11
                    pr-4
                    text-white
                    placeholder-gray-500
                    outline-none
                    transition-all
                    duration-200
                    focus:border-purple-400/40
                    focus:bg-purple-500/10
                    focus:ring-2
                    focus:ring-purple-500/10
                  "
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
            <button
              type="submit"
              className="
                w-full
                rounded-xl
                border
                border-purple-400/20
                bg-gradient-to-r
                from-purple-600
                to-violet-600
                px-5
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-purple-900/30
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:from-purple-500
                hover:to-violet-500
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500/30
                sm:flex-1
              "
            >
              {t(
                "profileEditModal.saveChanges"
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-5
                py-3
                font-semibold
                text-gray-300
                transition-all
                duration-200
                hover:border-white/20
                hover:bg-white/10
                hover:text-white
                sm:flex-1
              "
            >
              {t("common.cancel", {
                defaultValue: "Cancel",
              })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;

