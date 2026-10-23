import Hero from "@/components/sections/Hero";
import Couple from "@/components/sections/Couple";
import Timeline from "@/components/sections/Timeline";
import Meet from "@/components/sections/Meet";
import Venue from "@/components/sections/Venue";
import Countdown from "@/components/sections/Countdown";

export default function Home() {
  return (
    <main className="w-full overflow-x-clip">
      <Hero />
      <Couple />
      <Timeline />
      <Meet />
      <Venue />
      <Countdown />
    </main>
  );
}
