import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedDoctors
from "../components/FeaturedDoctors";
import Services
from "../components/Services";
import WhyChooseUs
from "../components/WhyChooseUs";
import Footer
from "../components/Footer";

function Home() {

  return (

    <>
      <Navbar />
      <Hero />
      <FeaturedDoctors />
      <Services />
      <WhyChooseUs />
      <Footer/>
    </>
  );
}

export default Home;