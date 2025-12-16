import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
} from "@mui/material";
import apiClient from "../lib/apiClient";
import { storeLoginData, isLoggedIn, getRole } from "../lib/storage";
import { getDefaultRouteForRole } from "../lib/roles";

export default function LoginPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to main
    if (isLoggedIn()) {
      const role = getRole();
      navigate(getDefaultRouteForRole(role), { replace: true });
      return;
    }

    // Initialize Google Sign-In
    const initGoogleSignIn = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id:
              "353225171076-suabl56ds39iface2gu3bo0kdqiga9l7.apps.googleusercontent.com",
            callback: handleCredentialResponse,
            auto_select: false,
          });

          const buttonContainer = document.getElementById("google-signin-btn");
          if (buttonContainer) {
            window.google.accounts.id.renderButton(buttonContainer, {
              type: "standard",
              theme: "outline",
              size: "large",
            });
          }
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
          setError(
            "Failed to initialize Google Sign-In. Please refresh the page."
          );
        }
      }
    };

    // Wait for Google script to load
    if (window.google?.accounts?.id) {
      initGoogleSignIn();
    } else {
      const checkGoogleLoaded = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkGoogleLoaded);
          initGoogleSignIn();
        }
      }, 100);

      return () => clearInterval(checkGoogleLoaded);
    }
  }, [navigate]);

  const formatNameFromEmail = (email) => {
    return email
      .split("@")[0]
      .replace(/\./g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleCredentialResponse = async (response) => {
    try {
      const { data } = await apiClient.post("/api/auth/verify", {
        credential: response.credential,
      });

      if (!data.success) {
        if (data.error.includes("multiple branches")) {
          setError(
            "This account is assigned to multiple branches. Only one branch can be assigned. Please contact your administrator."
          );
        } else {
          setError(data.error);
        }
        return;
      }

      // Store all session data
      storeLoginData(data);

      // Show welcome message
      const name = formatNameFromEmail(data.email);
      setDisplayName(name);
      setShowWelcome(true);

      // Redirect after a short delay
      setTimeout(() => {
        const defaultRoute = getDefaultRouteForRole(data.role);
        navigate(defaultRoute, { replace: true });
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  const closeModal = () => {
    setError("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f3f4f6",
      }}
    >
      <Fade in timeout={400}>
        <Card
          sx={{
            width: 420,
            maxWidth: "90%",
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Box sx={{ mb: 3 }}>
              <img
                src="https://raw.githubusercontent.com/rodelpeligro-oss/image-hosting/main/nav3%20(1).png"
                alt="Logo"
                style={{ width: 260, height: "auto" }}
              />
            </Box>

            {!showWelcome ? (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Sign in with your Asaphil Google Workspace Account
                </Typography>
                <Box
                  id="google-signin-btn"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Welcome!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {displayName}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>

      {/* Error Dialog */}
      <Dialog
        open={!!error}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ color: "error.main", fontWeight: 700 }}>
          ⚠️ Login Error
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{ __html: error }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} variant="contained" color="error">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
