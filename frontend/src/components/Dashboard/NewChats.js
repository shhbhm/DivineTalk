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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      const filteredUsers = jsonData.filter(u => u._id !== user._id);
      setAllUsers(filteredUsers);
      setFilteredAllUsers(filteredUsers);
    } catch (error) {
      console.log(error);
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
    if (e.target.value !== "") {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = nonFriends.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
      setDisplayedUsers(filtered);
    } else {
      setDisplayedUsers(nonFriends);
    }
  };

  const handleGroupUserSearch = async (e) => {
    if (e.target.value !== "") {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
      setFilteredAllUsers(filtered);
    } else {
      setFilteredAllUsers(allUsers);
    }
  };

  const handleNewChat = async (e, receiverid) => {
    e.preventDefault();
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
        throw new Error("Failed to fetch data");
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
      return;
    }

    // Include current user in group members
    const members = [user._id, ...selectedUsers];
    
    try {
      const payload = { 
        members: members,
        isGroup: true,
        name: groupName 
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
        throw new Error("Failed to create group chat");
      }
      
      const data = await response.json();
      setMyChatList([data, ...myChatList]);
      setActiveChatId(data._id);
      props.setactiveTab(0);

      socket.emit("join-chat", {
        roomId: data._id,
        userId: user._id,
      });

      // Reset group creation state
      setSelectedUsers([]);
      setGroupName("");
      onClose();
      
    } catch (error) {
      console.log(error);
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
        <Button my={2} mx={2} colorScheme="purple" onClick={onOpen}>
          Create New Group <AddIcon ml={2} fontSize={"12px"} />
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
                >
                  <Flex>
                    <Box>
                      <img
                        src={user.profilePic}
                        alt="profile"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                    <Box mx={3} textAlign={"start"}>
                      <Text fontSize={"lg"} fontWeight={"bold"}>
                        {user.name}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.500"}>
                        {user.phoneNum}
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
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input 
                placeholder="Enter group name" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Search Users</FormLabel>
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
                          <img
                            src={u.profilePic}
                            alt="profile"
                            style={{
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%",
                              marginRight: "8px"
                            }}
                          />
                          {u.name}
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
                  Selected ({selectedUsers.length}):
                </Text>
                <Flex flexWrap="wrap" gap={2}>
                  {selectedUsers.map(id => {
                    const selectedUser = allUsers.find(u => u._id === id);
                    return selectedUser ? (
                      <Box 
                        key={id} 
                        px={2} 
                        py={1} 
                        borderRadius="md" 
                        bg="purple.100"
                        fontSize="sm"
                      >
                        {selectedUser.name}
                      </Box>
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
              isDisabled={groupName.trim() === "" || selectedUsers.length === 0}
            >
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChats;
