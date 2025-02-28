import HomeHero from "../Components/HomeHero";
import Header from "../Components/Header";

const Home = () => {
  return (
    <>
      <Header actionButtonView={true} />
      <HomeHero />
    </>
  );
};

export default Home;
