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
  "client-work": [
    {
      id: "cw1",
      title: "Q4 Product Roadmap",
      description: "Features: AI clustering, export options, team collaboration.",
      tags: [{ label: "planning" }, { label: "work" }],
      pinned: true,
    },
    {
      id: "cw2",
      title: "User Research Findings",
      description: "Interview notes from 12 users on note organization preferences.",
      tags: [{ label: "research" }, { label: "work" }],
    },
    {
      id: "cw3",
      title: "API Integration Requirements",
      description: "Third-party services to connect: Slack, Notion, Linear.",
      tags: [{ label: "work" }, { label: "integration" }],
    },
    {
      id: "cw4",
      title: "Design System Updates",
      description: "Component library refresh based on user feedback.",
      tags: [{ label: "work" }, { label: "design" }],
    },
  ],
};

export const mockClusters = [
  {
    id: "c1",
    title: "Outdoor cooking",
    description: "All notes about grilling, smokers, gear, and prep timing.",
    tags: [{ label: "bbq" }, { label: "tools" }, { label: "prep" }],
    pinned: false,
  },
  {
    id: "c2",
    title: "People to follow up with",
    description: "Reminders to ping Alex, Maya, and Jordan.",
    tags: [{ label: "contact" }, { label: "follow-up" }],
    pinned: false,
  },
  {
    id: "c3",
    title: "Content ideas",
    description: "Podcast episodes, gear reviews, and listener segments.",
    tags: [{ label: "content" }, { label: "audio" }],
    pinned: false,
  },
  {
    id: "c4",
    title: "Equipment wishlist",
    description: "Tools and gear to upgrade the outdoor cooking setup.",
    tags: [{ label: "gear" }, { label: "upgrade" }],
    pinned: false,
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

// Stream architecture mock data
export type StreamDropType = "text" | "file" | "image" | "voice";

export interface StreamDrop {
  id: string;
  type: StreamDropType;
  content: string;
  timestamp: Date;
  tags: Array<{ label: string }>;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export const mockStreamDrops: StreamDrop[] = [
  {
    id: "sd1",
    type: "text",
    content: "Need to remember to check the grill temperature before guests arrive",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    tags: [{ label: "task" }, { label: "bbq" }],
  },
  {
    id: "sd2",
    type: "text",
    content: "Alex mentioned a low-and-slow method for ribs. Should ask for details.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    tags: [{ label: "idea" }, { label: "cooking" }],
  },
  {
    id: "sd3",
    type: "image",
    content: "Screenshot of smoker setup",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    tags: [{ label: "reference" }, { label: "gear" }],
    fileUrl: "/placeholder.jpg",
    fileName: "smoker-setup.jpg",
    fileType: "image/jpeg",
  },
  {
    id: "sd4",
    type: "file",
    content: "BBQ recipe collection",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    tags: [{ label: "recipe" }, { label: "reference" }],
    fileUrl: "/placeholder.pdf",
    fileName: "bbq-recipes.pdf",
    fileType: "application/pdf",
  },
  {
    id: "sd5",
    type: "text",
    content: "Guest list: Maya (vegetarian), Jordan (nut allergy), 12 adults total",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    tags: [{ label: "contact" }, { label: "logistics" }],
  },
  {
    id: "sd6",
    type: "voice",
    content: "Voice note about podcast episode ideas",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    tags: [{ label: "content" }, { label: "audio" }],
    fileUrl: "/placeholder.mp3",
    fileName: "voice-note.mp3",
    fileType: "audio/mpeg",
  },
];

export interface Board {
  id: string;
  name: string;
  description: string;
  tags: Array<{ label: string }>;
  noteCount: number;
  pinned: boolean;
  lastActivity: Date;
}

export const mockBoards: Board[] = [
  {
    id: "b1",
    name: "BBQ Planning",
    description: "All notes related to the upcoming BBQ weekend",
    tags: [{ label: "event" }, { label: "bbq" }],
    noteCount: 8,
    pinned: true,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "b2",
    name: "Gear Research",
    description: "Equipment and tools I'm considering",
    tags: [{ label: "research" }, { label: "gear" }],
    noteCount: 5,
    pinned: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "b3",
    name: "Podcast Ideas",
    description: "Content ideas and episode planning",
    tags: [{ label: "content" }, { label: "audio" }],
    noteCount: 3,
    pinned: false,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "b4",
    name: "Client Work",
    description: "Follow-ups and deliverables",
    tags: [{ label: "work" }],
    noteCount: 12,
    pinned: true,
    lastActivity: new Date(Date.now() - 1000 * 60 * 15),
  },
];

export interface MuseInsight {
  id: string;
  type: "top-tags" | "recurring-topics" | "idea-patterns";
  title: string;
  description: string;
  data: Record<string, unknown>;
}

export const mockMuseInsights: MuseInsight[] = [
  {
    id: "mi1",
    type: "top-tags",
    title: "Top Tags This Week",
    description: "Your most frequently used tags",
    data: {
      tags: [
        { label: "bbq", count: 12 },
        { label: "gear", count: 8 },
        { label: "recipe", count: 6 },
        { label: "work", count: 5 },
      ],
    },
  },
  {
    id: "mi2",
    type: "recurring-topics",
    title: "Recurring Topics",
    description: "Themes that keep appearing in your notes",
    data: {
      topics: [
        "Outdoor cooking techniques",
        "Equipment upgrades",
        "Event planning",
        "Content creation",
      ],
    },
  },
  {
    id: "mi3",
    type: "idea-patterns",
    title: "Idea Patterns",
    description: "How your thoughts connect",
    data: {
      patterns: [
        "You often research gear before making purchases",
        "Event planning notes cluster around logistics and people",
        "Content ideas frequently reference cooking techniques",
      ],
    },
  },
];
