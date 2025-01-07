import { Paper, InputBase, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const SearchSection = ({ onSearch }) => {
  return (
    <Box sx={{ p: 2, display: "flex", gap: 2 }}>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <SearchIcon sx={{ p: 1, color: "action.active" }} fontSize="large" />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search events..."
          inputProps={{ "aria-label": "search events" }}
        />
      </Paper>
      <Button startIcon={<FilterListIcon />} variant="outlined" color="inherit">
        Filters
      </Button>
    </Box>
  );
};

export default SearchSection;
