import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import EventCard from "../components/EventCard";
import SearchSection from "../components/SearchSection";
import { theme } from "../components/theme";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useAuth } from "../context/AuthProvider";
import { data } from "../data/data";

export default function Home() {
  const { city } = useContext(GlobalContext);
  const { access } = useAuth();
  const [events, setEvents] = useState([]);
  const [image, setImage] = useState(null);

  const getEvents = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/filter-by-city/?city_id=${
          city ? data[city].id : 2
        }`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsData = await getEvents();
      setEvents(eventsData);
    };
    fetchEvents();
  }, [access, city, data]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ mt: 2, ml: 5 }}>
        <SearchSection />
        <div>
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={event.date}
                description={event.description}
                image={event.image}
                location={event.location}
                pvotes={event.pos_votes}
                nvotes={event.neg_votes}
              />
            ))
          ) : (
            <p>No events found for the selected city.</p>
          )}
        </div>
      </Container>
    </ThemeProvider>
  );
}
