import React from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Circle,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import chatContext from "../../context/chatContext";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import ProfileMenu from "../Navbar/ProfileMenu";
import { useDisclosure } from "@chakra-ui/react";
import NewMessage from "../miscellaneous/NewMessage";
import wavFile from "../../assets/newmessage.wav";
import { ProfileModal } from "../miscellaneous/ProfileModal";

const scrollbarconfig = {
  "&::-webkit-scrollbar": {
    width: "5px",
    height: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "gray.300",
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "gray.400",
  },
  "&::-webkit-scrollbar-track": {
    display: "none",
  },
};

const ChatListItem = ({ chat, active, setActiveChat }) => {
  const context = useContext(chatContext);
  const { user } = context;

  const getReceiver = () => {
    if (chat.isGroup) {
      return { 
        name: chat.name,
        profilePic: "https://cdn-icons-png.flaticon.com/512/1057/1057089.png", // Group icon
        isGroup: true 
      };
    }
    return chat.members[0];
  };

  const receiver = getReceiver();

  const getUnreadCount = () => {
    const unread = chat.unreadCounts.find(
      (unread) => unread.userId === user._id
    );
    return unread ? unread.count : 0;
  };

  return (
    <Button
      variant={"ghost"}
      // colorScheme={'purple'}
      h={"70px"}
      w={"100%"}
      mb={1}
      p={2}
      justifyContent={"flex-start"}
      borderRadius={10}
      backgroundColor={active ? "purple.100" : ""}
      onClick={() => setActiveChat(chat._id, receiver)}
      position={"relative"}
    >
      <Flex>
        <Box>
          <img
            src={receiver.profilePic}
            alt="profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
            }}
          />
          {receiver.isOnline && !receiver.isGroup && (
            <Box
              width={"10px"}
              height={"10px"}
              backgroundColor={"green.400"}
              borderRadius={"50%"}
              position={"absolute"}
              bottom={"25px"}
              left={"40px"}
            ></Box>
          )}
        </Box>

        <Box textAlign={"start"} maxW={"185px"} ml={4}>
          <Text fontSize={"lg"} fontWeight={"bold"} noOfLines={1}>
            {receiver.name}
          </Text>
          <Text fontSize={"sm"} color={"gray.500"} noOfLines={1}>
            {chat.latestmessage ? chat.latestmessage : "Start new chat"}
          </Text>
        </Box>
      </Flex>

      {getUnreadCount() > 0 && (
        <Box
          position={"absolute"}
          top={"25px"}
          right={"10px"}
          bgColor={"purple.500"}
          color={"white"}
          borderRadius={"50%"}
          w={"20px"}
          h={"20px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          fontSize={"xs"}
        >
          {getUnreadCount()}
        </Box>
      )}
    </Button>
  );
};

