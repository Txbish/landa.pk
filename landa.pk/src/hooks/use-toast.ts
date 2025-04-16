import { toast } from "sonner";

export const useToast = () => {
  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    title: string = ""
  ) => {
    const formattedMessage = title ? `<strong>${title}</strong><br/>${message}` : message;
    toast[type](formattedMessage); // Dynamically call the appropriate toast type
  };

  return { showToast };
};
