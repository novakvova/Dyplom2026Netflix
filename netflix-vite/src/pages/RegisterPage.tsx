import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../public/logo-green.png";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "../services/authApi";
import GoogleIcon from "../icons/GoogleIcon";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import eye_open from "../../public/eye-open.png";
import eye_close from "../../public/eye-close.png";

const RegisterPage = () => {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const navigate = useNavigate();

  const [googleLogin] = useGoogleLoginMutation();

  const {
    setGoogleTempToken,
    login: loginContext,
  } = useAuth();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("register.passwordsDontMatch"));
      return;
    }

    if (!isAgreed) {
      setError(t("register.agreeTermsError"));
      return;
    }

    navigate("/plan-intro", {
      state: {
        fullName,
        email,
        password,
      },
    });

    toast.success(t("register.success"));
  };

  const onRegisterGoogleResult = async (googleToken: string) => {
    if (!googleToken) return;

    try {
      const res = await googleLogin({
        googleAccessToken: googleToken,
      }).unwrap();

      if (res.accessToken && res.isActive) {
        loginContext(res.accessToken);
        navigate("/home");
      } else {
        setGoogleTempToken(googleToken);
        navigate("/plan-intro");
      }
    } catch (error) {
      console.log("Google error:", error);
    }
  };

  const googleRegisterFunc = useGoogleLogin({
    scope:
      "openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    prompt: "select_account",

    onSuccess: async (tokenResponse) => {
      await onRegisterGoogleResult(
        tokenResponse.access_token
      );
    },

    onError: () => {
      toast.error(t("register.googleError"));
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090612] flex flex-col relative overflow-hidden">

      {/* Purple background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[140px]" />

      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px]" />

      {/* Logo */}
      <div className="absolute left-6 md:left-20 top-8 z-20">
        <img
          src={logo}
          alt="logo"
          className="w-32"
        />
      </div>

      {/* Register */}
      <div className="flex flex-1 items-center justify-center px-4 py-20 relative z-10">

        <div
          className="
            w-full
            max-w-md
            bg-[#120D1D]/95
            border
            border-purple-500/20
            rounded-xl
            py-8
            px-6
            sm:px-10
            shadow-2xl
          "
        >

          {/* Title */}
          <h2 className="text-white text-3xl font-bold mb-2">
            {t("register.title")}
          </h2>

          <p className="text-purple-200/50 text-sm mb-6">
            Create your account and start watching
          </p>

          <form
            onSubmit={handleNext}
            className="space-y-4"
          >

            {/* Full name */}
            <input
              type="text"
              placeholder={t(
                "register.fullNamePlaceholder"
              )}
              className="
                w-full
                h-12
                px-4
                rounded-lg
                bg-[#1B1528]
                border
                border-purple-900
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-500/20
                transition
              "
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder={t(
                "register.emailPlaceholder"
              )}
              className="
                w-full
                h-12
                px-4
                rounded-lg
                bg-[#1B1528]
                border
                border-purple-900
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-500/20
                transition
              "
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder={t(
                  "register.passwordPlaceholder"
                )}
                className="
                  w-full
                  h-12
                  px-4
                  pr-12
                  rounded-lg
                  bg-[#1B1528]
                  border
                  border-purple-900
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/20
                  transition
                "
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  opacity-60
                  hover:opacity-100
                "
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                <img
                  src={
                    showPassword
                      ? eye_close
                      : eye_open
                  }
                  alt="show password"
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder={t(
                  "register.confirmPasswordPlaceholder"
                )}
                className="
                  w-full
                  h-12
                  px-4
                  pr-12
                  rounded-lg
                  bg-[#1B1528]
                  border
                  border-purple-900
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/20
                  transition
                "
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  opacity-60
                  hover:opacity-100
                "
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <img
                  src={
                    showConfirmPassword
                      ? eye_close
                      : eye_open
                  }
                  alt="show password"
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Terms */}
            <label
              htmlFor="terms-checkbox"
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={isAgreed}
                onChange={(e) =>
                  setIsAgreed(e.target.checked)
                }
                className="
                  w-5
                  h-5
                  accent-purple-600
                  cursor-pointer
                "
              />

              <span className="text-white text-sm font-medium">
                {t("register.agreeToTerms")}
              </span>
            </label>

            {/* Continue */}
            <button
              type="submit"
              disabled={!isAgreed}
              className="
                w-full
                h-12
                rounded-lg
                bg-gradient-to-r
                from-purple-600
                to-violet-500
                text-white
                text-lg
                font-bold
                transition
                hover:from-purple-500
                hover:to-violet-400
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              {t("register.continueButton")}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-purple-500/20" />

              <span className="text-xs text-gray-500">
                OR
              </span>

              <div className="h-px flex-1 bg-purple-500/20" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="
                flex
                items-center
                justify-center
                w-full
                h-12
                bg-white
                hover:bg-gray-100
                transition
                text-black
                font-bold
                rounded-lg
              "
              onClick={() =>
                googleRegisterFunc()
              }
            >
              <GoogleIcon className="w-5 h-5 mr-3" />

              {t("register.googleButton")}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {t(
              "register.alreadyHaveAccount"
            )}

            <button
              onClick={() =>
                navigate("/login")
              }
              className="
                ml-1
                text-purple-400
                hover:text-purple-300
                hover:underline
              "
            >
              {t(
                "register.signInLink"
              )}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;