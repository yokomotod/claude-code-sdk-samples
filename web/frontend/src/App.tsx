import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchEventSource } from "@microsoft/fetch-event-source";

type UserMessage = { type: "UserMessage"; content: string };
type AssistantMessage = {
  type: "AssistantMessage";
  content: {
    type: string;
    text?: string;
  }[];
};
type Message = UserMessage | AssistantMessage;

function useChat() {
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    setIsLoading(true);

    const userMessage: Message = { type: "UserMessage", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    await fetchEventSource(`//localhost:8000/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: currentInput,
        last_session_id: lastSessionId || null,
      }),
      onmessage(ev) {
        console.log(ev);
        const data = JSON.parse(ev.data);

        if (data.session_id) {
          setLastSessionId(data.session_id);
          return;
        }

        if (data.type !== "AssistantMessage") {
          return;
        }

        setMessages((prev) => [...prev, data]);
      },
    });
    setIsLoading(false);
  };

  return { messages, input, setInput, isLoading, sendMessage };
}

function AgentMessageItem({ message }: { message: AssistantMessage }) {
  return (
    <div
      className={`p-3 rounded-lg text-sm bg-cyan-50 text-cyan-800 border-l-4 border-cyan-400`}
    >
      {message.content
        .filter(({ type }) => type === "TextBlock")
        .map((block, blockIdx) => (
          <div key={blockIdx} className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {block.text}
            </ReactMarkdown>
          </div>
        ))}
    </div>
  );
}

function App() {
  const { messages, input, setInput, isLoading, sendMessage } = useChat();

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Claude Code Web</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, idx) =>
          msg.type === "UserMessage" ? (
            <div
              key={idx}
              className="p-3 rounded-lg whitespace-pre-wrap text-sm bg-gray-100 text-gray-800 ml-12 border-l-4 border-gray-400"
            >
              {msg.content}
            </div>
          ) : (
            <AgentMessageItem key={idx} message={msg} />
          ),
        )}
      </div>

      <div className="border-t border-gray-200 bg-white p-3 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            rows={1}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none field-sizing-content"
            placeholder="prompt..."
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
