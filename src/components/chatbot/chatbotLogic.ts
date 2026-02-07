import { Message } from "./ChatMessage";

// Service categories for quick replies
export const SERVICE_CATEGORIES = [
  "CCTV/Security",
  "Solar",
  "Electrical",
  "Gates/Fencing",
  "Inverter",
  "Satellite",
  "Street Lights",
];

export const QUICK_REPLIES = [
  ...SERVICE_CATEGORIES,
  "Get a Quote",
  "Call Now",
];

// Qualifying questions by category - exported for use in ChatbotWindow
export const QUALIFYING_FLOWS: Record<string, { questions: string[]; service: string }> = {
  "CCTV/Security": {
    questions: [
      "Is this for a home or business?",
      "How many cameras are you considering?",
      "Do you need remote monitoring via your phone?",
    ],
    service: "smart-security",
  },
  "Solar": {
    questions: [
      "What's your average monthly electricity bill?",
      "Do you need battery backup for nighttime?",
      "Do you have rooftop or ground space for panels?",
    ],
    service: "solar-energy-installation",
  },
  "Electrical": {
    questions: [
      "Is this a new installation or a repair?",
      "Is it for a residential or commercial property?",
      "Is this urgent?",
    ],
    service: "general-electrical",
  },
  "Gates/Fencing": {
    questions: [
      "Do you want automatic or manual gate?",
      "Do you need intercom integration?",
      "What's the approximate perimeter size?",
    ],
    service: "electronic-gate-installation",
  },
  "Inverter": {
    questions: [
      "What appliances do you want to power during outages?",
      "Do you prefer lithium or lead-acid batteries?",
      "Is this a new installation or repair?",
    ],
    service: "inverter-installation-repairs",
  },
  "Satellite": {
    questions: [
      "Which TV provider are you using (DSTV, GOtv, StarTimes)?",
      "Do you need multi-room setup?",
    ],
    service: "satellite-installation",
  },
  "Street Lights": {
    questions: [
      "How many lights do you need?",
      "Is this for a residential compound or commercial area?",
    ],
    service: "solar-street-lights",
  },
};

// Safety refusals
const DIY_KEYWORDS = ["how to wire", "diy electrical", "how do i install", "wire myself", "connect wires", "electrical diagram", "wiring diagram"];

function containsDIYRequest(message: string): boolean {
  const lower = message.toLowerCase();
  return DIY_KEYWORDS.some(keyword => lower.includes(keyword));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getInitialMessages(): Message[] {
  return [
    {
      id: generateId(),
      role: "assistant",
      content: "👋 Hi! I'm STIL's AI assistant. I can help you find the right service for your needs—whether it's CCTV, solar, electrical work, gates, or more.\n\nWhat can I help you with today?",
      quickReplies: QUICK_REPLIES,
    },
  ];
}

interface ConversationState {
  currentCategory?: string;
  questionIndex: number;
  answers: string[];
  collectingLead: boolean;
  leadData: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export function processUserMessage(
  userMessage: string,
  state: ConversationState
): { response: Message; newState: ConversationState } {
  const message = userMessage.trim();
  const lowerMessage = message.toLowerCase();
  
  // Safety refusal for DIY electrical
  if (containsDIYRequest(message)) {
    return {
      response: {
        id: generateId(),
        role: "assistant",
        content: "⚠️ I'm sorry, but I can't provide DIY electrical wiring guidance. Electrical work is dangerous and should only be done by certified professionals.\n\nFor your safety, please call our team—we'll handle it properly and ensure everything is up to code.",
        quickReplies: QUICK_REPLIES,
      },
      newState: { ...state, currentCategory: undefined, questionIndex: 0, answers: [] },
    };
  }

  // Handle "Call Now" quick reply
  if (lowerMessage === "call now") {
    return {
      response: {
        id: generateId(),
        role: "assistant",
        content: "Great choice! Calling is the fastest way to get help. Our team is ready to assist you.",
        quickReplies: SERVICE_CATEGORIES,
      },
      newState: state,
    };
  }

  // Handle "Get a Quote" quick reply
  if (lowerMessage === "get a quote") {
    return {
      response: {
        id: generateId(),
        role: "assistant",
        content: "To get you the best quote, I need to know a bit more.\n\nWhich service are you interested in?",
        quickReplies: SERVICE_CATEGORIES,
      },
      newState: { ...state, collectingLead: false },
    };
  }

  // Check if user selected a category
  const selectedCategory = SERVICE_CATEGORIES.find(
    cat => lowerMessage.includes(cat.toLowerCase().replace("/", "")) || 
           lowerMessage === cat.toLowerCase()
  );

  if (selectedCategory || state.currentCategory) {
    const category = selectedCategory || state.currentCategory!;
    const flow = QUALIFYING_FLOWS[category];
    
    if (!flow) {
      return {
        response: {
          id: generateId(),
          role: "assistant",
          content: "I'd be happy to help with that! For the best service, I recommend speaking directly with our team.",
          quickReplies: QUICK_REPLIES,
        },
        newState: state,
      };
    }

    // If just selected category, start qualifying questions
    if (selectedCategory && !state.currentCategory) {
      return {
        response: {
          id: generateId(),
          role: "assistant",
          content: `Great! Let me help you with ${category}.\n\n${flow.questions[0]}`,
          quickReplies: ["Call Now"],
        },
        newState: { 
          ...state, 
          currentCategory: category, 
          questionIndex: 0, 
          answers: [],
        },
      };
    }

    // User answering qualifying questions
    const newAnswers = [...state.answers, message];
    const nextQuestionIndex = state.questionIndex + 1;

    if (nextQuestionIndex < flow.questions.length) {
      return {
        response: {
          id: generateId(),
          role: "assistant",
          content: `Got it! ${flow.questions[nextQuestionIndex]}`,
          quickReplies: ["Call Now"],
        },
        newState: {
          ...state,
          questionIndex: nextQuestionIndex,
          answers: newAnswers,
        },
      };
    }

    // All questions answered - provide recommendation
    return {
      response: {
        id: generateId(),
        role: "assistant",
        content: `Based on your needs, I recommend our ${category.replace("/", " / ")} service. Our team can provide a detailed quote and site survey.\n\nWe serve Abuja (FCT) and surrounding FCT areas.\n\n🔹 **Call Now** for the fastest response\n🔹 Or tap "Get a Quote" to fill out the form`,
        quickReplies: ["Call Now", "Get a Quote", ...SERVICE_CATEGORIES],
      },
      newState: {
        ...state,
        currentCategory: undefined,
        questionIndex: 0,
        answers: [],
      },
    };
  }

  // Default response
  return {
    response: {
      id: generateId(),
      role: "assistant",
      content: "I can help you with:\n\n• CCTV & Security Systems\n• Solar Energy Installation\n• Electrical Services\n• Gates & Fencing\n• Inverter Systems\n• Satellite Installation\n• Solar Street Lights\n\nWhich service interests you?",
      quickReplies: QUICK_REPLIES,
    },
    newState: state,
  };
}

export const initialConversationState: ConversationState = {
  currentCategory: undefined,
  questionIndex: 0,
  answers: [],
  collectingLead: false,
  leadData: {},
};
