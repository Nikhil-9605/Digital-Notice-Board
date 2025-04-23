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
  Table,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      login(response.data.user, response.data.token);
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
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
              Login
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Enter your credentials to access your account
            </Text>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="100%">
                  Login
                </Button>
              </VStack>
            </form>
            <Text fontSize="sm">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="blue.500">
                Register here
              </Link>
            </Text>
          </VStack>
        </Box>
        <Box w="100%" p={4} borderWidth={1} borderRadius="lg">
          <Text fontSize="sm" mb={4} fontWeight="bold">
            Demo Accounts:
          </Text>
          <Table size="sm">
            <Tbody>
              <Tr>
                <Td fontWeight="bold">Admin:</Td>
                <Td>Email: admin@example.com</Td>
                <Td>Password: admin123</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Regular User:</Td>
                <Td>Email: user@example.com</Td>
                <Td>Password: user123</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default Login;
