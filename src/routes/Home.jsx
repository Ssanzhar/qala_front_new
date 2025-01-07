import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import EventCard from "../components/EventCard";
import SearchSection from "../components/SearchSection";
import suslik from "../images_test/suslik.jpg";
import chess from "../images_test/chess.jpg";
import { theme } from "../components/theme";

const mockEvents = [
  {
    id: 1,
    title: "Medical Conference 2024",
    date: "2024-02-01",
    description:
      "Annual medical conference discussing latest developments in diagnostics",
    image: suslik,
    location: "Butina st 19/11 ",
  },
  {
    id: 2,
    title: "Healthcare Innovation Summit",
    date: "2024-02-15",
    description: "Summit focused on innovative approaches in medical imaging",
    image: chess,
    location: "Temirazyeva / Rozybakieva st",
  },
];

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ mt: 2 }}>
        <SearchSection />
        <div>
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              description={event.description}
              image={event.image}
              location={event.location}
            />
          ))}
        </div>
      </Container>
    </ThemeProvider>
  );
}
