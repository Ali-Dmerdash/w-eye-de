"use client";
import Image from "next/image";
import Sphere from "@/assets/blue 2.png";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext"

export default function WelcomeCard() {
  const { user, isLoaded } = useUser();
  const [lastConversationBrief, setLastConversationBrief] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { openChat } = useChat();

  useEffect(() => {
    setIsLoading(true);
    const fetchConversationBrief = async () => {
      const chatMessagesRaw = localStorage.getItem("chatMessages");
      if (!chatMessagesRaw) return;
      try {
        const chatMessages = JSON.parse(chatMessagesRaw);
        if (!Array.isArray(chatMessages) || chatMessages.length === 0) return;
        const texts = chatMessages.map((msg: any) => msg.text).filter(Boolean);
        if (texts.length === 0) return;
        const response = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `give me a brief contains at most 4 words about the following conversation topic : ${JSON.stringify(texts)}`,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch brief");
        const data = await response.json();
        // Try to extract the brief from possible response fields
        const brief = data.response || data.message || data.text || "";
        console.log(brief);
        setLastConversationBrief(brief);
      } catch (err) {
        setLastConversationBrief("");
      }
    };
    fetchConversationBrief();
    setIsLoading(false);
  }, []);

  return (
    <>


      {isLoaded && !isLoading ? (
        <>
          <div className="grid grid-cols-1 gap-4 h-full">
            <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/20"></div>
              <div className="absolute inset-0 z-0 opacity-50 blur-sm w-[200%] -left-24">
                <Image
                  src={Sphere || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover blur-xs"
                  priority
                />
              </div>


              <div className={` flex items-center gap-2 `}>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Welcome back,</p>
              </div>

              <div className="relative z-10 flex flex-col justify-center py-2">

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 capitalize">
                  {user?.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Glad to see you again!
                  <br />
                  Ask me anything.
                </p>
              </div>

            </div>

            <div
              onClick={() => openChat()}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 py-0 relative overflow-hidden hover:shadow-xl hover:cursor-pointer hover:scale-105 transition-all duration-300`}>


              <div className={` flex flex-col items-start py-6`}>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chat History</p>
                </div>

                <div className="relative z-10 flex flex-col justify-center pt-6 w-full ">

                  <span className={`text-gray-600 dark:text-gray-300`}>
                    {lastConversationBrief ?
                    <>
                                        Our last conversation was about:

                      <span className="block font-semibold">{lastConversationBrief}</span>
                      </>:
                      <span className="block font-semibold">Seems like you haven't started a chat yet</span>
                    }
                  </span>
                  <span className={` block font-light text-[0.6rem] text-center pt-2 text-gray-600 dark:text-gray-300 underline`}
                    onClick={() => openChat()}>{lastConversationBrief ? "Continue the conversation" : "Start a new chat"}</span>

                </div>
              </div>



            </div>
          </div>
        </>
      ) : (
        <div className="absolute top-0 z-[9999999] left-0 w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}