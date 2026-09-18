import { useState } from "react";
import { useForgotPasswordMutation } from "../services/authApi";
import { toast } from "react-toastify";

interface Props {
  email: string;
}

const ChangePasswordRequest = ({ email }: Props) => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSend = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      setStatus("sent");
      toast.success("An email with instructions has been sent to your address 📩");
    } catch (err: any) {
      toast.error(err?.data?.message || "Error sending the email");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-purple-200/45">
        To change your password, an email with a link will be sent to your address{" "}
        <span className="text-purple-300 font-medium">{email}</span>.
      </p>

      <button
        onClick={handleSend}
        disabled={isLoading || status === "sent"}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-semibold rounded-xl shadow-[0_10px_30px_rgba(109,40,217,0.2)] hover:shadow-[0_10px_35px_rgba(139,92,246,0.3)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending..." : status === "sent" ? "Email sent ✅" : "Change password"}
      </button>
    </div>
  );
};

export default ChangePasswordRequest;