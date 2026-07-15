import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiBell, FiBookOpen, FiChevronDown, FiCopy, FiFileText,
  FiHelpCircle, FiInfo, FiLink, FiMessageCircle, FiMic,
  FiPaperclip, FiRefreshCw, FiSearch, FiSend, FiShield,
  FiZap, FiPlus, FiCheck, FiX
} from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { classNames } from "../utils/formatters";

const recentChats = [
  "Am I eligible to adopt?",
  "Required documents",
  "Adoption timeline",
  "Visit request help",
  "Child welfare monitoring",
  "Government guidelines",
];

const quickQuestions = [
  "Am I eligible to adopt?",
  "What documents are required?",
  "How does adoption work?",
  "How long does adoption take?",
  "Can I adopt as a single parent?",
  "How do I visit an orphanage?",
  "What happens after adoption?",
  "Child welfare monitoring",
];

const faqs = [
  { question: "Who can adopt?", answer: "Eligibility depends on age, health, financial stability, background checks, and suitability review by authorized officers." },
  { question: "How long is the process?", answer: "Timelines vary by verification, document review, matching, counselling, legal steps, and welfare authority approvals." },
  { question: "Which documents are needed?", answer: "Identity proof, address proof, income proof, photographs, health details, family information, and declarations." },
  { question: "Can I adopt from another state?", answer: "Inter-state adoption may be possible through official procedures. An administrator must review case-specific requirements." },
  { question: "What is post-adoption monitoring?", answer: "Scheduled welfare follow-up checking the child's health, education, safety, adjustment, and family support." },
];

const responseBank = [
  { keys: ["eligible","eligibility","single parent"], response: "Eligibility is reviewed through age, health, financial stability, family environment, identity verification, background checks, and readiness to provide safe long-term care. YourSathi can guide you, but cannot make a legal decision." },
  { keys: ["document","documents","required"], response: "Commonly required: identity proof, address proof, income proof, family details, recent photographs, health records, and declarations. The exact checklist varies by case." },
  { keys: ["process","how does adoption work","adoption work"], response: "A typical flow: parent registration → KYC verification → document review → orphanage visit → counselling → legal scrutiny → approval → post-adoption welfare monitoring." },
  { keys: ["visit","orphanage visit"], response: "Use the Visit Request section in the Parent Portal, select an orphanage and slot, submit the request, and await confirmation from the administrator or welfare officer." },
  { keys: ["rights","child rights"], response: "Every child has the right to safety, dignity, privacy, education, health care, emotional support, and protection from harm at every stage of adoption." },
  { keys: ["monitoring","post-adoption","after adoption"], response: "Post-adoption monitoring includes scheduled welfare check-ins, health and education updates, family adjustment reviews, and officer follow-ups." },
  { keys: ["government","rules","guidelines","legal"], response: "Government rules define registration, verification, child rights, parent responsibilities, legal review, and monitoring requirements." },
];

const sideCards = [
  { title: "Frequently Asked Questions", text: "Eligibility, documents, visits, legal steps, and welfare monitoring.", icon: FiHelpCircle },
  { title: "Recent Notifications",       text: "Visit slot pending confirmation. Two documents need review.",        icon: FiBell },
  { title: "Helpful Resources",          text: "Adoption checklist, child rights guide, parent responsibilities.",   icon: FiBookOpen },
];

