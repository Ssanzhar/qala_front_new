import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { theme } from "../components/theme";
import { useAuth } from "../context/AuthProvider";

const userAccount = {
  name: "John Doe",
  email: "john.doe@example.com",
  profilePic: "https://randomuser.me/api/portraits/men/46.jpg",
};

const AccountDashboard = () => {
  const [user, setUser] = useState(userAccount);
  const [eventsData, setEventsData] = useState([]);
  const { access, logout } = useAuth();

  const getUserEvents = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/user-events/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const result = await response.json();

    return result;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getUserEvents();
      setEventsData(data);
    };

    const fetchUser = async () => {
      const data = await getUser();
      setUser(data);
    };

    fetchEvents();
    fetchUser();
  }, [access]);

  const getUser = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/user/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const result = await response.json();

    return result;
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/events/${eventId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.ok) {
        setEventsData((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        console.log("Event deleted successfully");
      } else {
        console.error("Failed to delete the event");
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ marginTop: 20 }}>
        <Card style={{ marginBottom: 20 }}>
          <CardContent style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={user.username}
              style={{ width: 80, height: 80, marginRight: 16 }}
            />
            <div>
              <Typography variant="h5">{user.username}</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </div>
          </CardContent>
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <CardContent>
            <Typography variant="h6">Events You Created</Typography>
            <List>
              {eventsData.map((event) => (
                <ListItem key={event.id}>
                  <ListItemText
                    primary={`Title: ${event.name}`}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Location: {event.location}, {event.city}
                        </Typography>
                        <Typography variant="body2">
                          Upvotes: {event.pos_votes} | Downvotes:{" "}
                          {event.neg_votes}
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Button variant="contained" color="primary" onClick={logout}>
          Log Out
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default AccountDashboard;
