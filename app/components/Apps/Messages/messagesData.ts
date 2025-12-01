// Tim Cook's Messages - Dummy Data

export interface Contact {
  id: string;
  name: string;
  initials: string;
  phoneNumber: string;
  avatarColor: string;
  avatarImage?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromMe: boolean;
  isRead: boolean;
  isDelivered: boolean;
  type?: "text" | "image" | "link";
}

export interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  lastMessagePreview: string;
  lastMessageTime: Date;
  unreadCount: number;
  isPinned: boolean;
  isTyping?: boolean;
  isAI?: boolean; // Special flag for AI conversation
}

// Tim Cook's contacts
export const contacts: Contact[] = [
  {
    id: "1",
    name: "Craig Federighi",
    initials: "CF",
    phoneNumber: "+1 (408) 555-0101",
    avatarColor: "#5856D6",
  },
  {
    id: "2",
    name: "Jony Ive",
    initials: "JI",
    phoneNumber: "+44 7700 900123",
    avatarColor: "#FF9500",
  },
  {
    id: "3",
    name: "Eddy Cue",
    initials: "EC",
    phoneNumber: "+1 (408) 555-0102",
    avatarColor: "#FF3B30",
  },
  {
    id: "4",
    name: "Phil Schiller",
    initials: "PS",
    phoneNumber: "+1 (408) 555-0103",
    avatarColor: "#34C759",
  },
  {
    id: "5",
    name: "Katherine Adams",
    initials: "KA",
    phoneNumber: "+1 (408) 555-0104",
    avatarColor: "#AF52DE",
  },
  {
    id: "6",
    name: "Deirdre O'Brien",
    initials: "DO",
    phoneNumber: "+1 (408) 555-0105",
    avatarColor: "#FF2D55",
  },
  {
    id: "7",
    name: "Jeff Williams",
    initials: "JW",
    phoneNumber: "+1 (408) 555-0106",
    avatarColor: "#007AFF",
  },
  {
    id: "8",
    name: "Luca Maestri",
    initials: "LM",
    phoneNumber: "+1 (408) 555-0107",
    avatarColor: "#5AC8FA",
  },
  {
    id: "9",
    name: "Mom",
    initials: "M",
    phoneNumber: "+1 (334) 555-0101",
    avatarColor: "#FF2D55",
  },
  {
    id: "10",
    name: "Steve Jobs",
    initials: "SJ",
    phoneNumber: "+1 (408) 555-0001",
    avatarColor: "#1C1C1E",
  },
  {
    id: "ai",
    name: "AI",
    initials: "AI",
    phoneNumber: "Apple Intelligence",
    avatarColor: "#000000",
  },
];

// AI Contact
export const aiContact = contacts.find((c) => c.id === "ai")!;

// AI Conversation - special conversation that uses real AI
export const aiConversation: Conversation = {
  id: "ai-conv",
  contact: aiContact,
  messages: [
    {
      id: "ai-intro",
      text: "I'm an AI. Ask me anything.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isFromMe: false,
      isRead: true,
      isDelivered: true,
    },
  ],
  lastMessagePreview: "I'm an AI. Ask me anything.",
  lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
  unreadCount: 0,
  isPinned: true,
  isAI: true,
};

// Generate conversations with realistic messages
export const conversations: Conversation[] = [
  aiConversation,
  {
    id: "conv1",
    contact: contacts[0], // Craig Federighi
    messages: [
      {
        id: "m1",
        text: "Tim, the iOS 18 demo is ready for tomorrow's keynote 🎉",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Excellent! The new customization features look incredible. Hair looking good too 😄",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m3",
        text: "Ha! The team worked really hard on this one. You're going to love the AI features.",
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m4",
        text: "Apple Intelligence is going to change everything. See you at rehearsal at 6am!",
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview:
      "Apple Intelligence is going to change everything. See you at rehearsal at 6am!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 2),
    unreadCount: 0,
    isPinned: true,
    isTyping: true,
  },
  {
    id: "conv2",
    contact: contacts[6], // Jeff Williams
    messages: [
      {
        id: "m1",
        text: "The Vision Pro production numbers are exceeding expectations",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Great news! What's the current run rate?",
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m3",
        text: "We're at 400K units per quarter now. Supply chain is solid.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview:
      "We're at 400K units per quarter now. Supply chain is solid.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 25),
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: "conv3",
    contact: contacts[8], // Mom
    messages: [
      {
        id: "m1",
        text: "Honey, I saw you on TV yesterday! You looked wonderful 💕",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Thanks Mom! It was a big announcement day.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m3",
        text: "Don't forget to eat! And get some sleep! 😴",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m4",
        text: "I will Mom! Love you ❤️",
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview: "I will Mom! Love you ❤️",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 55),
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: "conv4",
    contact: contacts[2], // Eddy Cue
    messages: [
      {
        id: "m1",
        text: "The new Apple TV+ shows are tracking really well",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Severance Season 2?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.8),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m3",
        text: "🔥 The numbers are incredible. Best premiere we've ever had.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        isFromMe: false,
        isRead: false,
        isDelivered: true,
      },
    ],
    lastMessagePreview:
      "🔥 The numbers are incredible. Best premiere we've ever had.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    unreadCount: 1,
    isPinned: false,
  },
  {
    id: "conv5",
    contact: contacts[7], // Luca Maestri
    messages: [
      {
        id: "m1",
        text: "Q4 earnings call prep deck is ready for your review",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Perfect, I'll review it tonight. Services revenue looking good?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m3",
        text: "Record quarter 📈",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview: "Record quarter 📈",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 4),
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: "conv6",
    contact: contacts[4], // Katherine Adams
    messages: [
      {
        id: "m1",
        text: "EU DMA compliance docs are finalized",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Thank you Katherine. The team did excellent work navigating this.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview:
      "Thank you Katherine. The team did excellent work navigating this.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 7),
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: "conv7",
    contact: contacts[3], // Phil Schiller
    messages: [
      {
        id: "m1",
        text: "App Store review times are down to 24 hours average now!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Impressive improvement. Developers are going to be happy.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview:
      "Impressive improvement. Developers are going to be happy.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 23),
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: "conv8",
    contact: contacts[1], // Jony Ive
    messages: [
      {
        id: "m1",
        text: "Tim, it was wonderful catching up in London last week",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Always great to see you Jony. The new LoveFrom projects look beautiful.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m3",
        text: "Miss the team. Give everyone my best! 🙏",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview: "Miss the team. Give everyone my best! 🙏",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 46),
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: "conv9",
    contact: contacts[5], // Deirdre O'Brien
    messages: [
      {
        id: "m1",
        text: "New retail store designs approved for Tokyo and Mumbai",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m2",
        text: "Exciting! When's the Tokyo opening?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71),
        isFromMe: true,
        isRead: true,
        isDelivered: true,
      },
      {
        id: "m3",
        text: "Targeting March next year. It's going to be stunning.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70),
        isFromMe: false,
        isRead: true,
        isDelivered: true,
      },
    ],
    lastMessagePreview: "Targeting March next year. It's going to be stunning.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 70),
    unreadCount: 0,
    isPinned: false,
  },
];

// Helper to format time for message list
export function formatMessageTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    // Today - show time
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(" ", "");
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  }
}

// Helper to format time for individual messages
export function formatBubbleTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
