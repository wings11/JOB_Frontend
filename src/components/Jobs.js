import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, VStack, Text } from "@chakra-ui/react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchJobs();
    if (localStorage.getItem("token")) fetchUser();
  }, []);

  const handleApply = (jobId) => {
    if (!user) {
      navigate("/");
    } else if (user.role !== "student" || !user.email.endsWith("@rsu.ac.th")) {
      alert("Only students with @rsu.ac.th emails can apply");
    } else {
      navigate(`/apply/${jobId}`);
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={4} align="start">
        <Heading>Available Jobs</Heading>
        {jobs.map((job) => (
          <Box key={job.id} p={4} borderWidth="1px" borderRadius="md" w="full">
            <Text fontSize="xl" fontWeight="bold">{job.title}</Text>
            <Text>Company: {job.company}</Text>
            <Text>Type: {job.type}</Text>
            <Text>{job.description}</Text>
            <Button colorScheme="accent" mt={2} onClick={() => handleApply(job.id)}>
              Apply
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default Jobs;