import { jwtDecode } from 'jwt-decode';



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";
import axios from "axios";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Filter jobs by employer_id and fetch application counts
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token); // Note: This requires JWT on client-side, see backend API instead
        const employerJobs = response.data.filter(job => job.employer_id === decoded.id);
        const jobsWithCounts = await Promise.all(
          employerJobs.map(async (job) => {
            const countResponse = await axios.get(
              `http://localhost:5000/api/applications/${job.id}/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...job, application_count: countResponse.data.count };
          })
        );
        setJobs(jobsWithCounts);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load jobs");
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleEdit = (job) => {
    navigate("/job-form", { state: { job } });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete job");
      console.error("Error deleting job:", err);
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6} mt={10} boxShadow="lg" borderRadius="md" bg="white">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Employer Dashboard</Text>
      {error && <Text color="red.500" mb={4}>{error}</Text>}
      <Button colorScheme="brand" mb={4} onClick={() => navigate("/job-form")}>
        Post New Job
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Company</Th>
            <Th>Type</Th>
            <Th>Applications</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {jobs.map((job) => (
            <Tr key={job.id}>
              <Td>{job.title}</Td>
              <Td>{job.company}</Td>
              <Td>{job.type}</Td>
              <Td>{job.application_count}</Td>
              <Td>
                <Button size="sm" mr={2} onClick={() => handleEdit(job)}>
                  Edit
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(job.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default EmployerDashboard;