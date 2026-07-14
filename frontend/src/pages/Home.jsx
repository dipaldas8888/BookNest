import React from "react";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import Trending from "../components/Trending";
import PromoBanner from "../components/PromoBanner";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";

function Home() {
  return (
    <div className="animate-fadeIn">
      {/* 1. Big hero banner with search */}
      <Hero />

      {/* 2. Stats strip */}
      <StatsBar />

      {/* 3. Bestsellers / Trending */}
      <Trending />

      {/* 4. Sale + promo banners */}
      <PromoBanner />

      {/* 5. Why choose us features */}
      <Features />

      {/* 6. Reader testimonials */}
      <Testimonials />
    </div>
  );
}

export default Home;
