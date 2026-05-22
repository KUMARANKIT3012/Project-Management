import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const Chatbot = () => {

  const [isOpen, setIsOpen] = useState(false);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {

    if (!input) return;

    setLoading(true);

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const response = await fetch(
      "http://localhost:5000/api/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: input,
        }),
      }
    );

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      data,
    ]);

    setInput("");

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed
          bottom-5
          right-5
          z-50

          bg-black
          dark:bg-white

          text-white
          dark:text-black

          p-4
          rounded-full

          shadow-xl

          hover:scale-105
          transition
        "
      >
        <MessageCircle size={24} />
      </button>

      {/* Popup */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-20
            right-5
            z-50

            w-[95vw]
            sm:w-[400px]

            h-[70vh]

            bg-white
            dark:bg-[#0f0f0f]

            text-black
            dark:text-white

            border
            border-gray-200
            dark:border-neutral-800

            rounded-2xl

            shadow-2xl

            flex
            flex-col

            overflow-hidden
          "
        >
          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between

              p-4

              border-b
              border-gray-200
              dark:border-neutral-800
            "
          >
            <h2 className="font-bold text-lg">
              AI Assistant
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="
                hover:bg-gray-100
                dark:hover:bg-neutral-800

                p-1
                rounded-md
                transition
              "
            >
              <X />
            </button>
          </div>

          {/* Messages */}

          <div
            className="
              flex-1
              overflow-y-auto

              p-4
              space-y-3
            "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`
                  p-3
                  rounded-2xl
                  text-sm
                  whitespace-pre-wrap

                  ${
                    msg.role === "user"
                      ? `
                        bg-blue-500
                        text-white
                        ml-auto
                        max-w-[85%]
                      `
                      : `
                        bg-gray-100
                        dark:bg-neutral-800

                        text-black
                        dark:text-white

                        max-w-[85%]
                      `
                  }
                `}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div
                className="
                  bg-gray-100
                  dark:bg-neutral-800

                  p-3
                  rounded-2xl
                  w-fit

                  text-black
                  dark:text-white
                "
              >
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}

          <div
            className="
              p-4

              border-t
              border-gray-200
              dark:border-neutral-800

              flex
              gap-2
            "
          >
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask AI..."
              className="
                flex-1

                border
                border-gray-300
                dark:border-neutral-700

                bg-white
                dark:bg-neutral-900

                text-black
                dark:text-white

                rounded-xl

                px-4
                py-2

                outline-none

                focus:ring-2
                focus:ring-blue-500
              "
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="
                bg-black
                dark:bg-white

                text-white
                dark:text-black

                px-4
                rounded-xl

                hover:opacity-90
                transition
              "
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;