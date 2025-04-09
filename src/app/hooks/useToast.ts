import { toast } from "react-toastify";

export const useToast = () => {
  const toastStyle = {
    className: "bg-black text-white p-3 rounded-lg shadow-lg font-semibold text-sm w-[150px] text-center",
  };

  const showError = (message: string) => {
    toast.error(message, toastStyle);
  };

  const showSuccess = (message: string) => {
    toast.success(message, {
      className: "bg-black text-white p-3 rounded-lg shadow-lg font-semibold text-sm w-[150px] text-center",
    });
  };

  return { showError, showSuccess };
};
