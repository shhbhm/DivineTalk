import React, { useContext } from "react";
import { Box, Flex, Text, Image, Badge, Tooltip, Spinner } from "@chakra-ui/react";
import chatContext from "../../context/chatContext";

const Message = ({ message, isOwnMessage }) => {
  const { user, myChatList, activeChatId } = useContext(chatContext);
  
  // Find the current conversation to check if it's a group
  const currentChat = myChatList.find(chat => chat._id === activeChatId);
  const isGroupChat = currentChat?.isGroup || false;
  
  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine sender name for group chats
  const getSenderName = () => {
    if (!isGroupChat || isOwnMessage) return null;
    
    // For group chats, try to find the sender in the members list
    const sender = currentChat.members.find(
      member => member._id === message.senderId
    );
    
    // If the sender isn't in the members list (which can happen with the current implementation),
    // display the sender ID in a more readable format
    if (!sender) {
      return `User ${message.senderId.substring(0, 6)}...`;
    }
    
    return sender.name || "Unknown";
  };

  return (
    <Flex
      direction="column"
      alignItems={isOwnMessage ? "flex-end" : "flex-start"}
      mb={2}
    >
      {/* Sender name for group chats */}
      {isGroupChat && !isOwnMessage && (
        <Text fontSize="xs" fontWeight="bold" color="gray.600" ml={2}>
          {getSenderName()}
        </Text>
      )}
      
      <Box
        bg={isOwnMessage ? "purple.500" : "gray.200"}
        color={isOwnMessage ? "white" : "black"}
        borderRadius="lg"
        px={3}
        py={2}
        maxW="70%"
        wordBreak="break-word"
        opacity={message.isSending ? 0.7 : 1}
      >
        {message.text}
        
        {message.imageUrl && (
          <Image 
            src={message.imageUrl}
            alt="Message attachment"
            mt={2}
            maxH="200px"
            borderRadius="md"
          />
        )}
        
        <Flex justify="flex-end" mt={1} alignItems="center">
          {message.isSending && (
            <Spinner size="xs" color={isOwnMessage ? "white" : "purple.500"} mr={1} />
          )}
          
          <Text fontSize="xs" opacity={0.8}>
            {message.isSending ? "Sending..." : formatTime(message.createdAt)}
          </Text>
          
          {isOwnMessage && !message.isSending && message.seenBy && message.seenBy.length > 0 && (
            <Tooltip 
              label={`Seen by ${message.seenBy.length} member${message.seenBy.length > 1 ? 's' : ''}`}
              placement="bottom"
            >
              <Badge ml={1} colorScheme="green" variant="outline" size="sm">
                ✓
              </Badge>
            </Tooltip>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Message; 