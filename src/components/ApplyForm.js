import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, VStack, Text, Link } from "@chakra-ui/react";
import axios from "axios";

function ApplyForm() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`https://rsu-job-fair-backend.onrender.com/api/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await axios.post(
        `https://rsu-job-fair-backend.onrender.com/api/applications/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  if (loading) {
    return <Box maxW="600px" mx="auto" p={6} mt={10}><Text>Loading...</Text></Box>;
  }

  if (error) {
    return <Box maxW="600px" mx="auto" p={6} mt={10}><Text color="red.500">{error}</Text></Box>;
  }

  return (
    <Box maxW="600px" mx="auto" p={6} mt={10} boxShadow="lg" borderRadius="md" bg="white">
      <VStack spacing={4} align="start">
        <Text fontSize="2xl" fontWeight="bold">Apply for Job</Text>
        <Text fontSize="lg" fontWeight="bold">{job.title}</Text>
        <Text><strong>Company:</strong> {job.company}</Text>
        <Text><strong>Line ID:</strong> <Link color="blue.500" href={`https://line.me/ti/p/~${job.line_id}`} isExternal>{job.line_id}</Link></Text>
        <Text><strong>Salary Range:</strong> {job.salary_range || "Not specified"}</Text>
        <Text><strong>Job Details:</strong> {job.details}</Text>
        <Text>Please contact the employer via Line to discuss further details.</Text>
        <Button colorScheme="brand" onClick={handleApply} w="full">
          Apply
        </Button>
        <Button variant="outline" onClick={() => navigate("/jobs")} w="full">
          Cancel
        </Button>
      </VStack>
    </Box>
  );
}

export default ApplyForm;