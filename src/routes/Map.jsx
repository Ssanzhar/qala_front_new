import {
  Box,
  CssBaseline,
  ThemeProvider,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { theme } from "../components/theme";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { GlobalContext } from "../context/GlobalContext";
import { data } from "../data/data";

const MapUpdater = ({ marker }) => {
  const map = useMap();

  useEffect(() => {
    if (marker) {
      map.setView(marker, 13);
    }
  }, [marker, map]);

  return null;
};

const MapWithForm = () => {
  const { city } = useContext(GlobalContext);
  const [formOpen, setFormOpen] = useState(false);
  const [vote, setVote] = useState(null);
  const [upvotes, setUpvotes] = useState(432);
  const [downvotes, setDownvotes] = useState(123);
  const [formData, setFormData] = useState({
    lat: null,
    lng: null,
    title: "",
    description: "",
    image: null,
  });
  const [markers, setMarkers] = useState([]);
  const marker = city
    ? [data[city]["latitude"], data[city]["longitude"]]
    : [43.222, 76.851];

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setFormData({ ...formData, lat: e.latlng.lat, lng: e.latlng.lng }); // Store click coordinates
        setFormOpen(true);
      },
    });
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMarkers((prev) => [...prev, { ...formData, votes: 0 }]);
    console.log(formData);
    console.log(markers);
    setFormOpen(false);
    setFormData({
      lat: null,
      lng: null,
      title: "",
      description: "",
      image: null,
    });
  };

  const sendVoteToBackend = async (voteType) => {
    try {
      const response = await fetch("https://your-backend-url.com/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voteType,
        }),
      });

      if (response.ok) {
        console.log("Vote successfully sent to the backend");
      } else {
        console.error("Failed to send vote to the backend");
      }
    } catch (error) {
      console.error("Error sending vote:", error);
    }
  };

  const handleUpvote = () => {
    if (vote === "upvote") {
      setVote(null);
      setUpvotes((prev) => prev - 1);
      sendVoteToBackend("remove");
    } else {
      setVote("upvote");
      setUpvotes((prev) => prev + 1);
      if (vote === "downvote") setDownvotes((prev) => prev - 1);
      sendVoteToBackend("upvote");
    }
  };

  const handleDownvote = () => {
    if (vote === "downvote") {
      setVote(null);
      setDownvotes((prev) => prev - 1);
      sendVoteToBackend("remove");
    } else {
      setVote("downvote");
      setDownvotes((prev) => prev + 1);
      if (vote === "upvote") setUpvotes((prev) => prev - 1);
      sendVoteToBackend("downvote");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          border: "1px solid gray",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MapContainer
          center={[43.222, 76.851]}
          zoom={13}
          style={{ height: "91.5vh", width: "202vh" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <MapUpdater marker={marker} />
          <MapClickHandler />
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]}>
              <Popup>
                <Typography variant="h6">{marker.title}</Typography>
                <Typography variant="body2">{marker.description}</Typography>
                {marker.image && (
                  <img
                    src={URL.createObjectURL(marker.image)}
                    alt={marker.title}
                    style={{ width: "100px", height: "auto", marginTop: "8px" }}
                  />
                )}
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <IconButton
                    aria-label="like"
                    onClick={handleUpvote}
                    color={vote === "upvote" ? "success" : "default"}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {upvotes}
                  </Typography>
                  <IconButton
                    aria-label="dislike"
                    onClick={handleDownvote}
                    color={vote === "downvote" ? "error" : "default"}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {downvotes}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Add Marker Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button variant="outlined" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default MapWithForm;
