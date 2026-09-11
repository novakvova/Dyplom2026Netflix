
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddCardMutation } from "../services/paymentApi";
import {
  useRegisterMutation,
  useGoogleRegisterMutation,
} from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import logo from "../../public/logo-green.png";
import { useAddSubscriptionMutation } from "../services/subscriptionApi";

const plans: Record<string, { price: string; label: string }> = {
  basic: {
    price: "4,99 EUR/month",
    label: "Basic",
  },
  standard: {
    price: "7,49 EUR/month",
    label: "Standard",
  },
  premium: {
    price: "9,99 EUR/month",
    label: "Premium",
  },
};

const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpiryMonth] = useState(0);
  const [expYear, setExpiryYear] = useState(0);
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedPlan,
    fullName,
    email,
    password,
    googleTempToken,
  } = location.state || {};

  const planInfo = selectedPlan
    ? plans[selectedPlan.toLowerCase()]
    : null;

  const {
    login: loginContext,
    setGoogleTempToken,
    isAuthenticated,
  } = useAuth();

  const [createCard, { isLoading: isCardLoading }] =
    useAddCardMutation();

  const [register, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  const [addSub] = useAddSubscriptionMutation();

  const [googleRegister, { isLoading: isGoogleLoading }] =
    useGoogleRegisterMutation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      toast.error("Please select a plan");
      navigate("/choose-plan");
      return;
    }

    try {
      if (!isAuthenticated) {
        let res;

        // Google registration
        if (googleTempToken) {
          res = await googleRegister({
            googleAccessToken: googleTempToken,
            subscriptionType: selectedPlan,
          }).unwrap();

          setGoogleTempToken(null);
        }

        // Normal registration
        else if (fullName && email && password) {
          res = await register({
            fullName,
            email,
            password,
            plan: selectedPlan,
          }).unwrap();
        }

        // Invalid registration flow
        else {
          toast.error("Invalid registration flow");
          navigate("/register");
          return;
        }

        // Login after registration
        loginContext(res.accessToken);

        // Save card
        await createCard({
          cardNumber,
          expMonth,
          expYear,
          cvv,
          cardholderName,
          makeDefault,
        }).unwrap();

        toast.success("Registration completed!");

        navigate("/home");
        window.location.reload();
      } else {
        // Add subscription
        await addSub({
          type: formatPlanType(selectedPlan),
        }).unwrap();

        // Save card
        await createCard({
          cardNumber,
          expMonth,
          expYear,
          cvv,
          cardholderName,
          makeDefault,
        }).unwrap();

        toast.success("Payment method successfully added");

        navigate("/home");
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Payment/Register error:", err);

      toast.error(
        err?.data?.message || "Something went wrong"
      );
    }
  };

  const isLoading =
    isCardLoading ||
    isRegisterLoading ||
    isGoogleLoading;

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
          onClick={() =>
            navigate("/choose-plan", {
              state: {
                fullName,
                email,
                password,
                googleTempToken,
              },
            })
          }
          className="text-gray-400 hover:text-white transition font-medium"
        >
          Change plan
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 pb-10">
        {/* Title */}
        <div className="mb-7">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Set up your credit or debit card
          </h2>

          <div className="mt-3 h-px w-full bg-gradient-to-r from-purple-500/60 via-violet-500/20 to-transparent" />
        </div>

        {/* Payment form */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-white/10 bg-[#120D1D] p-5 md:p-6">
            {/* Form header */}
            <div className="rounded-lg p-4 mb-5 border border-white/5 bg-white/5">
              <h3 className="font-bold text-lg text-white">
                Payment method
              </h3>

              <p className="text-gray-400 text-xs mt-1">
                Enter your card details below
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Card number */}
              <div>
                <label className="block text-gray-500 text-xs mb-2">
                  Card number
                </label>

                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full p-3 rounded-xl bg-[#0D0915] border border-white/10 text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/60 focus:bg-[#100B19]"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value)
                  }
                  required
                />
              </div>

              {/* Expiration + CVV */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-2">
                    Month
                  </label>

                  <input
                    type="number"
                    placeholder="MM"
                    min="1"
                    max="12"
                    className="w-full p-3 rounded-xl bg-[#0D0915] border border-white/10 text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/60"
                    value={expMonth || ""}
                    onChange={(e) =>
                      setExpiryMonth(
                        Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-xs mb-2">
                    Year
                  </label>

                  <input
                    type="number"
                    placeholder="YY"
                    min="24"
                    max="99"
                    className="w-full p-3 rounded-xl bg-[#0D0915] border border-white/10 text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/60"
                    value={expYear || ""}
                    onChange={(e) =>
                      setExpiryYear(
                        Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-xs mb-2">
                    CVV
                  </label>

                  <input
                    type="password"
                    placeholder="CVV"
                    className="w-full p-3 rounded-xl bg-[#0D0915] border border-white/10 text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/60"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Cardholder */}
              <div>
                <label className="block text-gray-500 text-xs mb-2">
                  Name on card
                </label>

                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full p-3 rounded-xl bg-[#0D0915] border border-white/10 text-white placeholder:text-gray-600 outline-none transition focus:border-purple-500/60"
                  value={cardholderName}
                  onChange={(e) =>
                    setCardholderName(e.target.value)
                  }
                  required
                />
              </div>

              {/* Default card */}
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={makeDefault}
                  onChange={(e) =>
                    setMakeDefault(e.target.checked)
                  }
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />

                <span className="text-sm text-gray-400">
                  Make this my default payment method
                </span>
              </label>

              {/* Subscription info */}
              {planInfo && (
                <div className="rounded-xl border border-purple-500/20 bg-purple-600/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-gray-500 text-xs">
                        Selected plan
                      </p>

                      <p className="text-white font-semibold mt-1">
                        {planInfo.label}
                      </p>

                      <p className="text-gray-400 text-sm mt-1">
                        {planInfo.price}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/choose-plan", {
                          state: {
                            fullName,
                            email,
                            password,
                            googleTempToken,
                          },
                        })
                      }
                      className="text-purple-400 hover:text-purple-300 transition font-semibold text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-semibold text-lg transition duration-200 hover:from-purple-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                >
                  {isLoading
                    ? "Please wait..."
                    : isAuthenticated
                    ? "Complete payment"
                    : "Complete registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

