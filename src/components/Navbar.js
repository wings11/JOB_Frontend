import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Navbar: No token found");
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      console.log("Navbar: Fetching user with token");
      const response = await axios.get("https://rsu-job-fair-backend.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Navbar: User fetched", response.data);
      setUser(response.data);
    } catch (err) {
      console.error("Navbar: Error fetching user:", err.response?.data || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Initial fetch

  // Re-fetch user when token changes (e.g., after login/registration)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Navbar: Token changed, re-fetching user");
      fetchUser();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    console.log("Navbar: Logging out");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  const renderLinks = () => {
    if (!user) return null;
    switch (user.role) {
      case "admin":
        return (
          <>
            <Button variant="ghost" onClick={() => navigate("/admin")}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate("/jobs")}>View Jobs</Button>
          </>
        );
      case "employer":
        return (
          <>
            <Button variant="ghost" onClick={() => navigate("/employer")}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate("/job-form")}>Post Job</Button>
            <Button variant="ghost" onClick={() => navigate("/jobs")}>View Jobs</Button>
          </>
        );
      case "student":
        return (
          <>
            <Button variant="ghost" onClick={() => navigate("/student")}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate("/jobs")}>View Jobs</Button>
          </>
        );
      case "guest":
        return (
          <>
            <Button variant="ghost" onClick={() => navigate("/jobs")}>View Jobs</Button>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box bg="brand.500" px={4} py={2} color="000">
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">RSU Job Portal</Text>
          <Spinner />
        </Flex>
      </Box>
    );
  }

  return (
    <Box  px={4} py={2} color="">
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">RSU Job Portal</Text>
        <Flex alignItems="center">
          {renderLinks()}
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color=""
            ml={2}
          />
          {user && (
            <Menu>
              <MenuButton as={Button} variant="ghost" ml={2}>
                {user.email}
              </MenuButton>
              <MenuList >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;