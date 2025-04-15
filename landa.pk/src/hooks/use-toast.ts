import { toast } from "sonner";

export const useToast = () => {
  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    toast[type](message); // Dynamically call the appropriate toast type
  };

  return { showToast };
};
