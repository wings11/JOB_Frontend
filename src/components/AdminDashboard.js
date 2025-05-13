import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Input,
  Select,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("Account created successfully");
      setError("");
      setFormData({ email: "", password: "", role: "student" });
    } catch (err) {
      setError(err.response?.data?.error || "Error creating account");
      setSuccess("");
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={4} align="start">
        <Heading>Admin Dashboard</Heading>
        <Heading size="md">Create Account</Heading>
        <VStack spacing={4} w="full" maxW="400px">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password (optional for Google accounts)</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </Select>
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}
          {success && <Text color="green.500">{success}</Text>}
          <Button colorScheme="brand" onClick={handleCreateAccount} w="full">
            Create Account
          </Button>
        </VStack>
        <Button colorScheme="brand" onClick={() => navigate("/job-form")}>
          Add New Job
        </Button>
        <Button colorScheme="brand" onClick={() => navigate("/jobs")}>
          View Jobs
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Company</Th>
              <Th>Type</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {jobs.map((job) => (
              <Tr key={job.id}>
                <Td>{job.title}</Td>
                <Td>{job.company}</Td>
                <Td>{job.type}</Td>
                <Td>
                  <Button
                    colorScheme="yellow"
                    mr={2}
                    onClick={() => navigate("/job-form", { state: { job } })}
                  >
                    Edit
                  </Button>
                  <Button colorScheme="red" onClick={() => handleDelete(job.id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
}

export default AdminDashboard;