import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import StudentDashboard from "./components/StudentDashboard";
import JobForm from "./components/JobForm";
import ApplyForm from "./components/ApplyForm";
import Jobs from "./components/Jobs";
import AuthCallback from "./components/AuthCallback";


function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/job-form" element={<JobForm />} />
          <Route path="/apply/:id" element={<ApplyForm />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;