import React, { useContext, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { AiOutlineCloudUpload } from "react-icons/ai";

import ChatLoadingSpinner from "./ChatLoadingSpinner";
import {
  Box,
  Button,
  FormControl,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  useDisclosure,
  Avatar,
  Badge,
  Flex,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import chatContext from "../../context/chatContext";
import Message from "./Message";
import FileUploadModal from "./FileUploadModal";

export const ChatArea = () => {
  const context = useContext(chatContext);
  const {
    hostName,
    receiver,
    socket,
    user,
    messageList,
    setMessageList,
    activeChatId,
    isOtherUserTyping,
    setIsOtherUserTyping,
    myChatList,
    isChatLoading,
    colorMode,
  } = context;
  const [typing, settyping] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const typingTimeoutRef = useRef(null);

  // This effect will scroll to the bottom of the message list whenever messageList changes
  useEffect(() => {
    if (messageList.length > 0) {
      setTimeout(() => {
        document.getElementById("chat-box")?.scrollTo({
          top: document.getElementById("chat-box").scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messageList]);

  // Listen for real-time message updates
  useEffect(() => {
    if (!socket) return;

    // Set up event listener for receiving messages
    const handleReceiveMessage = (message) => {
      if (message.conversationId === activeChatId) {
        setMessageList((prevMessages) => {
          // First, check if we have a temp message with the matching tempId
          if (message.tempId) {
            // This is the server's response to our own message
            // Replace our temporary message with the confirmed one from server
            const updated = prevMessages.map(msg => 
              msg._id === message.tempId ? {...message, isSending: false, tempId: undefined} : msg
            );
            
            // Check if we actually replaced anything
            if (updated.some(msg => msg._id === message._id)) {
              return updated;
            }
          }
          
          // Check if this message already exists in our list (by ID)
          const existingMessage = prevMessages.find(msg => msg._id === message._id);
          if (existingMessage) {
            return prevMessages; // Message already exists, don't add it again
          }
          
          // Check for duplicate content (from the same sender within 5 seconds)
          const contentDuplicate = prevMessages.find(msg =>
            !msg.isSending && // Not a temp message
            msg.senderId === message.senderId &&
            msg.text === message.text &&
            msg.imageUrl === message.imageUrl &&
            Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 5000
          );
          
          if (contentDuplicate) {
            return prevMessages; // Similar message exists, don't add it
          }
          
          // It's a new message from someone else, add it
          return [...prevMessages, message];
        });
      }
    };

    // Register the event listener
    socket.on("receive-message", handleReceiveMessage);

    // Clean up on unmount or when dependencies change
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, activeChatId, setMessageList]);

  // Listen for message deletion events
  useEffect(() => {
    if (!socket) return;

    // Set up event listener for message deletion
    const handleMessageDeleted = (data) => {
      if (data.conversationId === activeChatId) {
        setMessageList((prevMessages) => 
          prevMessages.filter(message => message._id !== data.messageId)
        );
      }
    };

    // Register the event listener
    socket.on("message-deleted", handleMessageDeleted);

    // Clean up on unmount or when dependencies change
    return () => {
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [socket, activeChatId, setMessageList]);

  const handleTyping = (e) => {
    if (!socket) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
      settyping(false);
    }, 3000);
  };

  const handleSendMessage = async (e, imageUrl) => {
    e?.preventDefault();
    const messageEl = document.getElementById("new-message");
    const message = messageEl?.value.trim();
    
    if ((!message || message === "") && !imageUrl) {
      return;
    }

    if (socket) {
      socket.emit("stop-typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
    }

    settyping(false);
    if (messageEl) messageEl.value = "";

    // Add temporary message to the UI immediately with a unique local ID
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      conversationId: activeChatId,
      senderId: user._id,
      text: message || '',
      imageUrl: imageUrl || '',
      createdAt: new Date().toISOString(),
      seenBy: [],
      isSending: true
    };
    
    setMessageList(prevMessages => [...prevMessages, tempMessage]);

    // Send the message through socket
    socket.emit("send-message", {
      conversationId: activeChatId,
      senderId: user._id,
      text: message,
      imageUrl,
      tempId: tempId // Include the temp ID to help with matching later
    });
  };

  if (!activeChatId) {
    return (
      <Flex
        w="100%"
        justify="center"
        align="center"
        h="100%"
        direction="column"
      >
        <Heading fontSize="2xl">Welcome to DivineTalk</Heading>
        <Text>Select a chat to start messaging</Text>
      </Flex>
    );
  }

  const isGroup = receiver?.isGroup || false;

  return (
    <Flex
      p="2"
      h="full"
      bg={colorMode === "dark" ? "gray.900" : "gray.50"}
      flexDirection="column"
      position="relative"
    >
      {/* Chat Header */}
      <Box p="1" bg="gray.100" borderRadius="5">
        <Flex align="center" p="1" pl="3">
          <Avatar
            size="sm"
            src={receiver?.profilePic}
            name={receiver?.name}
          />
          <Box ml="3" flex="1">
            <Flex align="center">
              <Text fontSize="lg" fontWeight="bold">
                {receiver?.name}
              </Text>
              {isGroup ? (
                <Badge ml={2} colorScheme="purple">
                  Group
                </Badge>
              ) : (
                <Box ml="2">
                  {receiver?.isOnline ? (
                    <Badge colorScheme="green">Online</Badge>
                  ) : receiver?.lastSeen ? (
                    <Text fontSize="xs" color="gray.500">
                      Last seen:{" "}
                      {new Date(receiver.lastSeen).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  ) : null}
                </Box>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* Chat Messages */}
      {isChatLoading ? (
        <ChatLoadingSpinner />
      ) : (
        <Box
          id="chat-box"
          flex="1"
          overflow="auto"
          p="3"
          className="custom-scrollbar"
          sx={{
            "::-webkit-scrollbar": {
              width: "4px",
            },
            "::-webkit-scrollbar-track": {
              width: "6px",
            },
            "::-webkit-scrollbar-thumb": {
              background: "gray.500",
              borderRadius: "24px",
            },
          }}
        >
          {messageList.map((message) => (
            <Message
              key={message._id}
              message={message}
              isOwnMessage={message.senderId === user._id}
            />
          ))}
          {isOtherUserTyping && (
            <Box textAlign="left" p="1" alignSelf="flex-start">
              <Text fontSize="xs" fontStyle="italic" color="gray.500">
                Typing...
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Message Input */}
      <Box p="2">
        <form onSubmit={handleSendMessage}>
          <FormControl>
            <InputGroup>
              <Input
                id="new-message"
                placeholder="Type a message"
                onKeyDown={handleTyping}
                autoComplete="off"
                focusBorderColor="purple.400"
              />
              <InputRightElement width="4.5rem">
                <Button size="sm" mr="1" onClick={onOpen}>
                  <FaFileUpload />
                </Button>
                <IconButton
                  colorScheme="purple"
                  aria-label="Send message"
                  icon={<IoSend />}
                  size="sm"
                  type="submit"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </form>
      </Box>

      <FileUploadModal
        isOpen={isOpen}
        onClose={onClose}
        handleSendMessage={handleSendMessage}
      />
    </Flex>
  );
};
