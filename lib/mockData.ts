// Mock data for consistent demo mode, onboarding, and screenshots
// Follows BBQ/Podcast/Wishlist Figma aesthetic with realistic tags and descriptions

export const mockNotes = [
  {
    id: "n1",
    title: "Grill setup for Saturday",
    description: "Need charcoal, foil pans, veggie skewers. Check propane.",
    tags: [{ label: "task" }, { label: "bbq" }],
    pinned: true,
  },
  {
    id: "n2",
    title: "Ask Alex about smoker techniques",
    description: "He mentioned a low-and-slow method for ribs.",
    tags: [{ label: "idea" }],
  },
  {
    id: "n3",
    title: "Send guest list final",
    description: "Confirm with Maya and Jordan. 12 adults / 4 kids.",
    tags: [{ label: "contact" }, { label: "logistics" }],
  },
  {
    id: "n4",
    title: "Podcast episode ideas",
    description:
      "Interview with BBQ pitmaster, gear review segment, listener Q&A.",
    tags: [{ label: "content" }, { label: "audio" }],
  },
  {
    id: "n5",
    title: "Wireless meat thermometer",
    description: "Track temp without opening the grill lid. Check reviews.",
    tags: [{ label: "gear" }, { label: "wishlist" }],
    pinned: true,
  },
];

export const mockStacks = [
  {
    id: "s1",
    name: "BBQ Weekend",
    description: "Food prep, guest list, timing, supplies.",
    pinned: true,
    tags: [{ label: "event" }],
  },
  {
    id: "s2",
    name: "Wishlist",
    description: "Gear I want, tools to buy next.",
    pinned: false,
    tags: [{ label: "personal" }],
  },
  {
    id: "s3",
    name: "Listen Next",
    description: "Podcasts / episodes worth a listen.",
    pinned: false,
    tags: [{ label: "audio" }],
  },
  {
    id: "s4",
    name: "Client Work",
    description: "Follow-ups and deliverables for freelance clients.",
    pinned: false,
    tags: [{ label: "work" }],
  },
];

export const mockStackItems = {
  bbq: [
    {
      id: "bbq1",
      title: "Smoked rib technique",
      description: "3-2-1 method, brown sugar + paprika rub.",
      tags: [{ label: "cooking" }, { label: "low heat" }],
      pinned: true,
    },
    {
      id: "bbq2",
      title: "Prep timeline",
      description: "Marinate Friday night, dry rub morning of.",
      tags: [{ label: "timeline" }],
    },
    {
      id: "bbq3",
      title: "Guest dietary needs",
      description: "Maya is vegetarian, Jordan allergic to nuts.",
      tags: [{ label: "logistics" }, { label: "dietary" }],
    },
  ],
  wishlist: [
    {
      id: "wl1",
      title: "Wireless meat thermometer",
      description: "Track temp without opening the grill lid.",
      tags: [{ label: "gear" }, { label: "upgrade" }],
    },
    {
      id: "wl2",
      title: "Cast iron flat top",
      description: "For smash burgers and veggies outdoors.",
      tags: [{ label: "gear" }],
      pinned: true,
    },
    {
      id: "wl3",
      title: "Charcoal chimney starter",
      description: "Faster, cleaner way to light charcoal.",
      tags: [{ label: "gear" }, { label: "efficiency" }],
    },
  ],
  "listen-next": [
    {
      id: "ln1",
      title: "BBQ Pitmasters podcast",
      description: "Episode 47: Competition smoking techniques.",
      tags: [{ label: "bbq" }, { label: "competition" }],
    },
    {
      id: "ln2",
      title: "Cooking with Fire",
      description: "Traditional methods vs modern equipment.",
      tags: [{ label: "traditional" }, { label: "modern" }],
    },
  ],
};

export const mockClusters = [
  {
    id: "c1",
    title: "Outdoor cooking",
    description: "All notes about grilling, smokers, gear, and prep timing.",
    tags: [{ label: "bbq" }, { label: "tools" }, { label: "prep" }],
  },
  {
    id: "c2",
    title: "People to follow up with",
    description: "Reminders to ping Alex, Maya, and Jordan.",
    tags: [{ label: "contact" }, { label: "follow-up" }],
  },
  {
    id: "c3",
    title: "Content ideas",
    description: "Podcast episodes, gear reviews, and listener segments.",
    tags: [{ label: "content" }, { label: "audio" }],
  },
  {
    id: "c4",
    title: "Equipment wishlist",
    description: "Tools and gear to upgrade the outdoor cooking setup.",
    tags: [{ label: "gear" }, { label: "upgrade" }],
  },
];

export const mockInsights = [
  {
    id: "i1",
    title: "You planned a full event",
    description:
      "Your recent notes focus on cooking for guests, scheduling prep, and making sure everyone has what they need.",
    tags: [{ label: "social" }, { label: "planning" }],
  },
  {
    id: "i2",
    title: "Gear research mode",
    description:
      "You're actively researching equipment upgrades and comparing options for outdoor cooking.",
    tags: [{ label: "research" }, { label: "gear" }],
  },
];

export const mockMemory = [
  {
    id: "m1",
    period: "Week of Oct 20",
    summary:
      "You captured prep steps, supplies, and who's attending. You're in logistics mode.",
    tags: [{ label: "timeline" }, { label: "people" }],
  },
  {
    id: "m2",
    period: "Week of Oct 13",
    summary:
      "Focus on gear research and podcast content planning. Heavy equipment research.",
    tags: [{ label: "research" }, { label: "content" }],
  },
  {
    id: "m3",
    period: "Week of Oct 6",
    summary:
      "Initial BBQ planning and guest outreach. Setting up the event framework.",
    tags: [{ label: "planning" }, { label: "outreach" }],
  },
];
