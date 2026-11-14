// Every visible string and value on the invite lives here. Swap the dummy values for the real ones.
// Photos of the couple: drop real files in /public/photos and use paths like "/photos/groom.jpg".
// Found pictures (paintings, the palace, the clip) live in /public/art/*, each folder keeps a credits.json (not shown on the page).
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

const NUMBER = "917354513427"; // WhatsApp, country code, no +
const NUMBER_DISPLAY = "+91 73545 13427";

export const wedding = {
  invocation: "॥ श्री गणेशाय नमः ॥",
  city: "Indore",
  dateLabel: "1 & 2 February 2027",
  // First ceremony, IST. The countdown runs to this moment.
  startsAt: "2027-02-01T10:00:00+05:30",

  groom: {
    name: "Vinamra",
    fullName: "Vinamra Rathi",
    relation: "Son of",
    parents: "Mr. Nilesh & Mrs. Krishna Rathi",
    bio: "Engineer, chai loyalist and the family's elder child and the calm one in every room. Has never once been on time, except for the first date.",
    photo: {
      src: "https://images.unsplash.com/photo-1759906766080-82b785c61f51?w=1200&q=80&auto=format&fit=crop",
      alt: "Vinamra in an ivory sherwani and safa",
    } satisfies Photo,
  },
  bride: {
    name: "Shreya",
    fullName: "Shreya Ladha",
    relation: "Daughter of",
    parents: "Mr. Madhav & Mrs. Meena Ladha",
    bio: "CA, Dancer since age six and the chaotic one in every room.",
    photo: {
      src: "https://images.unsplash.com/photo-1721324807083-e9ddaa99310e?w=1200&q=80&auto=format&fit=crop",
      alt: "Shreya in a rose pink bridal lehenga and veil",
    } satisfies Photo,
  },

  blessing: "With the blessings of our elders, the families invite you to celebrate the wedding of",

  hero: {
    lines: ["Vinamra &", "Shreya"],
    sentence: "We’re getting married at Heaven Space Resort, Janapav Kuti, Mhow, on 1 & 2 February 2027, and we’d love you there.",
    button: "Reply on WhatsApp",
    links: [
      { label: "Ceremonies", href: "#ceremonies" },
      { label: "Our letter", href: "#letter" },
      { label: "Getting there", href: "#getting-there" },
    ],
    // Crossfade in the card's right half: the resort's own grounds (photos supplied by the couple).
    palace: [
      { src: "/photos/resort-pastel-canopy.webp", width: 765, height: 1020, focal: "50% 40%", alt: "Rows of white chairs on the lawn under a canopy of pastel pink, lilac and teal drapes, with a floral mandap at the far end" },
      { src: "/photos/resort-lotus-pond-mandap.webp", width: 1360, height: 1020, focal: "56% 50%", alt: "A round mandap with red pillars and a flower crown, standing on steps in a lotus pond, with a small bridge and a white crane statue in the foreground" },
    ] satisfies Art[],
  },

  intro: {
    heading: ["The Rathi's &", "the Ladha's"],
    and: "and",
    facts: [
      { fact: "1 & 2 Feb 2027", note: "Monday and Tuesday" },
      { fact: "Heaven Space Resort", note: "National Highway 3, Mhow, Janapav Kuti, Indore, Madhya Pradesh" },
      { fact: "7 ceremonies", note: "Raasleela on the 1st to pheras on the 2nd" },
      { fact: "27°C by day", note: "About 13°C after dark: bring a shawl" },
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
    heading: ["Seven ceremonies", "over two days"],
    link: "Count me in",
    after: "All seven are inside Heaven Space Resort, so once you’re here, you’re here.",
    afterLink: "Tell us which you’ll come to",
    wearLabel: "What to wear",
  },

  events: [
    {
      id: "Maayra",
      name: "Ganesh Puja & Maayra",
      lines: ["Ganesh Puja", "& Maayra"],
      hindi: "मायरा",
      day: 1,
      date: "Mon, 1 Feb",
      time: "10:00 AM",
      place: "Zenana Courtyard",
      about: "We start where every Marwari wedding starts, with a prayer to Ganesh Ji. Then comes the Maayra, a ritual where the bride/groom's mother is adorned and blessed by her family.",
      wear: "Be ready to join the Maayra.",
      painting: { src: "/art/paintings/haldi-princess-attendants.jpg", width: 2000, height: 1560, focal: "62% 50%", alt: "Indian miniature of a princess seated in a white marble pavilion while women bring her bowls and trays, a palace courtyard and an open door beside it" },
    },
    {
      id: "Raasleela",
      name: "Raasleela",
      lines: ["Raasleela"],
      hindi: "रासलीला",
      day: 1,
      date: "Mon, 1 Feb",
      time: "2:00 PM",
      place: "Mughal Garden Pavilion",
      about: "A traditional performance celebrating the divine love of Krishna and the gopis, with music, dance, and vibrant costumes.",
      wear: "Traditional attire suitable for a cultural performance.",
      painting: { src: "/art/paintings/mehendi-zenana-garden.jpg", width: 2000, height: 1485, focal: "50% 50%", alt: "Miniature of women gathered in a walled Mughal garden: white pavilions with striped awnings, pink paths, flower beds and long pools, a group seated on a platform in the water" },
    },
    {
      id: "Ring Ceremony",
      name: "Ring Ceremony",
      lines: ["Ring Ceremony"],
      hindi: "अंगूठी समारोह",
      day: 1,
      date: "Tue, 2 Feb",
      time: "7:30 PM",
      place: "Durbar Hall",
      about: "The formal exchange of rings between the bride and groom, symbolizing their commitment to each other.",
      wear: "Formal attire suitable for an evening reception.",
      painting: { src: "/art/paintings/sangeet-abhai-singh-dance.jpg", width: 2000, height: 2519, focal: "40% 55%", alt: "Jodhpur miniature of women dancing and playing veenas and drums in a white palace courtyard at night, a seated prince watching, torches and a fountain in the foreground" },
    },
    {
      id: "Reception",
      name: "Reception",
      lines: ["Reception"],
      hindi: "रिसेप्शन",
      day: 1,
      date: "Tue, 2 Feb",
      time: "8:30 PM",
      place: "Durbar Hall",
      about: "A grand celebration where the newlyweds are formally introduced to the extended family and friends, with music, dancing, and feasting followed by a DJ night.",
      wear: "Formal attire suitable for an evening reception.",
      painting: { src: "/art/paintings/sangeet-abhai-singh-dance.jpg", width: 2000, height: 2519, focal: "40% 55%", alt: "Jodhpur miniature of women dancing and playing veenas and drums in a white palace courtyard at night, a seated prince watching, torches and a fountain in the foreground" },
    },
    {
      id: "baraat",
      name: "Baraat",
      lines: ["Baraat"],
      hindi: "बारात",
      day: 2,
      date: "Tue, 2 Feb",
      time: "10:00 AM",
      place: "Palace Gates",
      about: "The groom arrives on a mare. Dhol, safas and dancing all the way in, and for once Vinamra has to be on time, because the mare will not wait.",
      wear: "Something festive you can dance in. Bring a safa if you have one.",
      painting: { src: "/art/paintings/baraat-rama-procession-mewar.jpg", width: 1760, height: 1154, focal: "60% 45%", alt: "Mewar painting of a groom's procession leaving a palace gate: riders on white and bay horses, chariots, elephants and musicians, women watching from a balcony" },
    },
    {
      id: "varmala",
      name: "Varmala",
      lines: ["Varmala"],
      hindi: "वरमाला",
      day: 2,
      date: "Tue, 2 Feb",
      time: "11:30 AM",
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
      date: "Tue, 2 Feb",
      time: "1:30 PM",
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
      "We’re getting married at Heaven Space Resort on 1 and 2 February, and it won’t feel like our wedding unless you’re there. Both our families in one palace for two whole days: we’d like you right in the middle of it.",
      "Vinamra here. I design websites for a living, run on chai, and have been the family’s designated DJ for longer than anyone asked me to be. I have never once been on time, except for our first date. I plan to make it twice: I’ll be at the Palace Gates at 5:00 PM on the 2nd, on a mare.",
      "Shreya here. I love planning every detail, from the flowers to the food, and I can’t wait to see it all come together with our families and friends around us.",
      "If you’ve never seen Indore in February, it’s the city at its best: warm afternoons, cold clear nights, pink walls glowing at sunset, and peacocks wandering the Rambagh lawns as if they were invited too.",
      "Please reply by 10 January 2027 and tell us which ceremonies you’ll come to, so there’s a seat and a plate waiting for you at each one. Then all that’s left is to see you there.",
    ],
    signoff: "Vinamra & Shreya",
    signoffNote: "Vinamra Rathi and Shreya Ladha",
    strip: `Questions before February? WhatsApp us on ${NUMBER_DISPLAY}`,
    stripLink: "Message us on WhatsApp",
  },

  venue: {
    name: "Heaven Space Resort",
    address: "Gram Yaswant Nagar near Janapav Kuti, A.B. road, NH-3, MHOW, Janapav Kuti, Madhya Pradesh 453661",
    mapsUrl: "https://maps.app.goo.gl/SfCXjZnQ6Eu8b6TQ7",
    heading: "Getting there",
    lead: "Every ceremony is inside Heaven Space Resort, so you only need to find it once.",
    mapsLink: "Open in Google Maps",
    arrive: [
      { from: "From the airport", how: "Devi Ahilya Bai Holkar Airport is about 55 km away, around 1 hour by taxi or app cab." },
      { from: "From the railway station", how: "Indore Junction is about 53 km away, around 1 hour by taxi or auto." },
    ],
    driver: "Tell your driver “Heaven Space Resort, Bhawani Singh Road”. Every driver in Indore knows it.",
    questions: [
      { q: "What should I wear?", a: "Indian festive wear, in the colour of the day if you like: yellow for the haldi, greens and pinks for the mehendi, your brightest for the sangeet. Each ceremony has its own note above, and the reply coupon lists yours once you tick them." },
      { q: "What will the weather be like?", a: "Lovely by day, about 27°C, and cold after dark, about 13°C. Two of the seven ceremonies start after sunset, so bring a shawl or a jacket for the evenings." },
      { q: "Where should we stay?", a: "Heaven Space Resort itself." }, // SAMPLE
      { q: "Is there parking?", a: "Yes, valet parking at the entrance on both days. On the 2nd, arrive before 11:00 AM: the baraat fills the main Gates." },
      { q: "Is there a hashtag?", a: "#VinamraWedsShreya. Put it on every photo and we’ll find them all after the pheras." },
    ],
    tall: { src: "/photos/resort-lotus-pond-mandap.webp", width: 1360, height: 1020, focal: "56% 50%", alt: "A round mandap with red pillars and a flower crown, standing on steps in a lotus pond, with a small bridge and a white crane statue in the foreground" } satisfies Art,
    square: { src: "/photos/resort-pastel-canopy.webp", width: 765, height: 1020, focal: "50% 40%", alt: "Rows of white chairs on the lawn under a canopy of pastel pink, lilac and teal drapes, with a floral mandap at the far end" } satisfies Art,
    squareCaption: "The lawn at Heaven Space Resort",
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
      all: "All seven",
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
    fallbackText: "Namaste Vinamra & Shreya! Replying to your wedding invitation for 2 & 3 February 2027.",
  },

  countdown: {
    paragraph: "The first ceremony begins at 10:00 AM on Monday 1 February, in the Zenana Courtyard. Ganesh will be on time. Vinamra is working on it.",
    heading: "Mark the dates",
    line: "1 & 2 February 2027 at Heaven Space Resort, Janapav Kuti, Mhow.",
    units: [
      ["day", "days"],
      ["hour", "hours"],
      ["minute", "minutes"],
      ["second", "seconds"],
    ] as const,
    begun: "The celebrations have begun.",
    button: "Add to calendar",
    calendar: {
      title: "Vinamra & Shreya’s wedding",
      description:
        "Mon 1 Feb: Ganesh Puja & Haldi 10:00 AM, Zenana Courtyard. Mehendi 3:00 PM, Mughal Garden Pavilion. Sangeet 7:30 PM, Durbar Hall. Tue 2 Feb: Baraat 5:00 PM, Palace Gates. Varmala 7:30 PM, Lotus Lawn. Pheras 9:30 PM, The Mandap. Please reply by 10 January 2027.",
    },
  },

  footer: {
    heading: ["See you", "in Indore"],
    message: "Both our homes are already full of lists, fittings and rehearsals. The only thing missing is you.", // SAMPLE
    blessing: "With love and blessings,",
    families: "Mr. Nilesh & Mrs. Krishna Rathi and Mr. Madhav & Mrs. Meena Ladha",
    hashtag: "#VinamraWedsShreya", // SAMPLE
    imprint: "A kankotri from the Rathi and Ladha families, Indore, February 2027",
    stamp: { src: "/photos/resort-pastel-canopy.webp", width: 765, height: 1020, focal: "50% 40%", alt: "Rows of white chairs on the lawn under a canopy of pastel pink, lilac and teal drapes, with a floral mandap at the far end" } satisfies Art,
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
    { src: "https://images.unsplash.com/photo-1744804298431-57953e4eaba0?w=1200&q=80&auto=format&fit=crop", alt: "Vinamra and Shreya cheering under a flower arch after the varmala" },
    { src: "https://images.unsplash.com/photo-1730003873829-09b4b16444c1?w=1200&q=80&auto=format&fit=crop", alt: "Shreya's hands covered in bridal mehendi" },
    { src: "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=1200&q=80&auto=format&fit=crop", alt: "Vinamra and Shreya under a canopy of fairy lights" },
    { src: "https://images.unsplash.com/photo-1756190564669-215843660e93?w=1200&q=80&auto=format&fit=crop", alt: "Vinamra and Shreya walking hand in hand through a palace courtyard" },
  ] satisfies Photo[],
};
