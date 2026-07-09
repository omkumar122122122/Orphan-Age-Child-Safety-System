import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiBell,
  FiBookOpen,
  FiChevronDown,
  FiCopy,
  FiFileText,
  FiHelpCircle,
  FiInfo,
  FiLink,
  FiMessageCircle,
  FiMic,
  FiPaperclip,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiShield,
  FiZap
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { classNames } from "../utils/formatters";

const recentChats = [
  "Am I eligible to adopt?",
  "Required documents",
  "Adoption timeline",
  "Visit request help",
  "Child welfare monitoring",
  "Government guidelines"
];

const quickQuestions = [
  "Am I eligible to adopt?",
  "What documents are required?",
  "How does adoption work?",
  "How long does adoption take?",
  "Can I adopt as a single parent?",
  "How do I visit an orphanage?",
  "What happens after adoption?",
  "Child welfare monitoring"
];

const faqs = [
  {
    question: "Who can adopt?",
    answer: "Eligibility depends on official rules, age, health, financial stability, background checks, and suitability review by authorized officers."
  },
  {
    question: "How long is the adoption process?",
    answer: "Timelines vary by verification, document review, matching, counselling, legal steps, and welfare authority approvals."
  },
  {
    question: "Which documents are needed?",
    answer: "Common documents include identity proof, address proof, income proof, photographs, health details, family information, and declarations requested by the authority."
  },
  {
    question: "Can I adopt a child from another state?",
    answer: "Inter-state adoption may be possible through official procedures. The portal can guide next steps, but an administrator must review case-specific requirements."
  },
  {
    question: "What is post-adoption monitoring?",
    answer: "It is a scheduled welfare follow-up process that checks the child's health, education, safety, adjustment, and family support after adoption."
  }
];

const responseBank = [
  {
    keys: ["eligible", "eligibility", "single parent"],
    response:
      "Eligibility is usually reviewed through age, health, financial stability, family environment, identity verification, background checks, and readiness to provide safe long-term care. YourSathi can guide you through these points, but it cannot make a legal eligibility decision."
  },
  {
    keys: ["document", "documents", "required"],
    response:
      "Commonly requested documents include identity proof, address proof, income proof, family details, recent photographs, health records, and declarations requested by the child welfare authority. The exact checklist can vary by case and should be confirmed in the portal."
  },
  {
    keys: ["process", "how does adoption work", "adoption work"],
    response:
      "A typical adoption flow includes parent registration, KYC verification, document review, orphanage or child profile visit steps, counselling, legal scrutiny, approval by competent authorities, and post-adoption welfare monitoring."
  },
  {
    keys: ["visit", "orphanage visit"],
    response:
      "To request an orphanage visit, use the Visit Request section in the Parent Portal, select an available orphanage and slot, submit the request, and wait for confirmation from the administrator or welfare officer."
  },
  {
    keys: ["rights", "child rights"],
    response:
      "Every child has the right to safety, dignity, privacy, education, health care, emotional support, and protection from harm. Adoption procedures are designed to protect these rights at every stage."
  },
  {
    keys: ["responsibility", "responsibilities"],
    response:
      "Parent responsibilities include providing safe care, supporting education and health needs, cooperating with welfare follow-ups, maintaining accurate records, and reporting urgent concerns to the proper authority."
  },
  {
    keys: ["monitoring", "post-adoption", "after adoption"],
    response:
      "Post-adoption monitoring usually includes scheduled welfare check-ins, health and education updates, family adjustment review, and officer follow-ups. These checks help ensure the child's continued safety and wellbeing."
  },
  {
    keys: ["government", "rules", "guidelines", "legal"],
    response:
      "Government rules define registration, verification, child rights, parent responsibilities, legal review, and monitoring requirements. YourSathi can explain the steps, but official legal decisions come only from authorized authorities."
  },
  {
    keys: ["orphanage", "information"],
    response:
      "Orphanage information can include address, capacity, facilities, visiting hours, available visit slots, and current adoption workflow status. Use official portal listings for the latest verified details."
  }
];

const sideCards = [
  {
    title: "Frequently Asked Questions",
    text: "Eligibility, documents, visits, legal steps, and welfare monitoring.",
    icon: FiHelpCircle
  },
  {
    title: "Recent Notifications",
    text: "Visit slot pending confirmation. Two documents need review.",
    icon: FiBell
  },
  {
    title: "Helpful Resources",
    text: "Adoption checklist, child rights guide, parent responsibilities.",
    icon: FiBookOpen
  }
];

