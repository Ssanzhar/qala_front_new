import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "../context/AuthProvider";

const EventCard = ({
  title,
  date,
  description,
  image,
  location,
  id,
  pvotes,
  nvotes,
}) => {
  const [vote, setVote] = useState(null);
  const [upvotes, setUpvotes] = useState(pvotes);
  const [downvotes, setDownvotes] = useState(nvotes);
  const { access } = useAuth();

  const sendVoteToBackend = async (voteType, eventId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/votes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          event: eventId,
          vote_type: voteType,
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
      // Remove upvote
      setVote(null);
      setUpvotes((prev) => prev - 1);
      sendVoteToBackend("neutral", id);
    } else {
      // Add upvote and remove downvote if previously selected
      setVote("upvote");
      setUpvotes((prev) => prev + 1);
      if (vote === "downvote") {
        setDownvotes((prev) => prev - 1);
      }
      sendVoteToBackend("positive", id);
    }
  };

  const handleDownvote = () => {
    if (vote === "downvote") {
      // Remove downvote
      setVote(null);
      setDownvotes((prev) => prev - 1);
      sendVoteToBackend("neutral", id);
    } else {
      // Add downvote and remove upvote if previously selected
      setVote("downvote");
      setDownvotes((prev) => prev + 1);
      if (vote === "upvote") {
        setUpvotes((prev) => prev - 1);
      }
      sendVoteToBackend("negative", id);
    }
  };

  return (
    <Card sx={{ display: "flex", mb: 2, maxWidth: 800, position: "relative" }}>
      <CardMedia
        component="img"
        sx={{ width: 140 }}
        image={image || "/placeholder.jpg"}
        alt={title}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <LocationOnIcon sx={{ mr: 0.5 }} />
              {location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {date}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.5,
            }}
          >
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
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.5,
            }}
          >
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
        </Box>
      </Box>
    </Card>
  );
};

export default EventCard;
