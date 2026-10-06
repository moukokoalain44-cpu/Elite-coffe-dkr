const u = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BRAND = { name: "Elite Coffee", handle: "@elitecoffee" };

export const NAV = ["Home", "Menu", "About", "Rewards", "Locations", "Reviews", "Contact"];

export const STATS = [
  { value: 1250, label: "Customer Reviews" },
  { value: 3500, label: "Orders This Month" },
  { value: 150, label: "Menu Items" },
];

export const BEST_SELLERS = [
  { name: "Signature Creation", desc: "Our house blend with velvety foam, honey and a whisper of cinnamon.", price: 6.5, rating: 4.9, tag: "Special", featured: true, img: u("photo-1572442388796-11668a67e53d") },
  { name: "Caramel Latte", desc: "Smooth espresso, steamed milk and buttery house-made caramel.", price: 5.25, rating: 4.8, tag: "Popular", img: u("photo-1461023058943-07fcbe16d735") },
  { name: "Mocha Cold Brew", desc: "18-hour cold brew with dark chocolate and a splash of cream.", price: 5.75, rating: 4.9, tag: "Iced", img: u("photo-1517701604599-bb29b565090c") },
];

export const CATEGORIES = ["Espresso", "Latte", "Cappuccino", "Cold Brew"] as const;
export type Category = (typeof CATEGORIES)[number];

export const MENU: { name: string; category: Category; price: number; img: string }[] = [
  { name: "Classic Espresso", category: "Espresso", price: 3.0, img: u("photo-1510591509098-f4fdc6d0ff04") },
  { name: "Doppio", category: "Espresso", price: 3.75, img: u("photo-1579992357154-faf4bde95b3d") },
  { name: "Macchiato", category: "Espresso", price: 4.0, img: u("photo-1485808191679-5f86510681a2") },
  { name: "Vanilla Latte", category: "Latte", price: 5.0, img: u("photo-1570968915860-54d5c301fa9f") },
  { name: "Oat Honey Latte", category: "Latte", price: 5.5, img: u("photo-1541167760496-1628856ab772") },
  { name: "Matcha Latte", category: "Latte", price: 5.25, img: u("photo-1515823064-d6e0c04616a7") },
  { name: "Classic Cappuccino", category: "Cappuccino", price: 4.5, img: u("photo-1534778101976-62847782c213") },
  { name: "Cinnamon Cappuccino", category: "Cappuccino", price: 4.75, img: u("photo-1509042239860-f550ce710b93") },
  { name: "Dry Cappuccino", category: "Cappuccino", price: 4.5, img: u("photo-1572286258217-215cf8e7e0d2") },
  { name: "Original Cold Brew", category: "Cold Brew", price: 4.5, img: u("photo-1461023058943-07fcbe16d735") },
  { name: "Nitro Cold Brew", category: "Cold Brew", price: 5.25, img: u("photo-1517701604599-bb29b565090c") },
  { name: "Salted Cream Cold Brew", category: "Cold Brew", price: 5.5, img: u("photo-1592663527359-cf6642f54cff") },
];

export const ESPRESSO_IMG = u("photo-1511920170033-f8396924c348", 1000);

export const REVIEWS = [
  { quote: "The caramel latte is unreal. Every visit feels like a little ritual I look forward to all week.", name: "Sarah Mitchell", role: "Regular Customer", avatar: u("photo-1494790108377-be9c29b29330", 120) },
  { quote: "Best espresso in town, hands down. The baristas genuinely care about every single cup.", name: "James Carter", role: "Coffee Enthusiast", avatar: u("photo-1507003211169-0a1dd7228f2d", 120) },
  { quote: "Cozy space, fast online ordering, and the mocha cold brew got me through finals.", name: "Emily Chen", role: "Student", avatar: u("photo-1438761681033-6461ffad8d80", 120) },
];

export const AVATARS = REVIEWS.map((r) => r.avatar).concat(u("photo-1500648767791-00dcc994a43e", 120));

export const INSTAGRAM = [
  { img: u("photo-1534778101976-62847782c213", 600), alt: "Latte art" },
  { img: u("photo-1509440159596-0249088772ff", 600), alt: "Fresh pastries" },
  { img: u("photo-1554118811-1e0d58224f24", 600), alt: "Cafe interior" },
  { img: u("photo-1447933601403-0c6688de566e", 600), alt: "Coffee beans" },
  { img: u("photo-1495474472287-4d71bcdd2085", 600), alt: "Hand holding a cup" },
  { img: u("photo-1497515114629-f71d768fd07c", 600), alt: "Latte in a red cup" },
];

export const CONTACT = {
  email: "hello@elitecoffee.com",
  phone: "(555) 123-4567",
  address: "123 Roast Street, Brewville, CA 90210",
  hours: ["Mon–Fri: 6:30am – 8pm", "Sat–Sun: 7:30am – 9pm"],
};

export const FOOTER = {
  Explore: ["Menu", "Locations", "Rewards", "Catering"],
  Support: ["Gift Cards", "FAQs", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookies"],
};
