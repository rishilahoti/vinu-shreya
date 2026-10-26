// Every visible string and value on the invite lives here. Swap the dummy values for the real ones.
// Photos of the couple: drop real files in /public/photos and use paths like "/photos/groom.jpg".
// Found pictures (paintings, the palace, the clip) live in /public/art/*, each folder with a credits.json the footer reads.
// Lines marked SAMPLE are written from the bios and must be confirmed by the couple (list in .taste-skill/copy.md).

export type Photo = { src: string; alt: string };
/** A found picture: its pixel size and where its subject sits (CSS object-position). */
export type Art = Photo & { width: number; height: number; focal: string };

export type WeddingEvent = {
  id: string;
  name: string;
  /** Name as set on the card, with an authored line break. */
  lines: [string] | [string, string];
  hindi: string;
  day: 1 | 2;
  date: string; // display date
  time: string;
  place: string;
  about: string;
  wear: string;
  painting: Art;
};

const NUMBER = "919876543210"; // WhatsApp, country code, no +
const NUMBER_DISPLAY = "+91 98765 43210";

export const wedding = {
  invocation: "॥ श्री गणेशाय नमः ॥",
  city: "Jaipur",
  dateLabel: "2 & 3 February 2027",
  // First ceremony, IST. The countdown runs to this moment.
  startsAt: "2027-02-02T10:00:00+05:30",

  groom: {
    name: "Vinu",
    fullName: "Vinayak Agarwal",
    relation: "Son of",
    parents: "Mr. Rakesh & Mrs. Kavita Agarwal",
    bio: "Architect, chai loyalist and the family's designated DJ. Has never once been on time, except for the first date.",
    photo: {
      src: "https://images.unsplash.com/photo-1759906766080-82b785c61f51?w=1200&q=80&auto=format&fit=crop",
      alt: "Vinu in an ivory sherwani and safa",
    } satisfies Photo,
  },
  bride: {
    name: "Shreya",
    fullName: "Shreya Maheshwari",
    relation: "Daughter of",
    parents: "Mr. Suresh & Mrs. Meena Maheshwari",
    bio: "Paediatrician, kathak dancer since age six and the calm one in every room. Plans every trip down to the snack list.",
    photo: {
      src: "https://images.unsplash.com/photo-1721324807083-e9ddaa99310e?w=1200&q=80&auto=format&fit=crop",
      alt: "Shreya in a rose pink bridal lehenga and veil",
    } satisfies Photo,
  },

  blessing: "With the blessings of our elders, the families invite you to celebrate the wedding of",

  hero: {
    lines: ["Vinu &", "Shreya"],
    sentence: "We’re getting married at Rambagh Palace, Jaipur, on 2 & 3 February 2027, and we’d love you there.",
    button: "Reply on WhatsApp",
    links: [
      { label: "Ceremonies", href: "#ceremonies" },
      { label: "Our letter", href: "#letter" },
      { label: "Getting there", href: "#getting-there" },
    ],
    // Crossfade in the card's right half: four views of the palace, same photographer, same evening light.
    palace: [
      { src: "/art/palace/rambagh-facade-evening.jpg", width: 2700, height: 1720, focal: "60% 45%", alt: "Ivory Rambagh Palace wing in soft evening light: a domed chhatri with a red railing above a row of cusped arches, dining tables set out on the lawn" },
      { src: "/art/palace/rambagh-courtyard.jpg", width: 2700, height: 1800, focal: "50% 55%", alt: "Rambagh Palace's inner courtyard seen from above: a fountain and a water channel run between clipped hedges, framed by two-storey ivory arcades" },
      { src: "/art/palace/rambagh-arcade-lawn.jpg", width: 2700, height: 1862, focal: "33% 50%", alt: "A long verandah of cusped arches on Rambagh Palace's lawn side at dusk, an arched balcony above and pigeons along the parapet" },
      { src: "/art/palace/rambagh-chhatris-gulmohar.jpg", width: 2700, height: 1814, focal: "60% 45%", alt: "Stacked chhatris and red balconies of Rambagh Palace beside a flame tree in orange flower, with carved sandstone lanterns along the drive" },
    ] satisfies Art[],
  },

  intro: {
    heading: ["The Agarwals &", "the Maheshwaris"],
    and: "and",
    facts: [
      { fact: "2 & 3 Feb 2027", note: "Tuesday and Wednesday" },
      { fact: "Rambagh Palace", note: "Bhawani Singh Road, Jaipur" },
      { fact: "6 ceremonies", note: "Haldi on the 2nd to pheras on the 3rd" },
      { fact: "24°C by day", note: "About 9°C after dark: bring a shawl" },
    ],
    painting: {
      src: "/art/paintings/rama-sita-marriage-shangri.jpg",
      width: 2000,
      height: 1364,
      focal: "50% 40%",
      alt: "Pahari miniature of Rama and Sita's wedding: the couple under a mandap of plantain poles round the sacred fire, crowned guests on both sides, drummers playing below, all on a marigold-yellow ground",
    } satisfies Art,
    caption: "The marriage of Rama and Sita, from the Shangri Ramayana, early 18th century",
  },

  ceremonies: {
    heading: ["Six ceremonies", "over two days"],
    link: "Count me in",
    after: "All six are inside Rambagh Palace, so once you’re here, you’re here.",
    afterLink: "Tell us which you’ll come to",
    wearLabel: "What to wear",
  },

  events: [
    {
      id: "haldi",
      name: "Ganesh Puja & Haldi",
      lines: ["Ganesh Puja", "& Haldi"],
      hindi: "हल्दी",
      day: 1,
      date: "Tue, 2 Feb",
      time: "10:00 AM",
      place: "Zenana Courtyard",
      about: "We start where every Marwari wedding starts, with a prayer to Ganesh. Then both families cover the two of us in turmeric paste, for luck and for the glow.",
      wear: "Wear yellow. Expect to leave a little more yellow.",
      painting: { src: "/art/paintings/haldi-princess-attendants.jpg", width: 2000, height: 1560, focal: "62% 50%", alt: "Indian miniature of a princess seated in a white marble pavilion while women bring her bowls and trays, a palace courtyard and an open door beside it" },
    },
    {
      id: "mehendi",
      name: "Mehendi",
      lines: ["Mehendi"],
      hindi: "मेहंदी",
      day: 1,
      date: "Tue, 2 Feb",
      time: "3:00 PM",
      place: "Mughal Garden Pavilion",
      about: "Henna, folk music and plenty of shade, while the artists work through every hand held out to them. Vinu’s name is hidden somewhere in Shreya’s mehendi, and he has until the pheras to find it.", // SAMPLE
      wear: "Greens and pinks welcome. Short sleeves make the henna easier.",
      painting: { src: "/art/paintings/mehendi-zenana-garden.jpg", width: 2000, height: 1485, focal: "50% 50%", alt: "Miniature of women gathered in a walled Mughal garden: white pavilions with striped awnings, pink paths, flower beds and long pools, a group seated on a platform in the water" },
    },
    {
      id: "sangeet",
      name: "Sangeet",
      lines: ["Sangeet"],
      hindi: "संगीत",
      day: 1,
      date: "Tue, 2 Feb",
      time: "7:30 PM",
      place: "Durbar Hall",
      about: "Both families have been rehearsing, and neither will say for how long. Vinu has been asked, nicely, not to DJ his own sangeet.", // SAMPLE
      wear: "Your brightest. Comfortable shoes recommended.",
      painting: { src: "/art/paintings/sangeet-abhai-singh-dance.jpg", width: 2000, height: 2519, focal: "40% 55%", alt: "Jodhpur miniature of women dancing and playing veenas and drums in a white palace courtyard at night, a seated prince watching, torches and a fountain in the foreground" },
    },
    {
      id: "baraat",
      name: "Baraat",
      lines: ["Baraat"],
      hindi: "बारात",
      day: 2,
      date: "Wed, 3 Feb",
      time: "5:00 PM",
      place: "Palace Gates",
      about: "The groom arrives on a mare. Dhol, safas and dancing all the way in, and for once Vinu has to be on time, because the mare will not wait.",
      wear: "Something festive you can dance in. Bring a safa if you have one.",
      painting: { src: "/art/paintings/baraat-rama-procession-mewar.jpg", width: 1760, height: 1154, focal: "60% 45%", alt: "Mewar painting of a groom's procession leaving a palace gate: riders on white and bay horses, chariots, elephants and musicians, women watching from a balcony" },
    },
    {
      id: "varmala",
      name: "Varmala",
      lines: ["Varmala"],
      hindi: "वरमाला",
      day: 2,
      date: "Wed, 3 Feb",
      time: "7:30 PM",
      place: "Lotus Lawn",
      about: "The exchange of garlands. Each side lifts its own as high as it can to make the other reach, so cheer loudly for your side.",
      wear: "Evening finery and a warm layer. The lawn is open to the sky, and it drops to about 9°C after dark.",
      painting: { src: "/art/paintings/varmala-krishna-rukmini-chariot-bundi.jpg", width: 2000, height: 2491, focal: "62% 52%", alt: "Bundi miniature of a garlanded bride and groom side by side in a lotus chariot drawn by two white horses, Ganesha at the front, an attendant holding a garland, on a deep peacock-blue ground" },
    },
    {
      id: "pheras",
      name: "Pheras",
      lines: ["Pheras"],
      hindi: "फेरे",
      day: 2,
      date: "Wed, 3 Feb",
      time: "9:30 PM",
      place: "The Mandap",
      about: "Seven vows around the sacred fire, the reason for all of it. Dinner under the stars follows.",
      wear: "Your finest, and a shawl. It is the latest hour of the two days and the coldest.",
      painting: { src: "/art/paintings/pheras-krishna-rukmini-bikaner.jpg", width: 2000, height: 1610, focal: "53% 58%", alt: "Bikaner miniature of a bride and groom seated by the sacred fire under a red mandap hung with mango leaves and marigolds, a priest tending the fire, women bringing offerings and water pots around them" },
    },
  ] satisfies WeddingEvent[],

  // SAMPLE: written from the bios in both voices; the couple should read it aloud and change anything that isn't them.
  letter: {
    heading: ["From the", "two of us"],
    paragraphs: [
      "We’re getting married at Rambagh Palace on 2 and 3 February, and it won’t feel like our wedding unless you’re there. Both our families in one palace for two whole days: we’d like you right in the middle of it.",
      "Vinu here. I design buildings for a living, run on chai, and have been the family’s designated DJ for longer than anyone asked me to be. I have never once been on time, except for our first date. I plan to make it twice: I’ll be at the Palace Gates at 5:00 PM on the 3rd, on a mare.",
      "Shreya here. I’m the calm one, and the one who planned these two days the way I plan every trip: down to the snack list. Which means you don’t have to plan a thing. Bring a shawl for the evenings and save your feet for the sangeet. I’ve danced kathak since I was six, and I am not sitting down.",
      "If you’ve never seen Jaipur in February, it’s the city at its best: warm afternoons, cold clear nights, pink walls glowing at sunset, and peacocks wandering the Rambagh lawns as if they were invited too.",
      "Please reply by 10 January 2027 and tell us which ceremonies you’ll come to, so there’s a seat and a plate waiting for you at each one. Then all that’s left is to see you there.",
    ],
    signoff: "Vinu & Shreya",
    signoffNote: "Vinayak Agarwal and Shreya Maheshwari",
    strip: `Questions before February? WhatsApp us on ${NUMBER_DISPLAY}`,
    stripLink: "Message us on WhatsApp",
  },

  venue: {
    name: "Rambagh Palace",
    address: "Bhawani Singh Road, Rambagh, Jaipur, Rajasthan 302005",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rambagh+Palace+Jaipur",
    heading: "Getting there",
    lead: "Every ceremony is inside Rambagh Palace, so you only need to find it once.",
    mapsLink: "Open in Google Maps",
    arrive: [
      { from: "From the airport", how: "Jaipur International Airport is about 12 km away, around 25 minutes by taxi or app cab." }, // SAMPLE
      { from: "From the railway station", how: "Jaipur Junction is about 6 km away, around 15 minutes by taxi or auto." }, // SAMPLE
    ],
    driver: "Tell your driver “Rambagh Palace, Bhawani Singh Road”. Every driver in Jaipur knows it.",
    questions: [
      { q: "What should I wear?", a: "Indian festive wear, in the colour of the day if you like: yellow for the haldi, greens and pinks for the mehendi, your brightest for the sangeet. Each ceremony has its own note above, and the reply coupon lists yours once you tick them." },
      { q: "What will the weather be like?", a: "Lovely by day, about 24°C, and cold after dark, about 9°C. Three of the six ceremonies start after sunset, so bring a shawl or a jacket for the evenings." },
      { q: "Where should we stay?", a: "Rambagh Palace itself, if you can get a room. There are plenty of hotels within a 10-minute drive, around C-Scheme and MI Road. Message us and we’ll help you find one." }, // SAMPLE
      { q: "Is there parking?", a: "Yes, valet parking at the palace entrance on both days. On the 3rd, arrive before 5:00 PM: the baraat fills the Palace Gates." }, // SAMPLE
      { q: "Can we bring the children?", a: "Please do. The bride is a paediatrician and has never once complained about too many children in a room." }, // SAMPLE
      { q: "Is there a hashtag?", a: "#VinuWedsShreya. Put it on every photo and we’ll find them all after the pheras." }, // SAMPLE
    ],
    tall: { src: "/art/palace/rambagh-entrance.jpg", width: 2000, height: 1500, focal: "40% 45%", alt: "The main entrance front of Rambagh Palace under a clear blue sky: a tall central pavilion with domed chhatris, red balconies and sandstone lanterns along the driveway" } satisfies Art,
    square: { src: "/art/palace/peacock-gate-city-palace.jpg", width: 2000, height: 1431, focal: "50% 50%", alt: "Close detail of the Peacock Gate in Jaipur's City Palace: three sculpted peacocks with spread tails under a cusped arch, above a painted lotus and a small carved shrine" } satisfies Art,
    squareCaption: "The Peacock Gate, City Palace, Jaipur",
  },

  rsvp: {
    whatsapp: NUMBER,
    whatsappDisplay: NUMBER_DISPLAY,
    deadline: "10 January 2027",
    heading: ["Reply by", "10 January"],
    sentence: "Tick the ceremonies you’ll come to, and we’ll write the WhatsApp message for you to send.",
    labels: {
      name: "Your name",
      namePlaceholder: "Full name",
      attend: "Will you be there?",
      guests: "Guests, including you",
      fewer: "One guest fewer",
      more: "One guest more",
      ceremonies: "Which ceremonies?",
      all: "All six",
      note: "A note for us (optional)",
      notePlaceholder: "Food allergies, a song for the sangeet, anything at all",
    },
    attend: { yes: "Joyfully attending", no: "Regretfully declining" },
    guestsValue: (n: number) => (n === 1 ? "Just you" : `${n} of you`),
    errors: { name: "Please tell us your name.", ceremonies: "Please tick at least one ceremony." },
    programme: {
      heading: "Where you’ll be",
      empty: "Tick a ceremony and your own programme appears here.",
      declining: "We’ll miss you. Your message will tell us so, kindly.",
    },
    submit: "Reply on WhatsApp",
    submitNote: "This opens WhatsApp with your reply already written. Just press send.",
    sent: `Thank you! Your reply is ready in WhatsApp. If it didn’t open, message us on ${NUMBER_DISPLAY}.`,
    change: "Change my reply",
    // Without script the coupon falls back to this prefilled link.
    fallbackText: "Namaste Vinu & Shreya! Replying to your wedding invitation for 2 & 3 February 2027.",
  },

  countdown: {
    paragraph: "The first ceremony begins at 10:00 AM on Tuesday 2 February, in the Zenana Courtyard. Ganesh will be on time. Vinu is working on it.",
    heading: "Mark the dates",
    line: "2 & 3 February 2027 at Rambagh Palace, Jaipur.",
    units: [
      ["day", "days"],
      ["hour", "hours"],
      ["minute", "minutes"],
      ["second", "seconds"],
    ] as const,
    begun: "The celebrations have begun.",
    button: "Add to calendar",
    calendar: {
      title: "Vinu & Shreya’s wedding",
      description:
        "Tue 2 Feb: Ganesh Puja & Haldi 10:00 AM, Zenana Courtyard. Mehendi 3:00 PM, Mughal Garden Pavilion. Sangeet 7:30 PM, Durbar Hall. Wed 3 Feb: Baraat 5:00 PM, Palace Gates. Varmala 7:30 PM, Lotus Lawn. Pheras 9:30 PM, The Mandap. Please reply by 10 January 2027.",
    },
  },

  footer: {
    heading: ["See you", "in Jaipur"],
    message: "Both our homes are already full of lists, fittings and rehearsals. The only thing missing is you.", // SAMPLE
    blessing: "With love and blessings,",
    families: "Mr. Rakesh & Mrs. Kavita Agarwal and Mr. Suresh & Mrs. Meena Maheshwari",
    hashtag: "#VinuWedsShreya", // SAMPLE
    imprint: "A kankotri from the Agarwal and Maheshwari families, Jaipur, February 2027",
    creditsIntro: "The paintings and the pictures of Rambagh Palace and Jaipur come from open collections. With thanks to:",
    stamp: { src: "/art/palace/hawa-mahal-facade.jpg", width: 1600, height: 1213, focal: "50% 45%", alt: "The pink honeycomb facade of the Hawa Mahal in Jaipur, rows of latticed jharokha windows rising to a pointed crown against a pale sky" } satisfies Art,
  },

  // A real clip of the peacocks the Rambagh lawns are known for (found footage, not Rambagh itself).
  clip: {
    src: "/art/video/peacock-garden.webm",
    poster: "/art/video/peacock-garden-poster.jpg",
    width: 854,
    height: 480,
    alt: "A peacock with its tail fully fanned turns slowly on a red-earth garden path between palms and low green plants.",
  },

  moments: [
    { src: "https://images.unsplash.com/photo-1744804298431-57953e4eaba0?w=1200&q=80&auto=format&fit=crop", alt: "Vinu and Shreya cheering under a flower arch after the varmala" },
    { src: "https://images.unsplash.com/photo-1730003873829-09b4b16444c1?w=1200&q=80&auto=format&fit=crop", alt: "Shreya's hands covered in bridal mehendi" },
    { src: "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=1200&q=80&auto=format&fit=crop", alt: "Vinu and Shreya under a canopy of fairy lights" },
    { src: "https://images.unsplash.com/photo-1756190564669-215843660e93?w=1200&q=80&auto=format&fit=crop", alt: "Vinu and Shreya walking hand in hand through a palace courtyard" },
  ] satisfies Photo[],
};
