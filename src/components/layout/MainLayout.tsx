import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  return (
    <Box>
      <Header />

      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: 240,
          }}
        >
          <Sidebar />
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}