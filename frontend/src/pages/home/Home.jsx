import Navbar from "../../components/Navbar/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-20">
        <h1 className="text-center text-4xl font-bold bg-black h-screen relative text-white">
          Home Page
        </h1>
      </main>
    </>
  );
}

export default Home;