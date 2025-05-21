import { Box, Spinner, Center } from "@chakra-ui/react";
import React from "react";

const ChatLoadingSpinner = () => {
  return (
    <Center flex="1">
      <Spinner 
        size="xl" 
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="purple.500"
      />
    </Center>
  );
};

export default ChatLoadingSpinner; 