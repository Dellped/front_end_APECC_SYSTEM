import { Box, Button, Typography } from "@mui/material";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        mt: 2,
        mb: 2,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        size="small"
      >
        Prev
      </Button>
      <Typography variant="body2" fontWeight="bold">
        Page {currentPage} / {totalPages}
      </Typography>
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        size="small"
      >
        Next
      </Button>
    </Box>
  );
}
