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

const EventCard = ({ title, date, description, image, location, eventId }) => {
  const [vote, setVote] = useState(null);
  const [upvotes, setUpvotes] = useState(432);
  const [downvotes, setDownvotes] = useState(123);

  const sendVoteToBackend = async (voteType) => {
    try {
      const response = await fetch("https://your-backend-url.com/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
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
