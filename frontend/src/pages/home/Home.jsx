import Hero from "../../components/hero/Hero";
import Navbar from "../../components/Navbar/Navbar";

import HomeSection from "./HomeSection";

function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-zinc-950">
        <Hero />
        <HomeSection />
      </main>
    </>
  );
}
export default Home;
