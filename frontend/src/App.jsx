import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import MovieDetails from "./pages/movieDetails/MovieDetails";
import Search from "./pages/search/Search";
import AIRecommendation from "./pages/AIRecommendation/AIRecommendation";
import NotFound from "./pages/notFound/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/search" element={<Search />} />
      <Route path="/ai" element={<AIRecommendation />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
