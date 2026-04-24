import { Book, DDCCategory, Achievement } from "./types";

export const STORAGE_KEY = "our_trees_library_final_v2";
export const REQUEST_STORAGE_KEY = "our_trees_library_requests_final";
export const USERS_STORAGE_KEY = "our_trees_users_v1";
export const CURRENT_USER_KEY = "our_trees_current_session";
export const DATA_VERSION = "1.0.2";
export const VERSION_KEY = "our_trees_db_version";

export const SPLASH_LOGO_URL =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop";
export const HEADER_LOGO_URL =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop";
export const INTRO_AUDIO_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const COLORS = {
  primary: "#AAB971",
  primaryLight: "#C4D18D",
  primaryDark: "#85944E",
  bgLight: "#F5F7EC", // very light olive/beige
  cardGradient: "linear-gradient(135deg, #AAB971 0%, #C4D18D 100%)",
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "seed",
    title: "Start of Journey",
    description: "မျိုးစေ့ (Seed) - Read 1 book",
    icon: "🌰",
    requiredBooks: 1,
  },
  {
    id: "sprout",
    title: "Sprouting",
    description: "အညှောင့်ပေါက်ခြင်း (Sprout) - Read 10 books",
    icon: "🌱",
    requiredBooks: 10,
  },
  {
    id: "seedling",
    title: "Small Plant",
    description: "အပင်ငယ် (Seedling) - Read 20 books",
    icon: "🌿",
    requiredBooks: 20,
  },
  {
    id: "growing",
    title: "Growing Plant",
    description: "ကြီးထွားလာသောအပင် (Growing Plant) - Read 30 books",
    icon: "🪴",
    requiredBooks: 30,
  },
  {
    id: "young_tree",
    title: "Young Tree",
    description: "သစ်ပင်ပျို (Young Tree) - Read 40 books",
    icon: "🌳",
    requiredBooks: 40,
  },
  {
    id: "mature_tree",
    title: "Mature Tree",
    description: "သစ်ပင်ကြီး (Mature Tree) - Read 50 books",
    icon: "🌲",
    requiredBooks: 50,
  },
  {
    id: "blooming_tree",
    title: "Blooming Tree",
    description: "ပန်းပွင့်သောအပင် (Blooming Tree) - Read 60 books",
    icon: "🌸",
    requiredBooks: 60,
  },
  {
    id: "fruitful_tree",
    title: "Fruitful Tree",
    description: "အသီးသီးသောအပင် (Fruitful Tree) - Read 70 books",
    icon: "🍎",
    requiredBooks: 70,
  },
  {
    id: "golden_tree",
    title: "Golden Tree",
    description: "ရွှေရောင်သစ်ပင် (Golden Tree) - Read 80 books",
    icon: "🍁",
    requiredBooks: 80,
  },
  {
    id: "magic_tree",
    title: "Magic Tree",
    description: "မှော်သစ်ပင် (Magic Tree) - Read 90 books",
    icon: "✨",
    requiredBooks: 90,
  },
  {
    id: "tree_of_life",
    title: "Tree of Life",
    description: "အသက်ပင် (Tree of Life) - Read 100 books",
    icon: "🌍",
    requiredBooks: 100,
  },
];

export const DDC_CATEGORIES: DDCCategory[] = [
  { code: "000", label: "အထွေထွေဗဟုသုတများ", iconName: "book", color: "#EAC248" },
  {
    code: "100",
    label: "စိတ်ပညာနှင့် ဒဿန",
    iconName: "brain",
    color: "#AED258",
  },
  { code: "200", label: "ဘာသာရေး", iconName: "flame", color: "#66AC80" },
  { code: "300", label: "လူမှုရေးသိပ္ပံ", iconName: "users", color: "#5F8BC1" },
  {
    code: "400",
    label: "ဘာသာစကား",
    iconName: "languages",
    color: "#46A6A5",
  },
  {
    code: "500",
    label: "သဘာဝသိပ္ပံ",
    iconName: "atom",
    color: "#B46DAC",
  },
  { code: "600", label: "နည်းပညာ", iconName: "laptop", color: "#DF7978" },
  { code: "700", label: "အနုပညာ", iconName: "palette", color: "#EE496C" },
  { code: "800", label: "စာပေ", iconName: "book-open", color: "#E3332A" },
  {
    code: "900",
    label: "သမိုင်းနှင့် ပထဝီ",
    iconName: "map-pin",
    color: "#E58735",
  },
];

import { GENERATED_BOOKS } from "./booksData";

export const SAMPLE_BOOKS: Book[] = GENERATED_BOOKS;
