import { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

export default function MessageBanner({
  message,
  type = "error",
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ mt: 2 }}
    >
      <Alert
        onClose={onClose}
        severity={type === "success" ? "success" : "error"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
