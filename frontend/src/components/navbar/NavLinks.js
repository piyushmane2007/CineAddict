import {
  House,
  Flame,
  Film,
  Tags,
  Sparkles,
} from "lucide-react";

const navLinks = [
  {
    title: "Home",
    path: "/",
    icon: House,
  },
  {
    title: "Trending",
    path: "/trending",
    icon: Flame,
  },
  {
    title: "Movies",
    path: "/movies",
    icon: Film,
  },
  {
    title: "Genres",
    path: "/genres",
    icon: Tags,
  },
  {
    title: "AI",
    path: "/ai",
    icon: Sparkles,
  },
];

export default navLinks;