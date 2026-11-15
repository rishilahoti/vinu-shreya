// Every fact on the invite (names, dates, events, venue, contact). Section copy lives in each component as { en, hi }.
// Layout and art are a copy of the cousin's site (rachit-weds-kanchi); our 7 ceremonies are grouped into its 5 panels.

export type L = { en: string; hi: string };

export type InviteEvent = {
  id: string;
  num: string; // "01"
  day: 1 | 2;
  dateShort: L; // "1 FEB"
  dateLong: L; // "1st February, 2027"
  time: L; // "10:00 AM Onwards"
  name: L;
  hindiLine: string; // the Devanagari line under the name, shown in both languages
  chip: L; // short name for the chips row
  next: L; // "Next: …" label of the panel after this one
  dress: L;
  art: { portrait: string; landscape: string };
  attire: string;
};

const WHATSAPP = "917354513427";

export const invite = {
  invocation: { en: "॥ SHREE GANESHAY NAMAH ॥", hi: "॥ श्री गणेशाय नमः ॥" },
  groom: { en: "Vinamra", hi: "विनम्र", full: "Vinamra Rathi" },
  bride: { en: "Shreya", hi: "श्रेया", full: "Shreya Ladha" },
  initials: { groom: "V", bride: "S" },
  families: { en: "Rathi & Ladha", hi: "राठी एवं लड्ढा" },
  // First ceremony, IST. Gate and timeline countdowns run to this.
  startsAt: "2027-02-01T10:00:00+05:30",
  dates: {
    hero: { en: "1ST & 2ND FEBRUARY", hi: "1 एवं 2 फ़रवरी" },
    year: "2027",
    range: { en: "1–2 February 2027", hi: "1–2 फ़रवरी 2027" },
    commence: { en: "Celebrations Commence · Monday, 1st February 2027", hi: "उत्सव आरंभ · सोमवार, 1 फ़रवरी 2027" },
    days: [
      { en: "Day 1 · 1 Feb", hi: "दिन 1 · 1 फ़र" },
      { en: "Day 2 · 2 Feb", hi: "दिन 2 · 2 फ़र" },
    ],
  },
  venue: {
    name: { en: "Heaven Space Resort", hi: "हेवन स्पेस रिज़ॉर्ट" },
    short: { en: "Heaven Space Resort · Mhow", hi: "हेवन स्पेस रिज़ॉर्ट · महू" },
    area: { en: "Janapav Kuti, Mhow (Indore), Madhya Pradesh", hi: "जानापाव कुटी, महू (इंदौर), मध्य प्रदेश" },
    address: "Heaven Space Resort, Gram Yaswant Nagar near Janapav Kuti, A.B. Road, NH-3, Mhow, Madhya Pradesh 453661",
    mapsUrl: "https://maps.app.goo.gl/SfCXjZnQ6Eu8b6TQ7",
    about: {
      en: "A green resort off the Agra–Bombay road near Janapav Kuti, with open lawns, a lotus-pond mandap and room for both families — every ceremony of Vinamra & Shreya’s wedding happens right here.",
      hi: "जानापाव कुटी के पास आगरा–बॉम्बे रोड पर एक हरा-भरा रिज़ॉर्ट, खुले लॉन, कमल-ताल मंडप और दोनों परिवारों के लिए पूरी जगह — विनम्र और श्रेया के विवाह के सभी समारोह यहीं होंगे।",
    },
    photos: [
      { src: "/images/venue-1.webp", alt: "White chairs on the lawn under a pastel canopy, a floral mandap at the far end" },
      { src: "/images/venue-2.webp", alt: "A round red-pillared mandap in a lotus pond, a small bridge and a white crane statue in front" },
    ],
  },
  contact: {
    whatsapp: WHATSAPP,
    display: "+91 73545 13427",
    tel: `tel:+${WHATSAPP}`,
  },
  hashtag: "#VinamraWedsShreya",
  calendar: {
    title: "Vinamra & Shreya Wedding",
    details: "Wedding celebrations of Vinamra Rathi & Shreya Ladha at Heaven Space Resort, Mhow.",
    // UTC: 1 Feb 2027 10:00 IST to 2 Feb 2027 end of day.
    start: "20270201T043000Z",
    end: "20270202T190000Z",
  },
  audio: "/audio/aaj-sajeya.mp3",
  video: "/videos/wedding-celebration.MP4",

  events: [
    {
      id: "maayra",
      num: "01",
      day: 1,
      dateShort: { en: "1 FEB", hi: "1 फ़र" },
      dateLong: { en: "1st February, 2027", hi: "1 फ़रवरी, 2027" },
      time: { en: "10:00 AM Onwards", hi: "सुबह 10:00 बजे से" },
      name: { en: "Ganesh Puja & Maayra", hi: "गणेश पूजन एवं मायरा" },
      hindiLine: "गणेश पूजन एवं मायरा",
      chip: { en: "Maayra", hi: "मायरा" },
      next: { en: "Next: Raasleela", hi: "आगे: रासलीला" },
      dress: { en: "Be ready to join the Maayra", hi: "मायरा में शामिल होने को तैयार रहें" },
      art: { portrait: "/images/events-screen-wise/mayra-potrait.webp", landscape: "/images/events-screen-wise/mayra-landscape.webp" },
      attire: "/images/attire-images/mayra-attire.webp",
    },
    {
      id: "raasleela",
      num: "02",
      day: 1,
      dateShort: { en: "1 FEB", hi: "1 फ़र" },
      dateLong: { en: "1st February, 2027", hi: "1 फ़रवरी, 2027" },
      time: { en: "02:00 PM Onwards", hi: "दोपहर 2:00 बजे से" },
      name: { en: "Raasleela", hi: "रासलीला" },
      hindiLine: "रासलीला",
      chip: { en: "Raasleela", hi: "रासलीला" },
      next: { en: "Next: Ring Ceremony", hi: "आगे: अंगूठी रस्म" },
      dress: { en: "Traditional attire for a cultural performance", hi: "सांस्कृतिक प्रस्तुति हेतु पारंपरिक परिधान" },
      art: { portrait: "/images/events-screen-wise/haldi-and-carnival-potrait.webp", landscape: "/images/events-screen-wise/haldi-and-carnival-landscape.webp" },
      attire: "/images/attire-images/carnival-haldi-attire.webp",
    },
    {
      // Ring Ceremony 7:30 PM and Reception 8:30 PM, both Durbar Hall.
      id: "ring",
      num: "03",
      day: 1,
      dateShort: { en: "1 FEB", hi: "1 फ़र" },
      dateLong: { en: "1st February, 2027", hi: "1 फ़रवरी, 2027" },
      time: { en: "07:30 PM Onwards", hi: "शाम 7:30 बजे से" },
      name: { en: "Ring Ceremony & Reception", hi: "अंगूठी रस्म एवं रिसेप्शन" },
      hindiLine: "अंगूठी रस्म एवं स्वागत समारोह",
      chip: { en: "Ring", hi: "अंगूठी" },
      next: { en: "Next: Baraat", hi: "आगे: बारात" },
      dress: { en: "Formal evening attire", hi: "औपचारिक संध्या परिधान" },
      art: { portrait: "/images/events-screen-wise/sangeet-potrait.webp", landscape: "/images/events-screen-wise/sangeet-landscape.webp" },
      attire: "/images/attire-images/sangeet-attire.webp",
    },
    {
      id: "baraat",
      num: "04",
      day: 2,
      dateShort: { en: "2 FEB", hi: "2 फ़र" },
      dateLong: { en: "2nd February, 2027", hi: "2 फ़रवरी, 2027" },
      time: { en: "10:00 AM Onwards", hi: "सुबह 10:00 बजे से" },
      name: { en: "Baraat", hi: "बारात" },
      hindiLine: "बारात निकासी व अगवानी",
      chip: { en: "Baraat", hi: "बारात" },
      next: { en: "Next: Varmala & Pheras", hi: "आगे: वरमाला एवं फेरे" },
      dress: { en: "Festive wear you can dance in, and a safa", hi: "नाचने लायक उत्सवी परिधान, और साफ़ा" },
      art: { portrait: "/images/events-screen-wise/baarat-potrait.webp", landscape: "/images/events-screen-wise/baraat-landscape.webp" },
      attire: "/images/attire-images/baarat-attire.webp",
    },
    {
      // Varmala 11:30 AM (Lotus Lawn), Pheras 1:30 PM (The Mandap).
      id: "pheras",
      num: "05",
      day: 2,
      dateShort: { en: "2 FEB", hi: "2 फ़र" },
      dateLong: { en: "2nd February, 2027", hi: "2 फ़रवरी, 2027" },
      time: { en: "11:30 AM Onwards", hi: "सुबह 11:30 बजे से" },
      name: { en: "Varmala & Pheras", hi: "वरमाला एवं फेरे" },
      hindiLine: "वरमाला एवं फेरे",
      chip: { en: "Varmala", hi: "वरमाला" },
      next: { en: "Next: Dress Code & Styling", hi: "आगे: परिधान व शैली" },
      dress: { en: "Your finest, and a shawl", hi: "आपका सबसे सुंदर परिधान, और एक शॉल" },
      art: { portrait: "/images/events-screen-wise/phere-potrait.webp", landscape: "/images/events-screen-wise/phere-landscape.webp" },
      attire: "/images/attire-images/shaadi-phere-attire.webp",
    },
  ] satisfies InviteEvent[],
};

export const waShare = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
export const googleCalendarUrl = () => {
  const c = invite.calendar;
  const q = new URLSearchParams({ action: "TEMPLATE", text: c.title, dates: `${c.start}/${c.end}`, details: c.details, location: invite.venue.address });
  return `https://calendar.google.com/calendar/render?${q}`;
};