export default function SahayakAI() {
  const [activeChat, setActiveChat] = useState(null);
  const [chatSearch, setChatSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const messagesEndRef = useRef(null);

  const filteredChats = useMemo(
    () => recentChats.filter((chat) => chat.toLowerCase().includes(chatSearch.toLowerCase())),
    [chatSearch]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const getResponse = (message) => {
    const normalized = message.toLowerCase();
    const matched = responseBank.find((item) => item.keys.some((key) => normalized.includes(key)));

    return (
      matched?.response ||
      "I can help explain adoption eligibility, documents, orphanage visits, child welfare monitoring, FAQs, and government guidelines. I am only an AI guide and cannot approve applications or make legal decisions."
    );
  };

  const sendMessage = (message = input) => {
    const text = message.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setActiveChat((current) => current || text);
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", text, time }]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      setTyping(false);
      setMessages((current) => [
        ...current,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: getResponse(text),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 850);
  };

  const startChat = (chat) => {
    setActiveChat(chat);
    setMessages([]);
    sendMessage(chat);
  };

  const newChat = () => {
    setActiveChat(null);
    setMessages([]);
    setInput("");
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={["Parent", "Sahayak AI"]} />

      <div className="overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="grid min-h-[calc(100vh-170px)] lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px]">
          <ChatSidebar
            activeChat={activeChat}
            chats={filteredChats}
            search={chatSearch}
            setSearch={setChatSearch}
            onNewChat={newChat}
            onSelect={startChat}
          />

          <main className="flex min-w-0 flex-col bg-white dark:bg-slate-950">
            <PageHeader />

            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                {messages.length === 0 ? (
                  <WelcomeScreen onSelect={sendMessage} openFaq={openFaq} setOpenFaq={setOpenFaq} />
                ) : (
                  <ChatConversation messages={messages} typing={typing} />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <ChatInput value={input} setValue={setInput} onSend={() => sendMessage()} />
          </main>

          <RightPanel />
        </div>
      </div>
    </div>
  );
}

function ChatSidebar({ activeChat, chats, search, setSearch, onNewChat, onSelect }) {
  return (
    <aside className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:border-b-0 lg:border-r">
      <button
        onClick={onNewChat}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-civic-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-civic-700"
      >
        <FiMessageCircle className="h-4 w-4" />
        New Chat
      </button>

      <label className="mt-4 flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950">
        <FiSearch className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
          placeholder="Search Chats"
        />
      </label>

      <div className="mt-5">
        <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">Recent Chats</p>
        <div className="mt-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat}
              onClick={() => onSelect(chat)}
              className={classNames(
                "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition",
                activeChat === chat
                  ? "bg-white text-civic-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:text-civic-100 dark:ring-slate-800"
                  : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-950 dark:hover:text-white"
              )}
            >
              <FiMessageCircle className="h-4 w-4 shrink-0" />
              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function PageHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">YourSathi</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-civic-50 px-2.5 py-1 text-xs font-extrabold text-civic-700 ring-1 ring-civic-100 dark:bg-civic-600/20 dark:text-civic-100 dark:ring-civic-600/30">
              <FiZap className="h-3.5 w-3.5" />
              AI Powered
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Your AI Adoption & Child Welfare Assistant</p>
        </div>
      </div>
    </header>
  );
}

function WelcomeScreen({ onSelect, openFaq, setOpenFaq }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-5">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-civic-700 shadow-sm dark:bg-slate-900 dark:text-civic-100">
        <FiShield className="h-10 w-10" />
      </div>
      <div className="mt-6 text-center">
        <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">Hello, I'm YourSathi 👋</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          I'm here to help you understand the adoption process, eligibility, documents, orphanage visits, child welfare monitoring and answer your adoption-related questions.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {quickQuestions.map((question) => (
          <button
            key={question}
            onClick={() => onSelect(question)}
            className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-bold text-slate-700 shadow-sm transition hover:border-civic-200 hover:bg-civic-50 hover:text-civic-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {question}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
          <FiInfo className="h-4 w-4 text-civic-600" />
          Start a conversation with YourSathi.
        </div>
        <div className="space-y-2">
          {faqs.map((item, index) => (
            <FaqItem key={item.question} item={item} open={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ChatConversation({ messages, typing }) {
  return (
    <div className="space-y-5 pb-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {typing && <TypingIndicator />}
    </div>
  );
}

function MessageBubble({ message }) {
  const assistant = message.role === "assistant";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={classNames("flex gap-3", assistant ? "justify-start" : "justify-end")}>
      {assistant && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-civic-700 dark:bg-slate-900 dark:text-civic-100">
          <FiShield className="h-4 w-4" />
        </div>
      )}
      <div className={classNames("max-w-[84%]", assistant ? "text-left" : "text-right")}>
        <div
          className={classNames(
            "rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
            assistant
              ? "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              : "bg-civic-600 text-white"
          )}
        >
          {message.text}
        </div>
        <div className={classNames("mt-2 flex items-center gap-2 text-xs text-slate-400", assistant ? "justify-start" : "justify-end")}>
          <span>{message.time}</span>
          {assistant && (
            <>
              <IconButton label="Copy response" icon={FiCopy} />
              <IconButton label="Regenerate response" icon={FiRefreshCw} />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ChatInput({ value, setValue, onSend }) {
  return (
    <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button title="Attach" disabled className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition disabled:opacity-45">
            <FiPaperclip className="h-5 w-5" />
          </button>
          <button title="Voice" type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <FiMic className="h-5 w-5" />
          </button>
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            rows={1}
            placeholder="Ask YourSathi anything..."
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <button
            onClick={onSend}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-civic-600 text-white transition hover:bg-civic-700 disabled:opacity-50"
            disabled={!value.trim()}
            title="Send"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">YourSathi is an AI guide and cannot make legal decisions or approve applications.</p>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <aside className="hidden border-l border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 xl:block">
      <div className="space-y-3">
        {sideCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-civic-700 dark:bg-slate-900 dark:text-civic-100">
                <card.icon className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">{card.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{card.text}</p>
          </div>
        ))}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950 dark:text-white">
            <FiLink className="h-4 w-4 text-civic-600" />
            Helpful Links
          </div>
          <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <p>Adoption process checklist</p>
            <p>Parent responsibility guide</p>
            <p>Visit request instructions</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function FaqItem({ item, open, onClick }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button onClick={onClick} className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left text-sm font-extrabold text-slate-900 dark:text-white">
        {item.question}
        <FiChevronDown className={classNames("h-4 w-4 shrink-0 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 text-sm leading-6 text-slate-600 dark:text-slate-300"
          >
            {item.answer}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-civic-700 dark:bg-slate-900 dark:text-civic-100">
        <FiShield className="h-4 w-4" />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}

function IconButton({ label, icon: Icon }) {
  return (
    <button title={label} type="button" className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100">
      <Icon className="h-4 w-4" />
    </button>
  );
}
