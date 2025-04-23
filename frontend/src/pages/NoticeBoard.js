import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Select,
  Button,
  HStack,
  Badge,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || notice.category === category;
    return matchesSearch && matchesCategory;
  });

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
            <Text color="gray.600">
              Welcome to the notice board{user ? `, ${user.role === 'admin' ? 'Admin' : 'Regular'} User` : ''}.
            </Text>
          </Box>
          <HStack spacing={4}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Button colorScheme="blue" onClick={() => navigate('/admin')}>
                    Manage Notices
                  </Button>
                )}
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button colorScheme="blue" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <Input
            placeholder="Search by title or content"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="academics">Academics</option>
            <option value="regular">Regular</option>
            <option value="others">Others</option>
          </Select>
        </HStack>

        {filteredNotices.length === 0 ? (
          <Box p={8} textAlign="center" borderWidth={1} borderRadius="lg">
            <Text>No notices available at the moment.</Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredNotices.map((notice) => (
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
                <Text color="gray.600">{notice.content}</Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Posted {new Date(notice.createdAt).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default NoticeBoard;
