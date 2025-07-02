import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Checkbox,
  Stack,
  useDisclosure,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowBackIcon,
  ChevronRightIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import { useContext } from "react";
import chatContext from "../../context/chatContext";

const NewChats = (props) => {
  const [nonFriends, setNonFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredAllUsers, setFilteredAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const context = useContext(chatContext);
  const {
    hostName,
    socket,
    user,
    myChatList,
    setMyChatList,
    setReceiver,
    setActiveChatId,
  } = context;

  const fetchNonFriendsList = async () => {
    try {
      const response = await fetch(`${hostName}/user/non-friends`, {
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
      setNonFriends(jsonData);
      setDisplayedUsers(jsonData);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching users",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${hostName}/user/all-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch all users");
      }
      const jsonData = await response.json();
      // Filter out current user and sort by name
      const filteredUsers = jsonData
        .filter(u => u._id !== user._id)
        .sort((a, b) => a.name.localeCompare(b.name));
      setAllUsers(filteredUsers);
      setFilteredAllUsers(filteredUsers);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching users",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      await fetchNonFriendsList();
      await fetchAllUsers();
    }
    fetchData();
  }, [myChatList]);

  const handleUserSearch = async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = nonFriends.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
    setDisplayedUsers(filtered);
  };

  const handleGroupUserSearch = async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
    setFilteredAllUsers(filtered);
  };

  const handleNewChat = async (e, receiverid) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { members: [user._id, receiverid] };
    try {
      const response = await fetch(`${hostName}/conversation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }
      const data = await response.json();

      setMyChatList([data, ...myChatList]);
      setReceiver(data.members[0]);
      setActiveChatId(data._id);
      props.setactiveTab(0);

      socket.emit("join-chat", {
        roomId: data._id,
        userId: user._id,
      });

      setDisplayedUsers((users) => users.filter((user) => user._id !== receiverid));
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === "" || selectedUsers.length === 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a group name and select at least one user",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if any of the selected users already have a personal chat
      const existingPersonalChats = myChatList.filter(chat => 
        !chat.isGroup && 
        selectedUsers.some(userId => 
          chat.members.some(member => member._id === userId)
        )
      );

      if (existingPersonalChats.length > 0) {
        const userNames = existingPersonalChats
          .map(chat => chat.members.find(m => m._id !== user._id)?.name)
          .filter(Boolean)
          .join(", ");

        const proceed = window.confirm(
          `You already have personal chats with: ${userNames}. Do you still want to create a group chat with these users?`
        );

        if (!proceed) {
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        name: groupName,
        members: [user._id, ...selectedUsers],
        isGroup: true,
      };

      const response = await fetch(`${hostName}/conversation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const data = await response.json();
      setMyChatList([data, ...myChatList]);
      setReceiver(data);
      setActiveChatId(data._id);
      props.setactiveTab(0);

      socket.emit("join-chat", {
        roomId: data._id,
        userId: user._id,
      });

      onClose();
      setSelectedUsers([]);
      setGroupName("");

      toast({
        title: "Group created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating group",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Flex justify={"space-between"}>
          <Button onClick={() => props.setactiveTab(0)}>
            <ArrowBackIcon />
          </Button>

          <Box display={"flex"}>
            <InputGroup w={"fit-content"} mx={2}>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search users"
                onChange={handleUserSearch}
                id="search-input"
              />
            </InputGroup>
          </Box>
        </Flex>
      </Box>

      <Divider my={2} />

      <Box
        h={{ base: "63vh", md: "72vh" }}
        overflowY={"scroll"}
        sx={{
          "::-webkit-scrollbar": {
            width: "4px",
          },
          "::-webkit-scrollbar-track": {
            width: "6px",
          },
          "::-webkit-scrollbar-thumb": {
            background: { base: "gray.300", md: "gray.500" },
            borderRadius: "24px",
          },
        }}
      >
        <Button 
          my={2} 
          mx={2} 
          colorScheme="purple" 
          onClick={onOpen}
          leftIcon={<AddIcon />}
        >
          Create New Group
        </Button>

        {displayedUsers.map(
          (user) =>
            user._id !== context.user._id && (
              <Flex key={user._id} p={2}>
                <Button
                  h={"4em"}
                  w={"100%"}
                  justifyContent={"space-between"}
                  onClick={(e) => handleNewChat(e, user._id)}
                  isLoading={isLoading}
                >
                  <Flex align="center">
                    <Avatar 
                      size="md"
                      name={user.name}
                      src={user.profilePic}
                      mr={3}
                    />
                    <Box textAlign={"start"}>
                      <Text fontSize={"lg"} fontWeight={"bold"}>
                        {user.name}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.500"}>
                        {user.about || "Hey there! I'm using DivineTalk"}
                      </Text>
                    </Box>
                  </Flex>

                  <ChevronRightIcon />
                </Button>
              </Flex>
            )
        )}
      </Box>

      {/* Group Creation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Group Name</FormLabel>
              <Input 
                placeholder="Enter group name" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Add Members ({selectedUsers.length} selected)</FormLabel>
              <InputGroup mb={3}>
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name"
                  onChange={handleGroupUserSearch}
                />
              </InputGroup>
              
              <Box maxH="250px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
                {filteredAllUsers.length > 0 ? (
                  <Stack spacing={2}>
                    {filteredAllUsers.map((u) => (
                      <Checkbox 
                        key={u._id} 
                        isChecked={selectedUsers.includes(u._id)}
                        onChange={() => handleCheckboxChange(u._id)}
                      >
                        <Flex align="center">
                          <Avatar
                            size="sm"
                            name={u.name}
                            src={u.profilePic}
                            mr={2}
                          />
                          <Text>{u.name}</Text>
                        </Flex>
                      </Checkbox>
                    ))}
                  </Stack>
                ) : (
                  <Text textAlign="center" py={2} color="gray.500">
                    No users found
                  </Text>
                )}
              </Box>
            </FormControl>

            {selectedUsers.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>
                  Selected Members:
                </Text>
                <Flex flexWrap="wrap" gap={2}>
                  {selectedUsers.map(id => {
                    const selectedUser = allUsers.find(u => u._id === id);
                    return selectedUser ? (
                      <Flex 
                        key={id} 
                        px={2} 
                        py={1} 
                        borderRadius="md" 
                        bg="purple.100"
                        align="center"
                        fontSize="sm"
                      >
                        <Avatar
                          size="xs"
                          name={selectedUser.name}
                          src={selectedUser.profilePic}
                          mr={2}
                        />
                        {selectedUser.name}
                      </Flex>
                    ) : null;
                  })}
                </Flex>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="purple" 
              mr={3} 
              onClick={handleCreateGroup}
              isLoading={isLoading}
              isDisabled={groupName.trim() === "" || selectedUsers.length === 0}
            >
              Create Group
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChats;
