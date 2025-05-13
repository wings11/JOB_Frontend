import { useState, useEffect } from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, VStack } from "@chakra-ui/react";
import axios from "axios";

function StudentDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("https://rsu-job-fair-backend.onrender.com/api/applications/student", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <Box p={6}>
      <VStack spacing={4} align="start">
        <Heading>Student Dashboard</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Job Title</Th>
              <Th>Company</Th>
              <Th>Applied At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {applications.map((app) => (
              <Tr key={app.id}>
                <Td>{app.title}</Td>
                <Td>{app.company}</Td>
                <Td>{new Date(app.applied_at).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
}

export default StudentDashboard;