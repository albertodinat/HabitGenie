const keywordToEmojiMap: { [key: string]: string } = {
  // Food and Drink
  water: "💧",
  drink: "💧",
  coffee: "☕",
  tea: "🍵",
  juice: "🧃",
  soda: "🥤",
  milk: "🥛",
  beer: "🍺",
  wine: "🍷",
  pizza: "🍕",
  burger: "🍔",
  fries: "🍟",
  salad: "🥗",
  food: "🥗",
  vegetables: "🥦",
  fruit: "🍎",
  apple: "🍏",
  banana: "🍌",
  ice: "🍧",
  cake: "🍰",
  cookie: "🍪",
  chocolate: "🍫",
  bread: "🍞",

  // Exercise and Sports
  exercise: "🏋️‍♂️",
  workout: "🏋️‍♂️",
  yoga: "🧘‍♀️",
  run: "🏃‍♂️",
  walk: "🚶‍♂️",
  cycling: "🚴‍♂️",
  swim: "🏊‍♂️",
  basketball: "🏀",
  soccer: "⚽",
  football: "🏈",
  tennis: "🎾",
  golf: "🏌️‍♂️",
  boxing: "🥊",
  skiing: "⛷️",
  surfing: "🏄‍♂️",

  // Relaxation and Hobbies
  meditate: "🧘‍♀️",
  sleep: "💤",
  nap: "💤",
  read: "📚",
  book: "📚",
  music: "🎵",
  guitar: "🎸",
  piano: "🎹",
  movie: "🎬",
  tv: "📺",
  painting: "🎨",
  photography: "📷",
  game: "🎮",
  puzzle: "🧩",

  // Work and Productivity
  work: "💼",
  study: "📖",
  code: "💻",
  meeting: "📅",
  email: "📧",
  presentation: "📊",
  design: "🖌️",

  // Travel and Outdoors
  travel: "✈️",
  flight: "✈️",
  drive: "🚗",
  bus: "🚌",
  train: "🚆",
  hike: "🥾",
  camping: "🏕️",
  beach: "🏖️",
  mountain: "🏔️",
  park: "🏞️",

  // Health and Wellness
  doctor: "👨‍⚕️",
  dentist: "🦷",
  hospital: "🏥",
  medicine: "💊",
  pill: "💊",
  therapy: "🧠",
  spa: "💆‍♀️",

  // Technology
  phone: "📱",
  computer: "💻",
  laptop: "💻",
  tablet: "📱",
  camera: "📷",

  // Weather and Seasons
  sunny: "☀️",
  rain: "🌧️",
  snow: "❄️",
  storm: "⛈️",
  wind: "💨",
  cloud: "☁️",
  spring: "🌸",
  summer: "🌞",
  autumn: "🍂",
  winter: "⛄",

  // Miscellaneous
  love: "❤️",
  heart: "❤️",
  star: "⭐",
  fire: "🔥",
  celebration: "🎉",
  party: "🎊",
  gift: "🎁",
  money: "💸",
  shopping: "🛒",
  cleaning: "🧹",
  repair: "🔧",
  car: "🚗",
  bike: "🚴‍♂️",
};

