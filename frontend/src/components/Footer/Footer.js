import React from "react";
import { Box, Text, Link } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");

  // Don't show footer on dashboard to avoid UI conflicts
  if (isDashboard) {
    return null;
  }

  return (
    <Box 
      width="100%" 
      p={3} 
      textAlign="center" 
      borderTopWidth="1px"
      position="fixed"
      bottom="0"
      left="0"
      backgroundColor="var(--chakra-colors-chakra-body-bg)"
      zIndex="1000"
    >
      <Text fontSize="sm">
        Created by{" "}
        <Link 
          href="https://github.com/shhbhm" 
          isExternal 
          fontWeight="bold"
          textDecoration="underline"
        >
          Shubham Solanki
        </Link>
      </Text>
    </Box>
  );
};

export default Footer; 