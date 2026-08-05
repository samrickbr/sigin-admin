import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../auth/store/authStore";

export function Header() {
  const navigate = useNavigate();

  const usuario = useAuthStore(
    (state) => state.usuario
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth
  );

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
      }}
    >
      <Typography variant="h6">
        SIGIN Administrativo
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography>
          {usuario?.nome}
          {" "}
          ({usuario?.perfil})
        </Typography>

        <Button
          variant="outlined"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
}