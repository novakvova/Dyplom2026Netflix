
import { useState } from "react";
import type { CardDTO, CardUpdateDTO } from "../types/payment";

interface EditCardModalProps {
  card: CardDTO;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (cardId: number, dto: CardUpdateDTO) => Promise<void>;
}

const EditCardModal: React.FC<EditCardModalProps> = ({
  card,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [cardholderName, setCardholderName] = useState(card.cardholderName);
  const [cardNumber, setCardNumber] = useState(card.cardNumber);
  const [expMonth, setExpiryMonth] = useState(card.expMonth);
  const [expYear, setExpiryYear] = useState(card.expYear);
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await onUpdate(card.id, {
        cardNumber,
        cardholderName,
        expMonth,
        expYear,
        cvv,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      {/* Purple glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/15 blur-[140px]" />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#090612]/95 text-white shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
        {/* Top purple line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/70 to-transparent" />

        <div className="p-6 md:p-7">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white md:text-2xl">
                Edit Card
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Update your payment method
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Card preview */}
          <div className="relative mb-6 overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-[#1b102b] via-[#120D1D] to-[#0D0915] p-5 shadow-lg shadow-purple-950/20">
            <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-600/20 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-8 w-11 rounded-md border border-white/10 bg-white/10" />

                <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                  Payment
                </span>
              </div>

              <p className="mb-4 text-lg tracking-[0.2em] text-white">
                {cardNumber
                  ? `•••• •••• •••• ${cardNumber.slice(-4)}`
                  : "•••• •••• •••• ••••"}
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500">
                    Card holder
                  </p>

                  <p className="text-sm font-medium text-gray-200">
                    {cardholderName || "YOUR NAME"}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500">
                    Expires
                  </p>

                  <p className="text-sm font-medium text-gray-200">
                    {expMonth
                      ? `${String(expMonth).padStart(2, "0")}/${String(
                          expYear
                        ).slice(-2)}`
                      : "MM/YY"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Card number */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Card number
              </label>

              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-purple-500/[0.05] focus:ring-1 focus:ring-purple-500/20"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>

            {/* Expiry + CVV */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Expiry
                </label>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="MM"
                    min="1"
                    max="12"
                    className="w-1/2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-purple-500/[0.05] focus:ring-1 focus:ring-purple-500/20"
                    value={expMonth || ""}
                    onChange={(e) => setExpiryMonth(Number(e.target.value))}
                    required
                  />

                  <input
                    type="number"
                    placeholder="YY"
                    min="24"
                    max="99"
                    className="w-1/2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-purple-500/[0.05] focus:ring-1 focus:ring-purple-500/20"
                    value={expYear || ""}
                    onChange={(e) => setExpiryYear(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="w-1/3">
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  CVV
                </label>

                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-purple-500/[0.05] focus:ring-1 focus:ring-purple-500/20"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Cardholder */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Name on card
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-purple-500/[0.05] focus:ring-1 focus:ring-purple-500/20"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition-all duration-200 hover:from-purple-500 hover:to-violet-400 hover:shadow-purple-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;

