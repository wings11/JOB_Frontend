import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Input, Select, Textarea, VStack, Text } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import axios from "axios";

function JobForm() {
  const { state } = useLocation();
  const job = state?.job || {};
  const [formData, setFormData] = useState({
    id: job.id || "",
    title: job.title || "",
    company: job.company || "",
    type: job.type || "Full-Time",
    line_id: job.line_id || "",
    salary_range: job.salary_range || "",
    details: job.details || "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.company || !formData.line_id || !formData.details) {
        setError("All fields except Salary Range are required");
        return;
      }
      const url = formData.id
        ? `http://localhost:5000/api/jobs/${formData.id}`
        : "http://localhost:5000/api/jobs";
      const method = formData.id ? "put" : "post";
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/employer");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      console.error("Error saving job:", err);
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={6} mt={10} boxShadow="lg" borderRadius="md" bg="white">
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">{formData.id ? "Edit Job" : "Post Job"}</Text>
        {error && <Text color="red.500">{error}</Text>}
        <FormControl>
          <FormLabel>Job Title</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Company</FormLabel>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Job Type</FormLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option>Full-Time</option>
            <option>Part-Time</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Line ID</FormLabel>
          <Input
            value={formData.line_id}
            onChange={(e) => setFormData({ ...formData, line_id: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Salary Range (Optional)</FormLabel>
          <Input
            value={formData.salary_range}
            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
            placeholder="e.g., 20,000-30,000 THB"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Job Details</FormLabel>
          <Textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="brand" onClick={handleSubmit} w="full">
          Save Job
        </Button>
        <Button variant="outline" onClick={() => navigate("/employer")} w="full">
          Cancel
        </Button>
      </VStack>
    </Box>
  );
}

export default JobForm;