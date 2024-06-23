import React, { useState, useEffect } from "react";
import axios from "axios";

const RecyclerView = ({ items }) => {
    return (
        <div className="recycler-container w-full h-full overflow-auto">
            <div className="recycler-inner flex flex-col justify-center items-center">
                {items.map((item, index) => (
                    <div key={index} className="recycler-item p-2 m-2 border rounded-lg bg-white shadow-md">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Chat = () => {
    const [userInput, setUserInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [latestMessages, setLatestMessages] = useState([]);

    useEffect(() => {
        fetchLatestMessages();
    }, []);

    const fetchLatestMessages = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/messages");
            setLatestMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching latest messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!userInput.trim()) return; // Ignore empty messages

        try {
            // Send message to Flask backend
            const response = await axios.post("http://localhost:5000/api/chat", {
                message: userInput,
            });
            const botResponse = response.data.response;

            // Update messages state with user and bot messages
            setMessages([
                ...messages,
                { sender: "You", message: userInput },
                { sender: "Bot", message: botResponse },
            ]);

            // Clear input field
            setUserInput("");

            // Fetch the latest messages to update the sidebar
            fetchLatestMessages();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const getLastMessage = (messages) => {
        if (messages.length === 0) return null;
        return messages[messages.length - 1].message;
    };

    return (
        <div className="bg-gradient-to-r from-slate-400 to-green-600 min-h-screen flex flex-col items-center relative">
            <div className="fixed top-4 right-4 z-50">
                <svg
                    onClick={toggleSidebar}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    color={"#000000"}
                    fill={"none"}
                    className="cursor-pointer"
                >
                    <path
                        d="M4 5L20 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M4 12L20 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M4 19L20 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <div className="relative top-10">
                <h1 className="text-lg bg-gradient-to-r from-yellow-400 to-lime-500 rounded-lg p-6">
                    NT CHAT BOT
                </h1>
            </div>
            <div className="flex flex-col flex-grow w-full max-w-2xl p-4">
                <div
                    id="chatbox"
                    className="flex-grow overflow-auto p-4 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-lg"
                >
                    {messages.map((msg, index) => (
                       <div
                       key={index}
                       className={`p-2 ${
                           msg.sender === "You"
                               ? "text-right"
                               : "text-left"
                       }`}
                   >
                       <strong>{msg.sender}:</strong> {msg.message}
                   </div>                   
                    ))}
                </div>
                <div className="mt-4 flex">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type a message"
                        className="flex-grow p-2 border rounded-l-lg"
                    />
                    <button
                        onClick={sendMessage}
                        className="p-2 bg-blue-500 text-white rounded-r-lg"
                    >
                        Send
                    </button>
                </div>
            </div>

            {isSidebarOpen && (
                <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 overflow-y-auto z-40">
                    <h2 className="text-xl mb-4">Latest Messages</h2>
                    <div className="p-2 m-2 border rounded-lg bg-white shadow-md">
                        {latestMessages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.sender}:</strong> {msg.message}
                                <br />
                                <strong>Bot:</strong> {msg.response}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
