import React, { useContext, useState } from "react";
import { Box, Text, Image, Spinner, Flex, useToast } from "@chakra-ui/react";
import chatContext from "../../context/chatContext";
import { format } from "date-fns";

const Message = ({ message, isOwnMessage }) => {
  const { colorMode, receiver, user } = useContext(chatContext);
  const [imageError, setImageError] = useState(false);
  const toast = useToast();

  const handleImageError = () => {
    setImageError(true);
    toast({
      title: "Image failed to load",
      description: "The image could not be loaded. Please try again later.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
      mb={2}
    >
      <Box
        maxW="70%"
        bg={isOwnMessage ? "purple.500" : "white"}
        color={isOwnMessage ? "white" : "gray.800"}
        borderRadius="lg"
        px={3}
        py={2}
        position="relative"
        boxShadow={!isOwnMessage ? "sm" : "none"}
      >
        {receiver.isGroup && !isOwnMessage && (
          <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
            {message.senderName || "Unknown User"}
          </Text>
        )}
        
        {message.imageUrl && !imageError && (
          <Box mb={message.text ? 2 : 0} maxW="100%" borderRadius="md" overflow="hidden">
            <Image
              src={message.imageUrl}
              alt="Message attachment"
              maxH="300px"
              w="auto"
              objectFit="contain"
              loading="lazy"
              fallback={<Spinner size="xl" />}
              onError={handleImageError}
            />
          </Box>
        )}
        
        {message.text && (
          <Text wordBreak="break-word">{message.text}</Text>
        )}

        <Flex 
          justify="flex-end" 
          align="center" 
          mt={1} 
          fontSize="xs" 
          opacity={0.8}
        >
          <Text>
            {format(new Date(message.createdAt), "HH:mm")}
          </Text>
          {message.isSending && (
            <Text ml={1}>• sending</Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default Message; 