import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
  useColorMode,
  SlideFade,
  ScaleFade,
  Image,
} from "@chakra-ui/react";
import Auth from "./Authentication/Auth";
import { useContext } from "react";
import chatContext from "../context/chatContext";
import { Link, useNavigate } from "react-router-dom";
import powerButtonLogo from "../assets/images/power-button.svg";

const Home = () => {
  // context
  const context = useContext(chatContext);
  const { isAuthenticated } = context;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [index, setindex] = useState();
  const navigator = useNavigate();
  const { colorMode } = useColorMode();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigator("/dashboard");
    }
  }, [isAuthenticated, navigator]);

  const handleloginopen = () => {
    setindex(0);
    onOpen();
  };

  const handlesignupopen = () => {
    setindex(1);
    onOpen();
  };

  return (
    <Box 
      h={"100vh"} 
      verticalAlign="middle"
      bg={colorMode === "dark" ? "gray.800" : "gray.50"}
      transition="background-color 0.3s ease"
    >
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        minH="90vh"
        p={4}
      >
        <SlideFade in={true} offsetY="30px">
          <Box 
            textAlign="center"
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            bg={colorMode === "dark" ? "gray.700" : "white"}
            maxW="md"
            w="100%"
          >
            <Flex direction="column" align="center" mb={4}>
              <Image src={powerButtonLogo} alt="DivineTalk Logo" boxSize="80px" mb={4} />
              <Heading 
                fontSize={"6xl"} 
                fontWeight={"bold"} 
                fontFamily={"Work sans"}
                bgGradient="linear(to-r, purple.400, pink.400)"
                bgClip="text"
              >
                DivineTalk
              </Heading>
            </Flex>
            <Text fontSize="xl" fontWeight="medium" mb={8} color={colorMode === "dark" ? "gray.300" : "gray.600"}>
              Connect & Chat in Real-Time
            </Text>
            <Flex justifyContent="center" gap={4}>
              <Button 
                colorScheme="purple" 
                size="lg" 
                onClick={handleloginopen}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                Login
              </Button>
              <Button 
                colorScheme="pink" 
                size="lg" 
                onClick={handlesignupopen}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                Sign Up
              </Button>
            </Flex>
          </Box>
        </SlideFade>
      </Flex>
      {/* Copyright */}
      <Text
        fontSize="sm"
        position={"fixed"}
        bottom={4}
        left={"calc(50% - 155px)"}
        textAlign="center"
        opacity={0.8}
      >
        &copy; 2025 DivineTalk. All rights reserved.
        <Link to="https://github.com/shhbhm" target="_blank">
          <Text as="u" color="purple.500" ml={1} display="inline">
            Shubham Solanki
          </Text>
        </Link>
      </Text>
      
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "md", md: "xl" }}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ScaleFade in={isOpen}>
          <ModalContent w={{ base: "95vw" }} borderRadius="xl" boxShadow="2xl">
            <ModalHeader></ModalHeader>
            <ModalBody>
              <Auth tabindex={index} />
            </ModalBody>
            <ModalCloseButton />
          </ModalContent>
        </ScaleFade>
      </Modal>
    </Box>
  );
};

export default Home;
