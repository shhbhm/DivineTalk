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
  Progress,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import chatContext from "../../context/chatContext";

const FileUploadModal = ({ isOpen, onClose, handleSendMessage }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();
  const { hostName } = useContext(chatContext);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
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

  const uploadFile = async () => {
    if (!selectedFile) return null;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log('Attempting to upload to:', `${hostName}/message/upload`);
      
      const response = await fetch(`${hostName}/message/upload`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
        body: formData,
      }).catch(error => {
        console.error('Fetch error:', error);
        throw new Error(`Connection failed: ${error.message}`);
      });

      if (!response) {
        throw new Error('No response from server');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || 'Failed to upload image';
        } catch (e) {
          errorMessage = `Server error: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error('No image URL in response');
      }
      
      console.log('Upload successful:', data.imageUrl);
      return data.imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
      // Create a new event with the message text
      const event = new Event('submit');
      event.preventDefault = () => {};
      handleSendMessage(event, message, imageUrl);
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
          
          {isUploading && (
            <Progress value={uploadProgress} size="xs" colorScheme="purple" mb={4} />
          )}
          
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