export default function SahayakAI() {
  const [activeChat, setActiveChat]   = useState(null);
  const [chatSearch, setChatSearch]   = useState("");
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [typing, setTyping]           = useState(false);
  const [openFaq, setOpenFaq]         = useState(-1);
  const messagesEndRef = useRef(null);

  const filteredChats = useMemo(
    () => recentChats.filter((c) => c.toLowerCase().includes(chatSearch.toLowerCase())),
    [chatSearch]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const getResponse = (msg) => {
    const n = msg.toLowerCase();
    const m = responseBank.find((r) => r.keys.some((k) => n.includes(k)));
    return m?.response ?? "I can help explain adoption eligibility, documents, visits, child welfare monitoring, and government guidelines. I cannot approve applications or make legal decisions.";
  };

  const sendMessage = (text = input) => {
    const t = text.trim();
    if (!t) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setActiveChat((c) => c || t);
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: t, time }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", text: getResponse(t), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 900);
  };

  const newChat = () => { setActiveChat(null); setMessages([]); setInput(""); };

  return (
    <div className="space-y-5">
      <Breadcrumb items={["Parent", "Sahayak AI"]} />

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="grid min-h-[calc(100vh-170px)] lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_280px]">

          {/* ── Left sidebar ─────────────────────────── */}
          <aside className="flex flex-col border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 lg:border-b-0 lg:border-r">
            <div className="p-4">
              <button
                onClick={newChat}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-civic-600 px-4 py-2.5 text-sm font-semibold text-white shadow-btn-primary transition hover:bg-civic-700 active:scale-[0.98]"
              >
                <FiPlus className="h-4 w-4" /> New Chat
              </button>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
                <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  placeholder="Search chats…"
                  className="min-h-[36px] w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Recent</p>
              <div className="space-y-0.5">
                {filteredChats.map((chat) => (
                  <button
                    key={chat}
                    onClick={() => { setActiveChat(chat); setMessages([]); sendMessage(chat); }}
                    className={classNames(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                      activeChat === chat
                        ? "bg-civic-50 text-civic-700 dark:bg-civic-500/10 dark:text-civic-300"
                        : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    )}
                  >
                    <FiMessageCircle className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{chat}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main chat area ────────────────────────── */}
          <main className="flex min-w-0 flex-col">
            {/* Chat header */}
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm">
                  <FiShield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[15px] font-bold text-slate-900 dark:text-white">YourSathi</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:ring-violet-500/20">
                      <FiZap className="h-2.5 w-2.5" /> AI Powered
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Adoption &amp; Child Welfare Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Online</span>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                {messages.length === 0 ? (
                  <WelcomeScreen onSelect={sendMessage} openFaq={openFaq} setOpenFaq={setOpenFaq} />
                ) : (
                  <ChatConversation messages={messages} typing={typing} />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <ChatInput value={input} setValue={setInput} onSend={() => sendMessage()} />
          </main>

          {/* ── Right panel ───────────────────────────── */}
          <aside className="hidden border-l border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 xl:block">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Resources</p>
            <div className="space-y-3">
              {sideCards.map((card) => (
                <div key={card.title} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-civic-50 text-civic-600 dark:bg-civic-500/10 dark:text-civic-400">
                      <card.icon className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-[12px] font-bold text-slate-900 dark:text-white">{card.title}</h3>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{card.text}</p>
                </div>
              ))}
              <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900 dark:text-white">
                  <FiLink className="h-3.5 w-3.5 text-civic-600" /> Quick Links
                </div>
                <div className="mt-2.5 space-y-1.5">
                  {["Adoption process checklist", "Parent responsibility guide", "Visit request instructions"].map((l) => (
                    <p key={l} className="text-[11px] font-medium text-civic-600 hover:underline cursor-pointer dark:text-civic-400">{l}</p>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSelect, openFaq, setOpenFaq }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-4">
      {/* AI avatar */}
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
          <FiShield className="h-9 w-9 text-white" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900">
            <FiZap className="h-2.5 w-2.5 text-white" />
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Hello, I'm YourSathi 👋</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          I'm here to help you understand adoption eligibility, required documents, orphanage visits, and child welfare monitoring.
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <FiInfo className="h-3 w-3" /> AI guide only — cannot approve applications or make legal decisions
        </div>
      </div>

      {/* Quick questions */}
      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-civic-300 hover:bg-civic-50 hover:text-civic-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-civic-500/40 dark:hover:bg-civic-500/10"
          >
            <FiMessageCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            {q}
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div className="mt-8">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <FiHelpCircle className="h-4 w-4 text-civic-600" /> Frequently Asked Questions
        </p>
        <div className="space-y-2">
          {faqs.map((item, i) => (
            <div key={item.question} className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white"
              >
                {item.question}
                <FiChevronDown className={classNames("h-4 w-4 shrink-0 text-slate-400 transition-transform", openFaq === i && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="px-4 pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
                  >
                    {item.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ChatConversation({ messages, typing }) {
  return (
    <div className="space-y-4 pb-2">
      {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
      {typing && <TypingIndicator />}
    </div>
  );
}

function MessageBubble({ message }) {
  const isAI = message.role === "assistant";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={classNames("flex gap-3", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm">
          <FiShield className="h-3.5 w-3.5 text-white" />
        </div>
      )}
      <div className={classNames("max-w-[84%]", isAI ? "text-left" : "text-right")}>
        <div className={classNames(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isAI
            ? "rounded-tl-sm border border-slate-200/80 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            : "rounded-tr-sm bg-gradient-to-br from-civic-600 to-indigo-600 text-white"
        )}>
          {message.text}
        </div>
        <div className={classNames("mt-1.5 flex items-center gap-2 text-[10px] text-slate-400", isAI ? "justify-start" : "justify-end")}>
          <span>{message.time}</span>
          {isAI && (
            <>
              <button title="Copy" className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"><FiCopy className="h-3 w-3" /></button>
              <button title="Regenerate" className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800"><FiRefreshCw className="h-3 w-3" /></button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm">
        <FiShield className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatInput({ value, setValue, onSend }) {
  return (
    <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 shadow-sm transition focus-within:border-civic-400 focus-within:ring-2 focus-within:ring-civic-500/15 dark:border-slate-700 dark:bg-slate-800/80">
          <button title="Attach" disabled className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 disabled:opacity-40">
            <FiPaperclip className="h-4 w-4" />
          </button>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            rows={1}
            placeholder="Ask YourSathi anything…"
            className="max-h-28 min-h-[36px] flex-1 resize-none bg-transparent px-1 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <button
            onClick={onSend}
            disabled={!value.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-civic-600 text-white shadow-btn-primary transition hover:bg-civic-700 disabled:opacity-50 disabled:shadow-none active:scale-[0.96]"
            title="Send"
          >
            <FiSend className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          YourSathi is an AI guide · Cannot approve applications or make legal decisions
        </p>
      </div>
    </div>
  );
}
