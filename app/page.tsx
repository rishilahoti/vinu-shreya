import Hero from "@/components/sections/Hero";
import Couple from "@/components/sections/Couple";
import Timeline from "@/components/sections/Timeline";
import Meet from "@/components/sections/Meet";
import Venue from "@/components/sections/Venue";
import VenueRsvp from "@/components/sections/VenueRsvp";
import Countdown from "@/components/sections/Countdown";
import Footer from "@/components/sections/Footer";

// The kankotri, leaf by leaf: the card, the blessing, the ceremonies, a note from us, getting there, the reply coupon, the dates, the back of the card.
export default function Home() {
  return (
    <main className="w-full overflow-x-clip">
      <Hero />
      <Couple />
      <Timeline />
      <Meet />
      <Venue />
      <VenueRsvp />
      <Countdown />
      <Footer />
    </main>
  );
}
