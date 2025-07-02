import chatContext from "./chatContext";
import { useState, useEffect } from "react";
import io from "socket.io-client";
// 192.168.0.104
//http://192.168.0.104:5000
//https://chat-app-u2cq.onrender.com
// http://localhost:5000
const hostName = "http://localhost:5000";
var socket = io(hostName);

const ChatState = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [receiver, setReceiver] = useState({});
  const [messageList, setMessageList] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [myChatList, setMyChatList] = useState([]);
  const [originalChatList, setOriginalChatList] = useState([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${hostName}/conversation/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data" + (await response.text()));
      }
      const jsonData = await response.json();
      setMyChatList(jsonData);
      setIsLoading(false);
      setOriginalChatList(jsonData);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Setup socket event listeners
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    socket.on("receiver-online", () => {
      setReceiver((prevReceiver) => ({ ...prevReceiver, isOnline: true }));
    });

    return () => {
      socket.off("receiver-online");
    };
  }, []);

  useEffect(() => {
    socket.on("receiver-offline", () => {
      setReceiver((prevReceiver) => ({
        ...prevReceiver,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      }));
    });

    return () => {
      socket.off("receiver-offline");
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch(`${hostName}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          });
          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
          setIsAuthenticated(true);
          if (data._id) {
            socket.emit("setup", data._id);
          }
        }
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser({});
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    fetchUser();
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  return (
    <chatContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        receiver,
        setReceiver,
        messageList,
        setMessageList,
        activeChatId,
        setActiveChatId,
        myChatList,
        setMyChatList,
        originalChatList,
        fetchData,
        hostName,
        socket,
        isOtherUserTyping,
        setIsOtherUserTyping,
        isChatLoading,
        setIsChatLoading,
        isLoading,
        setIsLoading,
      }}
    >
      {props.children}
    </chatContext.Provider>
  );
};

export default ChatState;
