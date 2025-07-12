import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  MessageCircle,
  Brain,
  Send,
  Mic,
  Menu,
  X,
  Smile,
  Frown,
  Meh,
  Clock,
  Activity,
  Shield,
  Users,
  Star,
  ChevronDown,
  Plus,
  LogOut,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  time: string;
  suggestions?: string[];
  mood?: string;
  category?: string;
}

interface MoodEntry {
  mood: string;
  intensity: number;
  time: string;
  notes?: string;
}

export default function Index() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let suggestions: string[] = [];
    let category = "general";

    // Mental health response logic
    if (
      lowerMessage.includes("anxious") ||
      lowerMessage.includes("anxiety") ||
      lowerMessage.includes("worried") ||
      lowerMessage.includes("nervous")
    ) {
      response =
        "I understand you're feeling anxious. Anxiety is a common experience, and you're not alone. Here are some techniques that might help: deep breathing, grounding exercises, or progressive muscle relaxation. Would you like me to guide you through any of these?";
      suggestions = [
        "Breathing exercise",
        "Grounding technique",
        "Progressive muscle relaxation",
        "Tell me more about anxiety",
      ];
      category = "anxiety";
    } else if (
      lowerMessage.includes("sad") ||
      lowerMessage.includes("depressed") ||
      lowerMessage.includes("down") ||
      lowerMessage.includes("low")
    ) {
      response =
        "I'm sorry you're feeling this way. It takes courage to reach out when you're struggling. Remember that these feelings are temporary, even though they feel overwhelming right now. What's been weighing on your mind lately?";
      suggestions = [
        "I feel hopeless",
        "Nothing interests me",
        "I'm tired all the time",
        "Mood tracking",
      ];
      category = "depression";
    } else if (
      lowerMessage.includes("work stress") ||
      lowerMessage.includes("too much workload") ||
      lowerMessage.includes("difficult boss") ||
      lowerMessage.includes("toxic colleagues") ||
      lowerMessage.includes("long hours") ||
      lowerMessage.includes("overtime") ||
      lowerMessage.includes("job insecurity") ||
      lowerMessage.includes("lack of recognition") ||
      lowerMessage.includes("micromanaging") ||
      lowerMessage.includes("unrealistic expectations") ||
      lowerMessage.includes("poor communication") ||
      lowerMessage.includes("verbal aggression") ||
      lowerMessage.includes("workplace boundaries") ||
      lowerMessage.includes("dealing with difficult colleagues") ||
      lowerMessage.includes("work-life balance") ||
      lowerMessage.includes("mindfulness at work")
    ) {
      // Deep work stress conversation flow
      if (
        lowerMessage.includes("work stress") &&
        !lowerMessage.includes("too much") &&
        !lowerMessage.includes("difficult") &&
        !lowerMessage.includes("toxic")
      ) {
        response =
          "I understand work can be really challenging. Let's explore what's specifically causing you stress so I can provide the most helpful guidance. What aspect of work is affecting you most right now?";
        suggestions = [
          "Too much workload",
          "Difficult boss/manager",
          "Toxic colleagues",
          "Long hours/overtime",
          "Job insecurity",
          "Lack of recognition",
        ];
        category = "work-deep";
      } else if (
        lowerMessage.includes("too much workload") ||
        lowerMessage.includes("workload")
      ) {
        response =
          "Heavy workloads can feel overwhelming and lead to burnout. I want to help you develop specific strategies based on what you're experiencing.\n\nLet's dig deeper - what's the main challenge with your workload right now?";
        suggestions = [
          "Impossible deadlines that stress me out",
          "Too many projects happening at once",
          "Unclear priorities from management",
          "Constantly interrupted so can't focus",
          "Working nights and weekends regularly",
          "No time for breaks during the day",
        ];
        category = "workload";
      } else if (
        lowerMessage.includes("difficult boss") ||
        (lowerMessage.includes("manager") && !lowerMessage.includes("talk to"))
      ) {
        response =
          "Dealing with a difficult manager can be extremely stressful and impact your mental health. This is one of the most common workplace stressors. Let's dig deeper to understand exactly what's happening so I can give you specific strategies.\n\nWhat specific behaviors from your manager are causing you the most stress right now?";
        suggestions = [
          "Micromanaging my every move",
          "Setting unrealistic expectations",
          "Poor communication style",
          "Lack of support when I need help",
          "Verbal aggression or hostility",
          "Takes credit for my work",
        ];
        category = "difficult-boss";
      } else if (
        lowerMessage.includes("toxic colleagues") ||
        lowerMessage.includes("colleagues")
      ) {
        response =
          "Toxic workplace relationships can create significant stress. Here's how to protect your mental health: 1) Limit interactions to work-only topics, 2) Don't take their behavior personally, 3) Build alliances with positive colleagues, 4) Consider speaking with HR if it affects your work. What type of toxic behavior are you experiencing?";
        suggestions = [
          "Gossip and drama",
          "Bullying behavior",
          "Undermining my work",
          "Exclusion from team",
          "Competition and sabotage",
        ];
        category = "toxic-colleagues";
      } else if (
        lowerMessage.includes("long hours") ||
        lowerMessage.includes("overtime")
      ) {
        response =
          "Excessive work hours can severely impact your mental and physical health. Let's address this: 1) Track your actual hours worked, 2) Identify tasks that could be delegated or eliminated, 3) Practice saying 'no' to non-essential requests, 4) Set firm boundaries around your availability. Are the long hours due to company culture or your own difficulty setting boundaries?";
        suggestions = [
          "Company expects long hours",
          "I can't say no to requests",
          "Too much on my plate",
          "Fear of falling behind",
        ];
        category = "long-hours";
      } else if (
        lowerMessage.includes("job insecurity") ||
        lowerMessage.includes("insecurity")
      ) {
        response =
          "Job insecurity creates chronic stress and anxiety. Let's work on both practical and emotional strategies: 1) Update your resume and LinkedIn, 2) Build your professional network, 3) Develop new skills, 4) Create an emergency fund, 5) Practice mindfulness to manage anxiety. What's making you feel most insecure about your position?";
        suggestions = [
          "Company layoffs/downsizing",
          "Performance concerns",
          "Industry changes",
          "Contract/temporary position",
        ];
        category = "job-insecurity";
      } else if (
        lowerMessage.includes("lack of recognition") ||
        lowerMessage.includes("recognition")
      ) {
        response =
          "Feeling unrecognized at work can be demoralizing and affect your self-worth. Strategies to address this: 1) Keep a 'wins' journal of your accomplishments, 2) Proactively communicate your achievements to your manager, 3) Seek feedback regularly, 4) Find recognition in your own growth and learning. Have you tried discussing your need for feedback with your supervisor?";
        suggestions = [
          "How to self-advocate",
          "Documenting achievements",
          "Finding internal motivation",
          "Career development conversation",
        ];
        category = "no-recognition";
      } else {
        response =
          "Work-related stress is very common. It's important to maintain healthy boundaries and find ways to decompress. Let me help you identify the specific areas that are causing you stress so we can work on targeted solutions.";
        suggestions = [
          "Too much workload",
          "Difficult boss/manager",
          "Toxic colleagues",
          "Long hours/overtime",
          "Job insecurity",
        ];
        category = "work";
      }
    } else if (
      lowerMessage.includes("work") ||
      lowerMessage.includes("job") ||
      lowerMessage.includes("career")
    ) {
      response =
        "I can help you with work-related concerns. Work stress affects many people and there are effective strategies we can explore together. What specifically about work is bothering you?";
      suggestions = [
        "Work stress",
        "Workplace relationships",
        "Career concerns",
        "Work-life balance",
      ];
      category = "work-general";
    } else if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("overwhelmed") ||
      lowerMessage.includes("pressure")
    ) {
      response =
        "Stress can feel overwhelming, but there are effective ways to manage it. Let's break down what's causing your stress and develop some coping strategies. Are you dealing with work stress, relationship issues, or something else?";
      suggestions = [
        "Work stress",
        "Relationship stress",
        "Financial stress",
        "Time management tips",
      ];
      category = "stress";
    } else if (
      lowerMessage.includes("breathing") ||
      lowerMessage.includes("breathe")
    ) {
      response =
        "Great choice! Breathing exercises are very effective for managing anxiety and stress. Let's try the 4-7-8 technique: Breathe in for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat this 4 times. Should I guide you through this step by step?";
      suggestions = [
        "Yes, guide me",
        "Different breathing technique",
        "Why does this work?",
        "More relaxation exercises",
      ];
      category = "breathing";
    } else if (
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("insomnia") ||
      lowerMessage.includes("tired")
    ) {
      response =
        "Sleep issues can significantly impact your mental health. Good sleep hygiene is crucial for emotional well-being. Some tips include: maintaining a regular sleep schedule, avoiding screens before bed, and creating a calming bedtime routine. What's been affecting your sleep?";
      suggestions = [
        "Can't fall asleep",
        "Wake up during night",
        "Nightmares",
        "Sleep hygiene tips",
      ];
      category = "sleep";
    } else if (
      lowerMessage.includes("relationship") ||
      lowerMessage.includes("partner") ||
      lowerMessage.includes("family")
    ) {
      response =
        "Relationships can be both a source of joy and stress. Healthy communication and setting boundaries are key to maintaining good relationships. What aspect of your relationships is concerning you most?";
      suggestions = [
        "Communication issues",
        "Setting boundaries",
        "Conflict resolution",
        "Family dynamics",
      ];
      category = "relationships";
    } else if (
      lowerMessage.includes("mood") ||
      lowerMessage.includes("track") ||
      lowerMessage.includes("feeling")
    ) {
      response =
        "Tracking your mood can provide valuable insights into patterns and triggers. I can help you start a mood journal. Would you like to record how you're feeling right now?";
      suggestions = [
        "Track current mood",
        "View mood history",
        "Mood patterns",
        "Triggers identification",
      ];
      category = "mood";
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("crisis")
    ) {
      response =
        "I'm here to support you, but if you're in crisis or having thoughts of self-harm, please reach out to a crisis helpline immediately. In the US: 988 Suicide & Crisis Lifeline. For non-crisis support, I'm here to listen and provide coping strategies. What kind of help are you looking for today?";
      suggestions = [
        "Coping strategies",
        "Professional resources",
        "Emergency contacts",
        "Daily self-care",
      ];
      category = "crisis";
    } else if (lowerMessage.includes("micromanaging")) {
      response =
        "Micromanaging can feel suffocating and damage your confidence. Here's how to handle it: 1) Proactively communicate your progress with regular updates, 2) Ask for specific expectations upfront, 3) Request feedback on your preferred communication style, 4) Build trust by consistently delivering quality work. Remember, micromanaging often stems from the manager's anxiety, not your performance.";
      suggestions = [
        "How to build trust with manager",
        "Setting communication expectations",
        "Dealing with anxiety from micromanaging",
        "When to escalate to HR",
      ];
      category = "micromanaging";
    } else if (lowerMessage.includes("unrealistic expectations")) {
      response =
        "Unrealistic expectations create constant stress and can lead to burnout. Steps to address this: 1) Document what's being asked and realistic timelines, 2) Propose alternative solutions or timelines, 3) Communicate early about potential delays, 4) Focus on quality over impossible speed. Have you tried having a conversation about workload and priorities?";
      suggestions = [
        "How to negotiate deadlines",
        "Presenting alternative solutions",
        "Managing perfectionism",
        "Setting realistic goals",
      ];
      category = "unrealistic-expectations";
    } else if (lowerMessage.includes("poor communication")) {
      response =
        "Poor communication from leadership creates uncertainty and stress. You can improve the situation by: 1) Asking specific questions to clarify expectations, 2) Following up important conversations with email summaries, 3) Requesting regular check-ins, 4) Being clear about what information you need to succeed. Focus on what you can control in these interactions.";
      suggestions = [
        "Asking better questions",
        "Email communication strategies",
        "Requesting regular feedback",
        "Dealing with unclear instructions",
      ];
      category = "poor-communication";
    } else if (
      lowerMessage.includes("verbal aggression") ||
      lowerMessage.includes("aggression")
    ) {
      response =
        "Verbal aggression in the workplace is unacceptable and can be traumatic. This is serious and you deserve a safe work environment. Steps to take: 1) Document every incident with dates and details, 2) Report to HR or your manager's supervisor, 3) Seek support from trusted colleagues, 4) Consider speaking with a therapist about the impact. Your mental health and safety matter more than any job.";
      suggestions = [
        "How to document incidents",
        "Reporting to HR process",
        "Dealing with workplace trauma",
        "Finding emotional support",
        "Know your rights",
      ];
      category = "verbal-aggression";
    } else if (
      lowerMessage.includes("gossip") ||
      lowerMessage.includes("drama")
    ) {
      response =
        "Workplace gossip and drama can create a toxic environment that affects your mental health. Protect yourself by: 1) Refusing to participate in gossip, 2) Redirecting conversations to work topics, 3) Building relationships with positive colleagues, 4) Focusing on your own work and goals. Remember, people who gossip to you will gossip about you.";
      suggestions = [
        "How to redirect gossip conversations",
        "Building positive relationships",
        "Staying focused on work goals",
        "Dealing with being gossiped about",
      ];
      category = "workplace-gossip";
    } else if (lowerMessage.includes("bullying")) {
      response =
        "Workplace bullying is a serious issue that can severely impact your mental health. You don't have to tolerate this behavior. Action steps: 1) Keep detailed records of incidents, 2) Report to HR and management, 3) Seek support from trusted colleagues, 4) Consider legal consultation if necessary, 5) Prioritize your mental health and consider therapy. Remember, this is about the bully's issues, not your worth.";
      suggestions = [
        "Documenting bullying behavior",
        "Reporting process and rights",
        "Building support network",
        "Protecting your mental health",
        "Legal options available",
      ];
      category = "workplace-bullying";
    } else if (lowerMessage.includes("impossible deadlines")) {
      response =
        "Impossible deadlines create chronic stress and can make you feel like you're always failing. Here's how to handle this: 1) Break down exactly what's being asked and realistic timelines, 2) Present data on what's achievable, 3) Propose alternative solutions or phased delivery, 4) Communicate early about challenges.\n\nHave you tried having a conversation with your manager about realistic timelines?";
      suggestions = [
        "How to calculate realistic timelines",
        "Presenting data to manager",
        "Proposing alternative solutions",
        "What if manager won't listen?",
      ];
      category = "impossible-deadlines";
    } else if (lowerMessage.includes("too many projects at once")) {
      response =
        "Juggling multiple projects simultaneously is mentally exhausting and reduces the quality of your work. Let's work on strategies: 1) Use a project prioritization matrix, 2) Request clarity on which projects are most critical, 3) Propose a more sustainable project timeline, 4) Use time-blocking to focus on one project at a time.\n\nHow many active projects are you currently managing?";
      suggestions = [
        "Help me prioritize my projects",
        "How to request fewer projects",
        "Time-blocking for multiple projects",
        "Dealing with context switching",
      ];
      category = "multiple-projects";
    } else if (lowerMessage.includes("micromanaging my every move")) {
      response =
        "Micromanaging can feel suffocating and erode your confidence. This often stems from your manager's anxiety, not your performance. Strategies: 1) Proactively provide updates before they ask, 2) Ask for specific check-in schedules, 3) Request clear expectations upfront, 4) Demonstrate reliability consistently.\n\nHow often is your manager checking in on your work?";
      suggestions = [
        "Creating proactive update schedule",
        "Building trust with micromanager",
        "Setting check-in boundaries",
        "Dealing with confidence issues",
      ];
      category = "micromanaging";
    } else if (lowerMessage.includes("setting unrealistic expectations")) {
      response =
        "Unrealistic expectations create a cycle of stress and potential failure. Your manager may not understand the complexity of your work. Approach: 1) Document what's being asked with detailed requirements, 2) Break down realistic timelines with rationale, 3) Propose what IS achievable in the timeframe, 4) Use past examples as evidence.\n\nAre these expectations around time, quality, or both?";
      suggestions = [
        "How to break down realistic timelines",
        "Using past examples as evidence",
        "Negotiating scope vs timeline",
        "What if they insist it's possible?",
      ];
      category = "unrealistic-expectations";
    } else if (
      lowerMessage.includes("exercise") ||
      lowerMessage.includes("meditation") ||
      lowerMessage.includes("mindfulness")
    ) {
      response =
        "Physical activity and mindfulness practices are excellent for mental health! Regular exercise releases endorphins, and meditation can help reduce stress and improve focus. What type of activities interest you most?";
      suggestions = [
        "5-minute meditation",
        "Gentle yoga",
        "Walking routine",
        "Mindfulness exercises",
      ];
      category = "wellness";
    } else if (
      lowerMessage.includes("prioritize tasks") ||
      lowerMessage.includes("time management")
    ) {
      response =
        "Effective prioritization can dramatically reduce work stress. Try the Eisenhower Matrix: 1) Urgent & Important (do first), 2) Important but not urgent (schedule), 3) Urgent but not important (delegate), 4) Neither (eliminate). Also try time-blocking: assign specific time slots to different types of work. Would you like me to help you categorize your current tasks?";
      suggestions = [
        "Help me categorize my tasks",
        "Time-blocking techniques",
        "Delegation strategies",
        "Saying no to non-essential work",
      ];
      category = "prioritization";
    } else if (
      lowerMessage.includes("talk to manager") ||
      lowerMessage.includes("communicate with manager")
    ) {
      response =
        "Having a productive conversation with your manager about workload requires preparation. Here's a framework: 1) List specific tasks and time requirements, 2) Identify which tasks are most critical to business goals, 3) Propose solutions (delegate, extend deadlines, additional resources), 4) Schedule a calm, private conversation. Focus on solutions, not just problems. Would you like help preparing for this conversation?";
      suggestions = [
        "Help me prepare what to say",
        "How to propose solutions",
        "Best timing for the conversation",
        "What if they don't listen?",
      ];
      category = "manager-conversation";
    } else if (
      lowerMessage.includes("company expects long hours") ||
      lowerMessage.includes("company culture")
    ) {
      response =
        "When long hours are embedded in company culture, it's challenging but not impossible to create boundaries. Strategies: 1) Focus on productivity during core hours, 2) Communicate your availability clearly, 3) Find allies who also want better balance, 4) Lead by example with efficient work habits. Sometimes you may need to consider if this culture aligns with your values long-term.";
      suggestions = [
        "Setting boundaries in toxic culture",
        "Finding allies for change",
        "Improving work efficiency",
        "Evaluating if job is right fit",
      ];
      category = "toxic-culture";
    } else if (
      lowerMessage.includes("can't say no") ||
      lowerMessage.includes("saying no")
    ) {
      response =
        "Learning to say 'no' at work is crucial for your mental health and productivity. Practice these responses: 'I'd love to help, but I'm at capacity with [current priorities],' or 'I can take this on if we can push back [other deadline].' Remember: saying no to one thing means saying yes to something more important (including your wellbeing).";
      suggestions = [
        "Practice scripts for saying no",
        "Proposing alternatives",
        "Overcoming people-pleasing",
        "Building confidence to set boundaries",
      ];
      category = "saying-no";
    } else if (
      lowerMessage.includes("self-advocate") ||
      lowerMessage.includes("documenting achievements")
    ) {
      response =
        "Self-advocacy is essential for career growth and recognition. Keep a 'brag document' - weekly notes of accomplishments, positive feedback, and problems you've solved. During 1:1s and reviews, share specific examples with metrics when possible. Remember: your manager is busy and may not notice everything you do. It's your job to make your contributions visible.";
      suggestions = [
        "Creating a brag document",
        "Sharing wins effectively",
        "Asking for specific feedback",
        "Preparing for performance reviews",
      ];
      category = "self-advocacy";
    } else if (
      lowerMessage.includes("need someone to listen") ||
      lowerMessage.includes("someone to listen")
    ) {
      response =
        "I understand you need someone to talk to right now. Here's a number where you can speak with someone who will listen:\n\n📞 Call: 1234567890\n\nSomeone is available to listen and support you. You don't have to go through this alone.";
      suggestions = [
        "I want to talk more here",
        "Coping strategies",
        "Breathing exercise",
        "Crisis support resources",
      ];
      category = "need-listener";
    } else {
      response =
        "Thank you for sharing that with me. I'm here to listen and support you. Every person's experience is unique, and I want to make sure I understand what you're going through. Can you tell me more about what you're experiencing?";
      suggestions = [
        "I need someone to listen",
        "I'm not sure how I feel",
        "I want coping strategies",
        "Tell me about mental health",
      ];
      category = "general";
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      text: response,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      suggestions,
      category,
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Create user message immediately with the suggestion text
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: suggestion,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Generate bot response using the suggestion text
    setTimeout(() => {
      const botResponse = generateBotResponse(suggestion);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const trackMood = (mood: string, intensity: number) => {
    const moodEntry: MoodEntry = {
      mood,
      intensity,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMoodHistory((prev) => [...prev, moodEntry]);
    setCurrentMood(mood);
    setShowMoodTracker(false);

    // Send mood tracking response
    const moodMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      text: `Thank you for sharing that you're feeling ${mood}. I've recorded this in your mood journal. Remember, it's okay to have difficult days. Would you like some suggestions for managing your current mood?`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      suggestions: [
        "Coping strategies",
        "Breathing exercise",
        "View mood patterns",
        "Talk about it",
      ],
      mood,
    };
    setMessages((prev) => [...prev, moodMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 via-background to-healing-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-calm-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-calm-700 to-serenity-700 bg-clip-text text-transparent">
                MindSpace
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-foreground/70">
                <Activity className="h-4 w-4" />
                <span>Mental Health Support</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground/70">
                <Shield className="h-4 w-4" />
                <span>Confidential</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground/70">
                  Welcome, {user?.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-calm-200">
              <div className="flex flex-col space-y-3 text-sm">
                <div className="text-foreground font-medium">
                  Welcome, {user?.name}
                </div>
                <div className="flex items-center space-x-2 text-foreground/70">
                  <Activity className="h-4 w-4" />
                  <span>Mental Health Support</span>
                </div>
                <div className="flex items-center space-x-2 text-foreground/70">
                  <Shield className="h-4 w-4" />
                  <span>Confidential & Secure</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2 w-fit"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Chat Interface */}
      <div className="max-w-4xl mx-auto min-h-[calc(100vh-64px)] flex flex-col bg-white/50 backdrop-blur-sm rounded-lg border border-calm-200 shadow-lg my-4">
        {/* Chat Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-calm-200 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  Mental Health Assistant
                </h2>
                <p className="text-sm text-foreground/70">
                  Online • Here to support you
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMoodTracker(!showMoodTracker)}
                className="hidden sm:flex"
              >
                <Smile className="h-4 w-4 mr-2" />
                Track Mood
              </Button>
              {currentMood && (
                <Badge
                  variant="secondary"
                  className="bg-healing-100 text-healing-700"
                >
                  Current: {currentMood}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Mood Tracker Popup */}
        {showMoodTracker && (
          <div className="bg-white border-b border-calm-200 p-4">
            <h3 className="font-medium mb-3">How are you feeling right now?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { mood: "Happy", icon: "😊", color: "healing" },
                { mood: "Calm", icon: "😌", color: "calm" },
                { mood: "Anxious", icon: "😰", color: "serenity" },
                { mood: "Sad", icon: "😢", color: "muted" },
                { mood: "Stressed", icon: "😣", color: "destructive" },
              ].map((item) => (
                <Button
                  key={item.mood}
                  variant="outline"
                  className="flex flex-col h-16 text-xs"
                  onClick={() => trackMood(item.mood, 5)}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  {item.mood}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <ScrollArea className="flex-1 min-h-[400px] max-h-[500px]">
          <div className="p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm lg:max-w-md ${message.type === "user" ? "order-1" : ""}`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-calm-500 to-serenity-500 text-white ml-4"
                        : "bg-white border border-calm-100 mr-4 shadow-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.text}
                    </p>
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs bg-white/90 border-calm-200 hover:bg-calm-50 transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-xs text-foreground/50 mt-1 ${
                      message.type === "user" ? "text-right mr-4" : "ml-4"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
                {message.type === "bot" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-full flex items-center justify-center text-white text-sm font-semibold order-first mr-3 mt-1 flex-shrink-0 shadow-lg">
                    🤖
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3 mt-1 shadow-lg">
                  🤖
                </div>
                <div className="bg-white border border-calm-100 rounded-2xl p-4 mr-4 shadow-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-calm-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-calm-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-calm-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white/90 backdrop-blur-md border-t border-calm-200 p-4 rounded-b-lg">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... I'm here to listen and support you."
                className="w-full p-3 pr-12 bg-calm-50 border border-calm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-calm-300 focus:border-transparent resize-none shadow-sm"
                disabled={isTyping}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-calm-500 hover:text-calm-600"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="h-12 w-12 p-0 bg-gradient-to-r from-calm-500 to-serenity-500 hover:from-calm-600 hover:to-serenity-600 rounded-xl shadow-lg transition-all"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "I need someone to listen",
              "Work stress",
              "Breathing exercise",
              "I'm feeling anxious",
            ].map((quick) => (
              <Button
                key={quick}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-calm-50 border-calm-200 hover:bg-calm-100 transition-colors"
                onClick={() => handleSuggestionClick(quick)}
              >
                {quick}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Crisis Resources Footer */}
      <div className="bg-muted/50 border-t border-calm-200 p-3 text-center text-xs text-foreground/70">
        <p>
          🆘 <strong>Crisis Support:</strong> If you're having thoughts of
          self-harm, call 988 (US) or your local emergency services immediately.
        </p>
      </div>
    </div>
  );
}
