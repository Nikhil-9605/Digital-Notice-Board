import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  VStack,
  Badge,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('regular');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/notices');
      setNotices(response.data);
    } catch (error) {
      toast({
        title: 'Failed to load notices',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (selectedNotice) {
        await axios.put(
          `/api/notices/${selectedNotice._id}`,
          { title, content, category },
          config
        );
      } else {
        await axios.post(
          '/api/notices',
          { title, content, category },
          config
        );
      }

      setTitle('');
      setContent('');
      setCategory('regular');
      setSelectedNotice(null);
      onClose();
      fetchNotices();
      toast({
        title: `Notice ${selectedNotice ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `Failed to ${selectedNotice ? 'update' : 'create'} notice`,
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotices();
      toast({
        title: 'Notice deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete notice',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddNew = () => {
    setSelectedNotice(null);
    setTitle('');
    setContent('');
    setCategory('regular');
    onOpen();
  };

  const getBadgeColor = (category) => {
    switch (category) {
      case 'academics':
        return 'blue';
      case 'regular':
        return 'green';
      case 'others':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.lg" py={5}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading as="h1" size="lg">
              🔔 Notice Board
            </Heading>
            <Text color="gray.600">Welcome, Admin User</Text>
          </Box>
          <HStack spacing={4}>
            <Button onClick={() => navigate('/')}>View Notices</Button>
            <Button colorScheme="blue" onClick={handleAddNew}>
              Add Notice
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </HStack>
        </HStack>

        <Box>
          <Heading size="md" mb={4}>
            Manage Notices
          </Heading>
          <Text mb={4}>Create, edit, and delete notices as an administrator.</Text>

          <VStack spacing={4} align="stretch">
            {notices.map((notice) => (
              <Box
                key={notice._id}
                p={4}
                borderWidth={1}
                borderRadius="lg"
                borderLeftWidth={4}
                borderLeftColor={`${getBadgeColor(notice.category)}.500`}
              >
                <HStack justify="space-between" mb={2}>
                  <Heading size="md">{notice.title}</Heading>
                  <Badge colorScheme={getBadgeColor(notice.category)}>
                    {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                  </Badge>
                </HStack>
                <Text color="gray.600" mb={4}>
                  {notice.content}
                </Text>
                <HStack justify="flex-end" spacing={2}>
                  <Button size="sm" onClick={() => handleEdit(notice)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(notice._id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedNotice ? 'Edit Notice' : 'Create New Notice'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notice title"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Content</FormLabel>
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter notice content"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="academics">Academics</option>
                    <option value="regular">Regular</option>
                    <option value="others">Others</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                {selectedNotice ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