const keywordToUnitMap: { [key: string]: string } = {
  // Food and Drink
  water: "ml",
  drink: "ml",
  coffee: "cups",
  tea: "cups",
  juice: "ml",
  soda: "ml",
  milk: "ml",
  beer: "ml",
  wine: "ml",
  pizza: "Meals",
  burger: "Meals",
  fries: "Meals",
  salad: "Meals",
  food: "Meals",
  vegetables: "Meals",
  fruit: "Meals",
  apple: "Meals",
  banana: "Meals",
  ice: "Meals",
  cake: "Meals",
  cookie: "Meals",
  chocolate: "g",
  bread: "Meals",

  // Exercise and Sports
  exercise: "min",
  workout: "min",
  yoga: "min",
  run: "km",
  walk: "km",
  cycling: "km",
  swim: "m",
  basketball: "games",
  soccer: "games",
  football: "games",
  tennis: "matches",
  golf: "rounds",
  boxing: "rounds",
  skiing: "runs",
  surfing: "sessions",

  // Relaxation and Hobbies
  meditate: "min",
  sleep: "h",
  nap: "min",
  read: "pages",
  book: "books",
  music: "min",
  guitar: "sessions",
  piano: "sessions",
  movie: "movies",
  tv: "episodes",
  painting: "paintings",
  photography: "photos",
  game: "games",
  puzzle: "puzzles",

  // Work and Productivity
  work: "h",
  study: "h",
  code: "h",
  meeting: "meetings",
  email: "emails",
  presentation: "presentations",
  design: "projects",

  // Travel and Outdoors
  travel: "km",
  flight: "flights",
  drive: "km",
  bus: "rides",
  train: "rides",
  hike: "km",
  camping: "nights",
  beach: "visits",
  mountain: "hikes",
  park: "visits",

  // Health and Wellness
  doctor: "appointments",
  dentist: "appointments",
  hospital: "visits",
  medicine: "doses",
  pill: "pills",
  therapy: "sessions",
  spa: "sessions",

  // Technology
  phone: "calls",
  computer: "h",
  laptop: "h",
  tablet: "h",
  camera: "photos",

  // Weather and Seasons
  sunny: "days",
  rain: "days",
  snow: "days",
  storm: "storms",
  wind: "gusts",
  cloud: "clouds",
  spring: "seasons",
  summer: "seasons",
  autumn: "seasons",
  winter: "seasons",

  // Miscellaneous
  love: "moments",
  heart: "beats",
  star: "stars",
  fire: "flames",
  celebration: "events",
  party: "events",
  gift: "gifts",
  money: "dollars",
  shopping: "trips",
  cleaning: "sessions",
  repair: "jobs",
  car: "km",
  bike: "km"
};


export const assignKeyword = (activityName: string) => {
  const lowercaseWords = activityName.toLowerCase().split(/\s+/);
  for (const word in lowercaseWords) {
    if (keywordToUnitMap[lowercaseWords[word]]) {
      return keywordToUnitMap[lowercaseWords[word]]; // Return the first matched emoji
    }
  }

  return null;
};
export const assignEmoji = (activityName: string) => {
  const lowercaseWords = activityName.toLowerCase().split(/\s+/);
  for (const word in lowercaseWords) {
    if (keywordToEmojiMap[lowercaseWords[word]]) {
      return keywordToEmojiMap[lowercaseWords[word]]; // Return the first matched emoji
    }
  }

  return "📋";
};

export const unitsOfMeasurements = [
  { label: "Milliliters", value: "ml" },
  { label: "Liters", value: "l" },
  { label: "Grams", value: "g" },
  { label: "Kilograms", value: "kg" },
  { label: "Meters", value: "m" },
  { label: "Kilometers", value: "km" },
  { label: "Inches", value: "in" },
  { label: "Feet", value: "ft" },
  { label: "Miles", value: "mi" },
  { label: "Minutes", value: "min" },
  { label: "Hours", value: "h" },
  { label: "Days", value: "days" },
  { label: "Meals", value: "Meals" },
  { label: "Cups", value: "cups" },
  { label: "Pieces", value: "pieces" },
  { label: "Sessions", value: "sessions" },
  { label: "Games", value: "games" },
  { label: "Appointments", value: "appointments" },
  { label: "Photos", value: "photos" },
  { label: "Pages", value: "pages" },
  { label: "Puzzles", value: "puzzles" },
  { label: "Rounds", value: "rounds" },
  { label: "Movies", value: "movies" },
  { label: "Episodes", value: "episodes" },
  { label: "Paintings", value: "paintings" },
  { label: "Projects", value: "projects" },
  { label: "Meetings", value: "meetings" },
  { label: "Emails", value: "emails" },
  { label: "Trips", value: "trips" },
  { label: "Doses", value: "doses" },
  { label: "Calls", value: "calls" },
  { label: "Visits", value: "visits" },
  { label: "Flames", value: "flames" },
  { label: "Beats", value: "beats" },
  { label: "Stars", value: "stars" },
  { label: "Moments", value: "moments" }
];

export const frequencies = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Bi-Weekly",
    value: "bi-weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Yearly",
    value: "yearly",
  },
];