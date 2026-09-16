import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils/getInitials";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

import {
  User,
  Shield,
  MonitorSmartphone,
  Users,
  CreditCard,
  LogOut,
  Edit,
  History,
  Book,
  Pin,
} from "lucide-react";

import { useGetProfileQuery } from "../services/userApi";
import ChangePasswordRequest from "../components/ChangePasswordRequest";
import ProfileEditModal from "./ProfileEditModal";

import visa from "../../public/visa.png";
import mastercard from "../../public/mastercard.png";
import amex from "../../public/amex.png";

import { useTranslation } from "react-i18next";

import {
  useDeleteCardMutation,
  useGetCardsQuery,
  useUpdateCardMutation,
} from "../services/paymentApi";

import type { CardDTO, CardUpdateDTO } from "../types/payment";
import EditCardModal from "../components/PaymentEditSection";
import { useCancelSubscriptionMutation } from "../services/subscriptionApi";
import LogoutConfirmModal from "../components/LogoutConfirmModal";

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: user, error, isLoading } =
    useGetProfileQuery();

  const [activeTab, setActiveTab] =
    useState("overview");

  const { data: cards, isLoading: cardsLoading } =
    useGetCardsQuery();

  const [updateCard] =
    useUpdateCardMutation();

  const [editingCard, setEditingCard] =
    useState<CardDTO | null>(null);

  const [cancelSubscription] =
    useCancelSubscriptionMutation();

  const [deleteCard] =
    useDeleteCardMutation();

  const [editingField, setEditingField] =
    useState<string | null>(null);

  const [isLogoutModalOpen, setIsLogoutModalOpen] =
    useState(false);

  // ==========================================
  // UPDATE CARD
  // ==========================================

  const handleUpdateCard = async (
    userId: number,
    card: CardUpdateDTO
  ) => {
    await updateCard({
      id: userId,
      dto: {
        cardNumber: card.cardNumber,
        cardholderName: card.cardholderName,
        cvv: card.cvv,
        expMonth: card.expMonth,
        expYear: card.expYear,
      },
    });

    window.location.reload();
  };

  // ==========================================
  // CANCEL SUBSCRIPTION
  // ==========================================

  const handleCancel = async () => {
    try {
      if (!user?.subscriptionId) return;

      await cancelSubscription(
        user.subscriptionId
      ).unwrap();

      if (user?.cardId) {
        await deleteCard(user.cardId).unwrap();
      }

      navigate("/");
    } catch (err) {
      console.error(
        "Cancel subscription failed:",
        err
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleConfirmLogout = () => {
    localStorage.removeItem("accessToken");

    navigate("/login");

    window.location.reload();

    setIsLogoutModalOpen(false);
  };

  // ==========================================
  // TABS
  // ==========================================

  const tabs = [
    {
      id: "overview",
      label: t("profile.menu.overview"),
      icon: User,
    },
    {
      id: "subscription",
      label: t("profile.menu.subscription"),
      icon: CreditCard,
    },
    {
      id: "security",
      label: t("profile.menu.security"),
      icon: Shield,
    },
    {
      id: "devices",
      label: t("profile.menu.devices"),
      icon: MonitorSmartphone,
    },
    ...(user?.role === "Admin"
      ? [
          {
            id: "admin",
            label: t(
              "profile.menu.adminPanel"
            ),
            icon: Users,
          },
        ]
      : []),
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090612] text-white">
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div
              className="
                mx-auto
                mb-5
                h-10
                w-10
                animate-spin
                rounded-full
                border-2
                border-purple-500/20
                border-t-purple-500
              "
            />

            <p className="text-gray-400">
              {t("profile.loading")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#090612] text-white">
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div
            className="
              rounded-2xl
              border
              border-red-400/20
              bg-red-500/10
              px-8
              py-6
              text-center
              backdrop-blur-xl
            "
          >
            <p className="text-red-300">
              {(error as any).data?.message ||
                t("profile.error")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#090612]
        text-white
      "
    >
      {/* ==========================================
          BACKGROUND GLOW
      ========================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top left */}
        <div
          className="
            absolute
            -left-48
            -top-48
            h-[600px]
            w-[600px]
            rounded-full
            bg-purple-700/20
            blur-[160px]
          "
        />

        {/* Right */}
        <div
          className="
            absolute
            -right-48
            top-[30%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-violet-700/10
            blur-[160px]
          "
        />

        {/* Bottom */}
        <div
          className="
            absolute
            -bottom-64
            left-[25%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-purple-800/15
            blur-[170px]
          "
        />
      </div>

      <div className="relative z-10">
        <Header />

        {/* ========================================
            PROFILE EDIT MODAL
        ========================================= */}

        <ProfileEditModal
          isOpen={!!editingField}
          onClose={() =>
            setEditingField(null)
          }
          field={editingField}
          user={user || null}
        />

        {/* ========================================
            MAIN
        ========================================= */}

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-1
            flex-col
            gap-8
            px-4
            pb-24
            pt-28
            sm:px-6
            lg:px-8
            md:flex-row
          "
        >
          {/* ======================================
              LEFT MENU
          ====================================== */}

          <aside
            className="
              h-fit
              w-full
              rounded-2xl
              border
              border-white/10
              bg-[#120D1D]/75
              p-3
              shadow-xl
              shadow-purple-950/10
              backdrop-blur-xl
              md:w-72
            "
          >
            <div className="mb-4 px-3 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                Profile
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                {user?.fullName || "Account"}
              </h2>
            </div>

            <ul className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                const isActive =
                  activeTab === tab.id;

                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTab(tab.id)
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-left
                        text-base
                        font-semibold
                        transition-all
                        duration-200
                        ${
                          isActive
                            ? `
                              border
                              border-purple-400/20
                              bg-purple-500/15
                              text-purple-200
                              shadow-lg
                              shadow-purple-900/10
                            `
                            : `
                              border
                              border-transparent
                              text-gray-400
                              hover:border-white/5
                              hover:bg-white/5
                              hover:text-white
                            `
                        }
                      `}
                    >
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-purple-400"
                            : "text-gray-500"
                        }
                      />

                      <span>
                        {tab.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ======================================
              CONTENT
          ====================================== */}

          <main className="min-w-0 flex-1">

            {/* ====================================
                OVERVIEW
            ==================================== */}

            {activeTab === "overview" && (
              <section
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#120D1D]/75
                  p-5
                  shadow-2xl
                  shadow-purple-950/10
                  backdrop-blur-xl
                  sm:p-7
                "
              >
                {/* Header */}

                <div className="mb-8">
                  <p className="mb-1 text-sm font-medium text-purple-400">
                    Account
                  </p>

                  <h3 className="text-2xl font-bold sm:text-3xl">
                    {t(
                      "profile.overview.title"
                    )}
                  </h3>
                </div>

                <div
                  className="
                    flex
                    flex-col
                    gap-8
                    xl:flex-row
                  "
                >
                  {/* =================================
                      AVATAR
                  ================================= */}

                  <div className="w-full xl:w-64">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">
                        Photo
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingField("photo")
                        }
                        className="
                          rounded-lg
                          p-2
                          text-gray-400
                          transition
                          hover:bg-purple-500/10
                          hover:text-purple-300
                        "
                      >
                        <Edit size={18} />
                      </button>
                    </div>

                    {user?.profilePictureUrl ? (
                      <img
                        src={`http://localhost:5170${user.profilePictureUrl}`}
                        alt={user.fullName}
                        className="
                          h-64
                          w-full
                          rounded-2xl
                          border
                          border-white/10
                          object-cover
                          shadow-xl
                          shadow-purple-950/20
                          xl:h-64
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-64
                          w-full
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-purple-400/20
                          bg-gradient-to-br
                          from-purple-600
                          via-violet-600
                          to-purple-900
                          text-5xl
                          font-bold
                          text-white
                          shadow-xl
                          shadow-purple-900/30
                        "
                      >
                        {getInitials(
                          user?.fullName || ""
                        )}
                      </div>
                    )}
                  </div>

                  {/* =================================
                      USER INFORMATION
                  ================================= */}

                  <div className="flex-1 space-y-5">

                    {/* NAME */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">
                        {t(
                          "profile.overview.name"
                        )}
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={
                            user?.fullName || ""
                          }
                          readOnly
                          className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-white/5
                            px-4
                            py-3
                            pr-12
                            font-medium
                            text-white
                            outline-none
                            transition
                            focus:border-purple-400/40
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setEditingField(
                              "fullName"
                            )
                          }
                          className="
                            absolute
                            right-2
                            top-1/2
                            -translate-y-1/2
                            rounded-lg
                            p-2
                            text-gray-400
                            transition
                            hover:bg-purple-500/10
                            hover:text-purple-300
                          "
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">
                        {t(
                          "profile.overview.email"
                        )}
                      </label>

                      <div className="relative">
                        <input
                          type="text"
                          value={
                            user?.email || ""
                          }
                          readOnly
                          className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-white/5
                            px-4
                            py-3
                            pr-12
                            font-medium
                            text-white
                            outline-none
                            transition
                            focus:border-purple-400/40
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setEditingField(
                              "email"
                            )
                          }
                          className="
                            absolute
                            right-2
                            top-1/2
                            -translate-y-1/2
                            rounded-lg
                            p-2
                            text-gray-400
                            transition
                            hover:bg-purple-500/10
                            hover:text-purple-300
                          "
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </div>

                    {/* PASSWORD */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-300">
                        {t(
                          "profile.overview.password"
                        )}
                      </label>

                      <div className="relative">
                        <input
                          type="password"
                          value="********"
                          readOnly
                          className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-white/5
                            px-4
                            py-3
                            pr-12
                            font-medium
                            text-white
                            outline-none
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setActiveTab(
                              "security"
                            )
                          }
                          className="
                            absolute
                            right-2
                            top-1/2
                            -translate-y-1/2
                            rounded-lg
                            p-2
                            text-gray-400
                            transition
                            hover:bg-purple-500/10
                            hover:text-purple-300
                          "
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </div>

                    {/* =================================
                        QUICK ACTIONS
                    ================================= */}

                    <div className="grid gap-3 pt-2">

                      {/* HISTORY */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/movie/history",
                            {
                              state: { user },
                            }
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-purple-400/20
                          bg-gradient-to-r
                          from-purple-600
                          to-violet-600
                          px-4
                          py-3
                          font-semibold
                          text-white
                          shadow-lg
                          shadow-purple-900/20
                          transition-all
                          hover:-translate-y-0.5
                          hover:from-purple-500
                          hover:to-violet-500
                        "
                      >
                        <History size={18} />

                        {t(
                          "profile.overview.watchHistory"
                        )}
                      </button>

                      {/* FAVORITES */}

                      <button
                        type="button"
                        onClick={() => {
                          navigate(
                            "/favorites"
                          );
                          window.location.reload();
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-white/10
                          bg-white/5
                          px-4
                          py-3
                          font-semibold
                          text-white
                          backdrop-blur-md
                          transition-all
                          hover:border-purple-400/30
                          hover:bg-purple-500/15
                          hover:text-purple-200
                        "
                      >
                        <Book size={18} />

                        {t(
                          "profile.overview.favorites"
                        )}
                      </button>

                      {/* FOR LATER */}

                      <button
                        type="button"
                        onClick={() => {
                          navigate(
                            "/for-later"
                          );
                          window.location.reload();
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-white/10
                          bg-white/5
                          px-4
                          py-3
                          font-semibold
                          text-white
                          backdrop-blur-md
                          transition-all
                          hover:border-purple-400/30
                          hover:bg-purple-500/15
                          hover:text-purple-200
                        "
                      >
                        <Pin size={18} />

                        {t(
                          "profile.overview.forLater"
                        )}
                      </button>

                    </div>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={() =>
                        setIsLogoutModalOpen(
                          true
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-400/20
                        bg-red-500/10
                        px-4
                        py-3
                        font-semibold
                        text-red-300
                        transition-all
                        hover:border-red-400/30
                        hover:bg-red-500/20
                        hover:text-red-200
                      "
                    >
                      <LogOut size={18} />

                      {t(
                        "profile.overview.logOut"
                      )}
                    </button>

                  </div>
                </div>
              </section>
            )}

            {/* ====================================
                SUBSCRIPTION
            ==================================== */}

            {activeTab === "subscription" && (
              <section
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#120D1D]/75
                  p-5
                  shadow-2xl
                  shadow-purple-950/10
                  backdrop-blur-xl
                  sm:p-7
                "
              >
                <div className="mb-8">
                  <p className="mb-1 text-sm font-medium text-purple-400">
                    Membership
                  </p>

                  <h3 className="text-2xl font-bold sm:text-3xl">
                    {t(
                      "profile.subscription.title"
                    )}
                  </h3>
                </div>

                {cardsLoading && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <div
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-purple-400/20
                        border-t-purple-400
                      "
                    />

                    {t("profile.loading")}
                  </div>
                )}

                {!cardsLoading && (
                  <>
                    {cards?.map((card) => (
                      <div
                        key={card.id}
                        className="space-y-4"
                      >
                        {/* CURRENT PLAN */}

                        <div
                          className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-purple-400/20
                            bg-gradient-to-br
                            from-purple-600/15
                            via-[#120D1D]
                            to-violet-600/10
                            shadow-xl
                            shadow-purple-950/20
                          "
                        >
                          <div className="p-5 sm:p-6">

                            <div className="mb-5 flex items-center justify-between">
                              <div>
                                <p className="text-xs uppercase tracking-wider text-purple-400">
                                  Current plan
                                </p>

                                <h4 className="mt-1 text-2xl font-bold">
                                  {user?.subscriptionType?.toUpperCase() ||
                                    "STANDARD"}
                                </h4>
                              </div>

                              <CreditCard
                                className="text-purple-400"
                                size={28}
                              />
                            </div>

                            <p className="mb-5 text-gray-300">
                              {user?.subscriptionType?.toLowerCase() ===
                              "basic"
                                ? "1 device, 720p (HD)"
                                : user?.subscriptionType?.toLowerCase() ===
                                  "standard"
                                ? "2 devices, 1080p (Full HD)"
                                : user?.subscriptionType?.toLowerCase() ===
                                  "premium"
                                ? "4 devices, 4K (Ultra HD) + HDR"
                                : ""}
                            </p>

                            <div className="space-y-2 text-sm text-gray-400">
                              <p>
                                {t(
                                  "profile.subscription.startDate"
                                )}
                                :{" "}
                                <span className="text-gray-200">
                                  {t(
                                    "profile.subscription.date"
                                  )}
                                </span>
                              </p>

                              <p>
                                {t(
                                  "profile.subscription.nextPayment"
                                )}
                                :{" "}
                                <span className="text-gray-200">
                                  {t(
                                    "profile.subscription.nextDate"
                                  )}
                                </span>
                              </p>
                            </div>

                            <div
                              className="
                                mt-5
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-white/10
                                bg-black/20
                                p-3
                              "
                            >
                              <img
                                src={
                                  card.brand.toLowerCase() ===
                                  "visa"
                                    ? visa
                                    : card.brand.toLowerCase() ===
                                      "mastercard"
                                    ? mastercard
                                    : card.brand.toLowerCase() ===
                                      "amex"
                                    ? amex
                                    : visa
                                }
                                alt={card.brand}
                                className="h-6"
                              />

                              <span className="text-sm tracking-widest text-gray-300">
                                •••• •••• ••••{" "}
                                {card.last4}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                "/choose-plan"
                              )
                            }
                            className="
                              w-full
                              border-t
                              border-white/10
                              bg-white/5
                              py-3
                              font-semibold
                              text-purple-200
                              transition
                              hover:bg-purple-500/10
                              hover:text-white
                            "
                          >
                            {t(
                              "profile.subscription.changePlan"
                            )}
                          </button>
                        </div>

                        {/* NEXT PAYMENT */}

                        <div
                          className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            backdrop-blur-xl
                          "
                        >
                          <div className="p-5 sm:p-6">

                            <div className="mb-5 flex items-center gap-3">
                              <div
                                className="
                                  flex
                                  h-10
                                  w-10
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-purple-500/10
                                  text-purple-400
                                "
                              >
                                <CreditCard size={19} />
                              </div>

                              <div>
                                <h4 className="font-semibold">
                                  Next payment
                                </h4>

                                <p className="text-xs text-gray-500">
                                  Payment information
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-400">
                              <p>
                                {t(
                                  "profile.subscription.nextDate"
                                )}
                              </p>

                              <p>
                                {t(
                                  "profile.subscription.startDate"
                                )}
                                :{" "}
                                {t(
                                  "profile.subscription.date"
                                )}
                              </p>
                            </div>

                            <div
                              className="
                                mt-5
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-white/10
                                bg-black/20
                                p-3
                              "
                            >
                              <img
                                src={
                                  card.brand.toLowerCase() ===
                                  "visa"
                                    ? visa
                                    : card.brand.toLowerCase() ===
                                      "mastercard"
                                    ? mastercard
                                    : card.brand.toLowerCase() ===
                                      "amex"
                                    ? amex
                                    : visa
                                }
                                alt={card.brand}
                                className="h-6"
                              />

                              <span className="text-sm tracking-widest text-gray-300">
                                •••• •••• ••••{" "}
                                {card.last4}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setEditingCard(
                                card
                              )
                            }
                            className="
                              w-full
                              border-t
                              border-white/10
                              bg-white/5
                              py-3
                              font-semibold
                              text-gray-300
                              transition
                              hover:bg-purple-500/10
                              hover:text-purple-200
                            "
                          >
                            Change payment method
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    mt-6
                    w-full
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-500/10
                    py-3
                    font-semibold
                    text-red-300
                    transition
                    hover:border-red-400/30
                    hover:bg-red-500/20
                    hover:text-red-200
                  "
                >
                  Cancel subscription
                </button>
              </section>
            )}

            {/* ====================================
                EDIT CARD MODAL
            ==================================== */}

            {editingCard && (
              <EditCardModal
                card={editingCard}
                isOpen={!!editingCard}
                onClose={() =>
                  setEditingCard(null)
                }
                onUpdate={handleUpdateCard}
              />
            )}

            {/* ====================================
                SECURITY
            ==================================== */}

            {activeTab === "security" && (
              <section
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#120D1D]/75
                  p-5
                  shadow-2xl
                  shadow-purple-950/10
                  backdrop-blur-xl
                  sm:p-7
                "
              >
                <div className="mb-7 flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-purple-400/20
                      bg-purple-500/10
                    "
                  >
                    <Shield
                      size={23}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold sm:text-3xl">
                      {t(
                        "profile.security.title"
                      )}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Keep your account secure
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mb-6
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-5
                  "
                >
                  <p className="text-gray-300">
                    {t(
                      "profile.security.description"
                    )}
                  </p>
                </div>

                <ChangePasswordRequest
                  email={user?.email || ""}
                />
              </section>
            )}

            {/* ====================================
                DEVICES
            ==================================== */}

            {activeTab === "devices" && (
              <section
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#120D1D]/75
                  p-5
                  shadow-2xl
                  shadow-purple-950/10
                  backdrop-blur-xl
                  sm:p-7
                "
              >
                <div className="mb-7 flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-purple-400/20
                      bg-purple-500/10
                    "
                  >
                    <MonitorSmartphone
                      size={23}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold sm:text-3xl">
                      {t(
                        "profile.devices.title"
                      )}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Manage your connected devices
                    </p>
                  </div>
                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-6
                  "
                >
                  <p className="text-gray-400">
                    {t(
                      "profile.devices.description"
                    )}
                  </p>
                </div>
              </section>
            )}

            {/* ====================================
                ADMIN
            ==================================== */}

            {user?.role === "Admin" &&
              activeTab === "admin" && (
                <section
                  className="
                    rounded-3xl
                    border
                    border-purple-400/20
                    bg-[#120D1D]/75
                    p-6
                    shadow-2xl
                    shadow-purple-950/20
                    backdrop-blur-xl
                  "
                >
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-purple-400/20
                        bg-purple-500/10
                      "
                    >
                      <Users
                        size={23}
                        className="text-purple-400"
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        {t(
                          "profile.menu.adminPanel"
                        )}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Administration
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/admin")
                    }
                    className="
                      w-full
                      rounded-xl
                      bg-gradient-to-r
                      from-purple-600
                      to-violet-600
                      px-5
                      py-3
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-purple-900/30
                      transition
                      hover:from-purple-500
                      hover:to-violet-500
                    "
                  >
                    {t(
                      "profile.admin.adminPanel"
                    )}
                  </button>
                </section>
              )}

          </main>
        </div>

        {/* ========================================
            FOOTER
        ========================================= */}

        <Footer />
      </div>

      {/* ==========================================
          LOGOUT MODAL
      ========================================== */}

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() =>
          setIsLogoutModalOpen(false)
        }
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default ProfilePage;

