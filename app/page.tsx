import Shell from "@/components/invite/Shell";
import Hero from "@/components/invite/Hero";
import Moments from "@/components/invite/Moments";
import Programme from "@/components/invite/Programme";
import DressCode from "@/components/invite/DressCode";
import Venue from "@/components/invite/Venue";
import Timeline from "@/components/invite/Timeline";
import Footer from "@/components/invite/Footer";

export default function Home() {
  return (
    <Shell>
      <Hero />
      <Moments />
      <Programme />
      <DressCode />
      <Venue />
      <Timeline />
      <Footer />
    </Shell>
  );
}
