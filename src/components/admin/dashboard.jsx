import { useEffect, useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Home, LayoutDashboard, Store, UtensilsCrossed, Users } from "lucide-react";
import MenuItems from "./MenuItems";
import StoreDetailsForm from "./StoreDetailsForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [mounted, didMount] = useState(false);
  const [loading, isLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

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

