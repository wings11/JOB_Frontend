import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, VStack, Text } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      window.location.href =
        response.data.role === "admin"
          ? "/admin"
          : response.data.role === "employer"
          ? "/employer"
          : response.data.role === "student"
          ? "/student"
          : "/jobs";
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <Box maxW="400px" mx="auto" p={6} mt={10} boxShadow="lg" borderRadius="md" bg="white">
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">Login</Text>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        {error && <Text color="red.500">{error}</Text>}
        <Button colorScheme="brand" onClick={handleSubmit} w="full">
          Login
        </Button>
        <Text fontSize="sm" color="gray.500">
          Or
        </Text>
        <Button colorScheme="blue" onClick={handleGoogleLogin} w="full">
          Continue with Google
        </Button>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Register and Log In using your Rsu Email Accounts.
        </Text>
      </VStack>
    </Box>
  );
}

export default Login;
