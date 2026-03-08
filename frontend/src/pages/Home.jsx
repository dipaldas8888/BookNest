import React from "react";
import Hero from "../components/Hero";
import Category from "../components/Categories";
import Trending from "../components/Trending";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <Category />
      <Trending />
      <Footer />
    </>
  );
}

export default Home;
