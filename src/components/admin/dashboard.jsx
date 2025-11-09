import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Home, LayoutDashboard, Store, UtensilsCrossed, Users, LogOut } from "lucide-react";
import MenuItems from "./MenuItems";
import StoreDetailsForm from "./StoreDetailsForm";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

export default function Dashboard() {
  const { setAuth } = useContext(AuthContext);
  const [mounted, didMount] = useState(false);
  const [loading, isLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.setItem('loggedIn', false);
    
    // Reset auth to guest
    setAuth({
      role: 'guest',
      isLoggedIn: false,
      first_name: null,
      last_name: null,
      email: null,
      accessToken: null,
    });
    
    // Navigate to home page
    navigate('/');
  };

  useEffect(() => {
    didMount(true);
    console.log("Dashboard");
  }, []);

  useEffect(() => {
    if (mounted) isLoading(false);
  }, [mounted]);

  if (!loading)
    return (
      <Container>
        <Row className="mt-4 mb-4">
          <Col>
            <Nav variant="tabs" defaultActiveKey="dashboard" className="w-100">
              <Nav.Item>
                <Nav.Link
                  eventKey="dashboard"
                  onClick={() => setActiveTab("dashboard")}
                >
                  <LayoutDashboard size={18} />
                    Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="store-details"
                  onClick={() => setActiveTab("store-details")}
                >
                  <Store size={18} /> 
                  Store Details
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="menu-items"
                  onClick={() => setActiveTab("menu-items")}
                >
                  <UtensilsCrossed size={18} />
                  Menu Items
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="manage-users"
                  onClick={() => setActiveTab("manage-users")}
                >
                  <Users size={18} />
                  Manage Users
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="ms-auto">
                <Nav.Link
                  onClick={() => navigate("/")}
                >
                 <Home size={18} />
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={handleLogout}
                  className="text-[#6B7280] hover:text-[#4B5563]"
                >
                  <LogOut size={18} />
                  Log out
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            {activeTab === "dashboard" && (
              <div>
                <h2>Welcome to the Admin Dashboard</h2>
                <p>Select a section from the navigation menu above to manage your store.</p>
              </div>
            )}
            {activeTab === "store-details" && <StoreDetailsForm />}
            {activeTab === "menu-items" && <MenuItems />}
          </Col>
        </Row>
      </Container>
    );
}