const MyChatList = (props) => {
  var sound = new Audio(wavFile);
  const toast = useToast();
  const context = useContext(chatContext);
  const {
    hostName,
    user,
    socket,
    myChatList: chatlist,
    originalChatList: data,
    activeChatId,
    setActiveChatId,
    setMyChatList,
    setIsChatLoading,
    setMessageList,
    setIsOtherUserTyping,
    setReceiver,
    isLoading,
    isOtherUserTyping,
  } = context;
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    socket.on("new-message-notification", async (data) => {
      var newlist = chatlist;

      let chatIndex = newlist.findIndex(
        (chat) => chat._id === data.conversationId
      );
      if (chatIndex === -1) {
        newlist.unshift(data.conversation);
      }
      chatIndex = newlist.findIndex((chat) => chat._id === data.conversationId);
      newlist[chatIndex].latestmessage = data.text;

      if (activeChatId !== data.conversationId) {
        newlist[chatIndex].unreadCounts = newlist[chatIndex].unreadCounts.map(
          (unread) => {
            if (unread.userId === user._id) {
              unread.count = unread.count + 1;
            }
            return unread;
          }
        );
        newlist[chatIndex].updatedAt = new Date();
      }

      // If you want to move the updated chat to the beginning of the list
      let updatedChat = newlist.splice(chatIndex, 1)[0];
      newlist.unshift(updatedChat);

      setMyChatList([...newlist]); // Create a new array to update state

      //find the name of person who sent the message
      let sender = newlist.find((chat) => chat._id === data.conversationId)
        .members[0];

      activeChatId !== data.conversationId &&
        sound.play().catch((error) => {
          console.log(error);
        });

      activeChatId !== data.conversationId &&
        toast({
          // title: "New Message",
          // description: data.text,
          status: "success",
          duration: 5000,
          position: "top-right",

          render: () => (
            <NewMessage
              sender={sender}
              data={data}
              handleChatOpen={handleChatOpen}
            />
          ),
        });
    });

    return () => {
      socket.off("new-message-notification");
    };
  });

  const [squery, setsquery] = useState("");

  const handleUserSearch = async (e) => {
    if (e.target.value !== "") {
      const searchTerm = e.target.value.toLowerCase();
      const newchatlist = data.filter((chat) => {
        if (chat.isGroup) {
          return chat.name.toLowerCase().includes(searchTerm);
        } else {
          return chat.members[0].name.toLowerCase().includes(searchTerm);
        }
      });
      setMyChatList(newchatlist);
    } else {
      setMyChatList(context.originalChatList);
    }
  };

  const handleChatOpen = async (chatid, receiver) => {
    try {
      setIsChatLoading(true);
      setMessageList([]);
      setIsOtherUserTyping(false);
      const msg = document.getElementById("new-message");
      if (msg) {
        document.getElementById("new-message").value = "";
        document.getElementById("new-message").focus();
      }

      setIsOtherUserTyping(false);
      await socket.emit("stop-typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
      await socket.emit("leave-chat", activeChatId);

      socket.emit("join-chat", { roomId: chatid, userId: user._id });
      setActiveChatId(chatid);

      const response = await fetch(`${hostName}/message/${chatid}/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();

      setMessageList(jsonData);
      setReceiver(receiver);
      setIsChatLoading(false);

      const newlist = chatlist.map((chat) => {
        if (chat._id === chatid) {
          chat.unreadCounts = chat.unreadCounts.map((unread) => {
            if (unread.userId === user._id) {
              unread.count = 0;
            }
            return unread;
          });
        }
        return chat;
      });

      setMyChatList(newlist);

      setTimeout(() => {
        document.getElementById("chat-box")?.scrollTo({
          top: document.getElementById("chat-box").scrollHeight,
          // behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  return !isLoading ? (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexDir={"column"}
        mt={1}
        h={"100%"}
      >
        <Flex zIndex={1} justify={"space-between"}>
          <Text mb={"10px"} fontWeight={"bold"} fontSize={"2xl"}>
            Chats
          </Text>

          <Flex>
            <InputGroup w={{ base: "fit-content", md: "fit-content" }} mx={2}>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="search user"
                onChange={handleUserSearch}
                id="search-input"
              />
            </InputGroup>

            <Box minW={"fit-content"} display={{ base: "block", md: "none" }}>
              <ProfileMenu
                user={user}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
              />
            </Box>
          </Flex>
        </Flex>

        <Divider my={1} />

        <Button
          m={2}
          colorScheme="purple"
          size="md"
          fontWeight="bold"
          onClick={() => props.setactiveTab(1)}
          leftIcon={<AddIcon />}
        >
          Add new Chat
        </Button>

        <Box h={"100%"} px={2} flex={1} overflowY={"auto"} sx={scrollbarconfig}>
          {chatlist.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              active={chat._id === activeChatId}
              setActiveChat={handleChatOpen}
            />
          ))}
        </Box>
        <ProfileModal
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          user={user}
        />
      </Box>
    </>
  ) : (
    <>
      <Box margin={"auto"} w={"max-content"} mt={"30vh"}>
        <Spinner size={"xl"} />
      </Box>
    </>
  );
};

export default MyChatList;
