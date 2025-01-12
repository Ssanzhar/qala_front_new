import { useState } from "react";
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

const userAccount = {
  name: "John Doe",
  email: "john.doe@example.com",
  profilePic: "https://randomuser.me/api/portraits/men/46.jpg",
};

const events = [
  { id: 1, name: "Event 1", type: "upvoted" },
  { id: 2, name: "Event 2", type: "downvoted" },
  { id: 3, name: "Event 3", type: "upvoted" },
];

const AccountDashboard = () => {
  const [user, setUser] = useState(userAccount);
  const [eventsData, setEventsData] = useState(events);

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
                      event.type === "upvoted"
                        ? "You Upvoted this event"
                        : "You Downvoted this event"
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
