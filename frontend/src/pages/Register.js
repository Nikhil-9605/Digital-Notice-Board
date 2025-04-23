import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Link,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        role: 'user', // Default role for new registrations
      });
      login(response.data.user, response.data.token);
      navigate('/');
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={6}>
        <Box as="header" textAlign="center">
          <Heading as="h1" size="lg" mb={2}>
            🔔 Notice Board
          </Heading>
        </Box>
        <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
          <VStack spacing={4}>
            <Heading as="h2" size="md">
              Register
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Create a new account to access the notice board
            </Text>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="100%">
                  Register
                </Button>
              </VStack>
            </form>
            <Text fontSize="sm">
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="blue.500">
                Login here
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Register;
