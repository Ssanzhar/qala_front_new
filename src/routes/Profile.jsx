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
  const { access } = useAuth();

  const getUser = async () => {
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
      const data = await getUser();
      setEventsData(data);
    };

    fetchEvents();
  }, [access]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ marginTop: 20 }}>
        <Card style={{ marginBottom: 20 }}>
          <CardContent style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={user.name}
              src={user.profilePic}
              style={{ width: 80, height: 80, marginRight: 16 }}
            />
            <div>
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </div>
          </CardContent>
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <CardContent>
            <Typography variant="h6">Events You Voted On</Typography>
            <List>
              {eventsData.map((event) => (
                <ListItem key={event.id}>
                  <ListItemText
                    primary={event.name}
                    secondary={
                      <>
                        <Typography variant="body2">
                          {event.type === "upvoted"
                            ? "You Upvoted this event"
                            : "You Downvoted this event"}
                        </Typography>
                        <Typography variant="body2">
                          Location: {event.location}, {event.city}
                        </Typography>
                        <Typography variant="body2">
                          Upvotes: {event.upvotes} | Downvotes:{" "}
                          {event.downvotes}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Log out")}
        >
          Log Out
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default AccountDashboard;
