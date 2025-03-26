import { toast } from "react-toastify";

export const useToast = () => {
  const showError = (message: string) => {
    toast.error(message, {
      className: "bg-black text-white p-4 rounded-lg shadow-lg",
    });
  };

  return {showError};
};
