import React, { useRef, useState, useContext } from "react";
import {
  Button,
  CloseButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import chatContext from "../../context/chatContext";
import axios from "axios";

const FileUploadModal = ({ isOpen, onClose, handleSendMessage }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const { hostName } = useContext(chatContext);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      fileInputRef.current.value = null;
      setSelectedFile(null);
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const getPreSignedUrl = async (fileName, fileType) => {
    try {
      const response = await fetch(
        `${hostName}/message/presigned-url?filename=${fileName}&filetype=${fileType}`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get pre-signed URL");
      }
      return await response.json();
    } catch (error) {
      throw new Error("Error getting upload URL: " + error.message);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;
    
    setIsUploading(true);
    try {
      const { url, fields } = await getPreSignedUrl(selectedFile.name, selectedFile.type);
      const awsHost = "https://conversa-chat.s3.ap-south-1.amazonaws.com/";
      
      const formData = new FormData();
      Object.entries({ ...fields, file: selectedFile }).forEach(([k, v]) => {
        formData.append(k, v);
      });

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 201) {
        throw new Error("Failed to upload file");
      }

      return `${awsHost}${fields.key}`;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const imageUrl = await uploadFile();
    
    if (imageUrl) {
      handleSendMessage(e, imageUrl);
      onClose();
      setSelectedFile(null);
      setMessage("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" justifyContent="space-between">
          <Text>Send a photo</Text>
          <CloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody pb={6}>
          <Input
            type="file"
            display="none"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
          />
          <Box mb={4}>
            <Flex mb={3}>
              <Button mr={3} onClick={handleFileUpload} colorScheme="purple" variant="outline">
                Choose a photo
              </Button>
              {selectedFile && (
                <Flex align="center">
                  <Text noOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <CloseButton onClick={removeFile} ml={2} />
                </Flex>
              )}
            </Flex>
            
            {selectedFile && (
              <Box
                mt={2}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p={2}
                maxH="200px"
                overflow="hidden"
              >
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Preview" 
                  style={{ maxHeight: "180px", margin: "0 auto", display: "block" }}
                />
              </Box>
            )}
          </Box>
          
          <Input
            type="text"
            placeholder="Add a message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            mb={4}
          />
          
          <Button
            colorScheme="purple"
            rightIcon={<ArrowForwardIcon />}
            onClick={handleSubmit}
            isDisabled={!selectedFile || isUploading}
            isLoading={isUploading}
            loadingText="Uploading..."
            float="right"
          >
            Send
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FileUploadModal; 