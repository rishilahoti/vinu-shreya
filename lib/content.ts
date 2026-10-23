// Every visible string and value on the invite lives here. Swap the dummy values for the real ones.
// Photos: drop real files in /public/photos and use paths like "/photos/groom.jpg".

export type EventIcon = "sun" | "hand" | "music" | "horse" | "flower" | "fire";

export type WeddingEvent = {
  id: string;
  name: string;
  hindi: string;
  day: 1 | 2;
  date: string; // display date
  time: string;
  place: string;
  note: string;
  icon: EventIcon;
};

export type Photo = { src: string; alt: string };

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

  events: [
    {
      id: "haldi",
      name: "Ganesh Puja & Haldi",
      hindi: "हल्दी",
      day: 1,
      date: "Tue, 2 Feb",
      time: "10:00 AM",
      place: "Zenana Courtyard",
      note: "Wear yellow. Expect to leave a little more yellow.",
      icon: "sun",
    },
    {
      id: "mehendi",
      name: "Mehendi",
      hindi: "मेहंदी",
      day: 1,
      date: "Tue, 2 Feb",
      time: "3:00 PM",
      place: "Mughal Garden Pavilion",
      note: "Henna, folk music and plenty of shade. Greens and pinks welcome.",
      icon: "hand",
    },
    {
      id: "sangeet",
      name: "Sangeet",
      hindi: "संगीत",
      day: 1,
      date: "Tue, 2 Feb",
      time: "7:30 PM",
      place: "Durbar Hall",
      note: "Both families have been rehearsing. Comfortable shoes recommended.",
      icon: "music",
    },
    {
      id: "baraat",
      name: "Baraat",
      hindi: "बारात",
      day: 2,
      date: "Wed, 3 Feb",
      time: "5:00 PM",
      place: "Palace Gates",
      note: "The groom arrives on a mare. Dhol, safas and dancing all the way in.",
      icon: "horse",
    },
    {
      id: "varmala",
      name: "Varmala",
      hindi: "वरमाला",
      day: 2,
      date: "Wed, 3 Feb",
      time: "7:30 PM",
      place: "Lotus Lawn",
      note: "The exchange of garlands. Cheer loudly for your side.",
      icon: "flower",
    },
    {
      id: "pheras",
      name: "Pheras",
      hindi: "फेरे",
      day: 2,
      date: "Wed, 3 Feb",
      time: "9:30 PM",
      place: "The Mandap",
      note: "Seven vows around the sacred fire, followed by dinner under the stars.",
      icon: "fire",
    },
  ] satisfies WeddingEvent[],

  venue: {
    name: "Rambagh Palace",
    address: "Bhawani Singh Road, Rambagh, Jaipur, Rajasthan 302005",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rambagh+Palace+Jaipur",
  },

  rsvp: {
    // Replies open WhatsApp with a prefilled message to this number (country code, no +).
    whatsapp: "919876543210",
    deadline: "10 January 2027",
  },

  moments: [
    { src: "https://images.unsplash.com/photo-1744804298431-57953e4eaba0?w=1200&q=80&auto=format&fit=crop", alt: "Vinu and Shreya cheering under a flower arch after the varmala" },
    { src: "https://images.unsplash.com/photo-1730003873829-09b4b16444c1?w=1200&q=80&auto=format&fit=crop", alt: "Shreya's hands covered in bridal mehendi" },
    { src: "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=1200&q=80&auto=format&fit=crop", alt: "Vinu and Shreya under a canopy of fairy lights" },
    { src: "https://images.unsplash.com/photo-1756190564669-215843660e93?w=1200&q=80&auto=format&fit=crop", alt: "Vinu and Shreya walking hand in hand through a palace courtyard" },
  ] satisfies Photo[],
};
