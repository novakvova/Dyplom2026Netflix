import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "../../icons/GoogleIcon";
import logo from "../../../public/logo-green.png";
import eye_open from "../../../public/eye-open.png";
import eye_close from "../../../public/eye-close.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setGoogleTempToken, login: loginContext } = useAuth();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password }).unwrap();

      if (res.isBlocked) {
        navigate("/blocked");
      }

      if (res.isActive) {
        loginContext(res.accessToken);
        toast.success("Successful login");
        navigate("/home");
      } else {
        loginContext(res.accessToken);
        toast.info("You need to choose a plan");
        navigate("/plan-intro");
      }
    } catch (err: any) {
      setError(err?.data?.message || "An error occurred during login");
    }
  };

  const onLoginGoogleResult = async (googleToken: string) => {
    if (!googleToken) return;

    try {
      const res = await googleLogin({
        googleAccessToken: googleToken,
      }).unwrap();

      if (res.accessToken && res.isActive) {
        loginContext(res.accessToken);
        navigate("/home");
        window.location.reload();
      } else {
        setGoogleTempToken(googleToken);
        loginContext(res.accessToken);
        navigate("/plan-intro");
      }
    } catch (error) {
      console.log("Google error: ", error);
      toast.error("An error occurred during Google login");
    }
  };

  const googleLoginFunc = useGoogleLogin({
    scope:
      "openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    prompt: "select_account",

    onSuccess: async (tokenResponse) => {
      await onLoginGoogleResult(tokenResponse.access_token);
    },

    onError: () => toast.error("Error during Google login"),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#090612] bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(9, 6, 18, 0.72), rgba(9, 6, 18, 0.88)), url('/login-bg.png')",
      }}
    >
      {/* Purple background glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[140px]" />

      {/* LOGO */}
      <div className="absolute left-6 top-6 z-10 sm:left-10 sm:top-8 lg:left-16">
        <img
          src={logo}
          alt="logo"
          className="w-28 object-contain sm:w-32"
        />
      </div>

      {/* LOGIN */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-24">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#120D1D]/95 px-6 py-8 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-8">
          <div className="mb-7">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Sign In
            </h2>

            <p className="mt-2 text-sm text-purple-200/45">
              Welcome back. Sign in to continue watching.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email or mobile number"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#1B1528] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/60 focus:bg-[#201830] focus:ring-2 focus:ring-purple-500/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-12 w-full rounded-xl border border-white/10 bg-[#1B1528] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-purple-500/60 focus:bg-[#201830] focus:ring-2 focus:ring-purple-500/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition hover:bg-white/5"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? eye_close : eye_open}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="h-5 w-5 object-contain opacity-60 transition hover:opacity-100"
                />
              </button>
            </div>

            {/* SIGN IN */}
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-base font-bold text-white shadow-[0_10px_30px_rgba(109,40,217,0.2)] transition-all duration-200 hover:from-purple-500 hover:to-violet-400 hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Please wait..." : "Sign In"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/30">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white text-sm font-semibold text-black transition hover:bg-gray-100"
            onClick={() => googleLoginFunc()}
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            Sign in with Google
          </button>

          {/* OPTIONS */}
          <div className="mt-4 flex items-center justify-between text-xs text-white/45">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-[#1B1528] accent-purple-600"
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-purple-300 transition hover:text-purple-200 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* REGISTER */}
          <div className="mt-7 border-t border-white/5 pt-5 text-center">
            <p className="text-sm text-white/40">
              New to Bingatch?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-purple-400 transition hover:text-purple-300 hover:underline"
              >
                Sign Up now.
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;