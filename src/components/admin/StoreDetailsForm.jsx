import { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import { api } from "../users/api";

export default function StoreDetailsForm() {
  const [mounted, didMount] = useState(false);
  const [formData, setFormData] = useState({
    data_name: "",
    long_name: "",
    short_name: "",
    store_description: "",
    our_menu_description: "",
    address: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
    phone: "",
    email: "",
    banner_img_url: "",
    delivery: {
      skip_the_dishes: "",
      uber_eats: "",
      doordash: "",
    },
    store_hours: {},
  });

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchStoreDetails();
  }, []);

  useEffect(()=> {
    if (mounted) setIsLoading(false);
  }, [mounted])

  useEffect(()=> {
    if (isEditMode) console.log("Edit mode");
  }, [formData, isEditMode]);

  useEffect(()=> {
    console.log("Loading:", isLoading);
    console.log("Edit mode:", isEditMode);
  }, [isLoading, isEditMode]);
  useEffect(() => {
    if (!isLoading) console.log("Form data:", formData);
  }, [formData, isLoading]);

  const fetchStoreDetails = async () => {
    try {
      const response = await api.get("/api/meta/all-meta/store_details");
      const meta = response.data.data;
      console.log("Data:", meta);
      
      if (response.data.success) {
        let newFormDate = 
        setFormData({
          data_name: meta.data_name || "",
          long_name: meta.long_name || "",
          short_name: meta.short_name || "",
          store_description: meta.store_description || "",
          our_menu_description: meta.our_menu_description || "",
          description: meta.description || "",
          address: meta.address || "",
          city: meta.city || "",
          province: meta.province || "",
          country: meta.country || "",
          postal_code: meta.postal_code || "",
          phone: meta.phone || "",
          email: meta.email || "",
          banner_img_url: meta.banner_image_url || "",
          delivery: {
            skip_the_dishes: meta.delivery?.skip_the_dishes || "",
            uber_eats: meta.delivery?.uber_eats || "",
            doordash: meta.delivery?.doordash || "",
          },
          store_hours: meta.store_hours || {}
        });
        if (meta.banner_image_url) {
          setBannerPreview(meta.banner_image_url);
        }
      }
    } catch (err) {
      // If store details don't exist yet, that's okay - we'll create them
      console.log("Error:", err);
      console.log("Store details not found, will create new");
    } finally {
      didMount(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setBannerFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          bannerUrl: reader.result, // Store as base64 data URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    setShowConfirmModal(false);
    setError("");
    setSuccess("");

    // Ensure bannerUrl is set to the preview (base64 string) if we have one
    const submitData = {
      ...formData,
      data_name: 'store_details',
      bannerUrl: bannerPreview || formData.bannerUrl || null
    };

    console.log("Submitting data:", submitData);

    try {
      const response = await api.post("/api/meta/update", submitData);
      
      setSuccess("Store details updated successfully!");
      setIsEditMode(false); // Switch back to view mode after successful update
      fetchStoreDetails(); // Refresh the data
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } 
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setError("");
    setSuccess("");
    // Reset form to original data
    fetchStoreDetails();
  };

  if (!mounted) {
    return (
      <Card>
        <Card.Body>
          <p className="text-black">Loading store details...</p>
        </Card.Body>
      </Card>
    );
  }

  // View Mode - Display current store details
  if (!isEditMode && !isLoading) {
    return (
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0 text-black">Store Details</h3>
          <Button variant="outline-primary" onClick={() => setIsEditMode(true)}>
            Edit Store Details
          </Button>
        </Card.Header>
        <Card.Body>
          {success && <Alert variant="success">{success}</Alert>}
          
          {formData.data_name ? (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h5 className="text-black"> <strong>Restaurant Short Name</strong></h5>
                  <p className="text-black">{formData.short_name}</p>
                </Col>
                <Col md={6}>
                  <h5 className="text-black"> <strong>Restaurant Long Name</strong></h5>
                  <p className="text-black">{formData.long_name}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <h5 className="text-black"> <strong>Email</strong></h5>
                  <p className="text-black">{formData.email || "N/A"}</p>
                </Col>
                <Col md={4}>
                  <h5 className="text-black"> <strong>Phone Number</strong></h5>
                  <p className="text-black">{formData.phone}</p>
                </Col>

              </Row>

              <div className="mb-3">
                <h5 className="text-black"> <strong>Description</strong></h5>
                <p className="text-black preserve-linebreaks">{formData.store_description}</p>
              </div>

              <div className="mb-3">
                <h5 className="text-black"> <strong>Our Menu Description</strong></h5>
                <p className="text-black preserve-linebreaks">{formData.our_menu_description}</p>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1 text-black"><strong>Street Address:</strong></p>
                  <p className="text-black">{formData.address}</p>
                </Col>

                <Col md={6}>
                  <p className="mb-1 text-black"><strong>Postal Code:</strong></p>
                  <p className="text-black">{formData.postal_code}</p>
                </Col>
              </Row>
              <Row className="mb-3">
                 <Col md={4}>
                  <p className="mb-1 text-black"><strong>City:</strong></p>
                  <p className="text-black">{formData.city}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1 text-black"><strong>Province/State:</strong></p>
                  <p className="text-black">{formData.province}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1 text-black"><strong>Country:</strong></p>
                  <p className="text-black">{formData.country}</p>
                </Col>
                
              </Row>

              {/* {bannerPreview && (
                <div className="mb-3">
                  <h5>Homepage Banner</h5>
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="banner-preview-image"
                  />
                </div>
              )} */}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-black mb-3">No store details found. Click "Edit Details" to add store information.</p>
              <Button variant="outline-primary" onClick={() => setIsEditMode(true)}>
                Add Store Details
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Edit Mode - Show form
  if (!isLoading && isEditMode) return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0 text-black">Update Store Details</h3>
        <Button variant="outline-secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>

          <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="text-black">Restaurant Short Name</Form.Label>
                <Form.Control
                  type="text"
                  name="short_name"
                  value={formData.short_name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="text-black">Restaurant Long Name</Form.Label>
              <Form.Control
                type="text"
                name="long_name"
                value={formData.long_name}
                onChange={handleChange}
              />
            </Form.Group>
            </Col>

          </Row>
          <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-black">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-black">Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number"
                        />
                    </Form.Group>
                </Col>
            </Row>

          <Form.Group className="mb-3">
            <Form.Label className="text-black">Homepage Story</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              name="store_description"
              value={formData.store_description}
              onChange={handleChange}
              required
              placeholder="Enter restaurant description"
            />
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label className="text-black">Menu page description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="our_menu_description"
              value={formData.our_menu_description}
              onChange={handleChange}
              required
              placeholder="Enter restaurant description"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="text-black">Street Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter street address"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-black">City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-black">Province</Form.Label>
                <Form.Control
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  placeholder="Enter province or state"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-black">Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  placeholder="Enter country"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-black">Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                  placeholder="Enter postal code"
                />
              </Form.Group>
            </Col>
          </Row>


          

          {/* <Form.Group className="mb-3">
            <Form.Label>Homepage Banner Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleBannerFileChange}
            />
            <Form.Text className="text-muted">
              Select an image file for the homepage banner (JPG, PNG, GIF, etc. - Max 5MB)
            </Form.Text>
            {bannerPreview && (
              <div className="mt-3">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="banner-preview-image"
                />
              </div>
            )}
          </Form.Group> */}

          <Button variant="outline-primary" type="submit"  className="submit-button-right">
             Update
          </Button>
        </Form>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-black">Confirm Update</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-black">Are you sure you want to update the store details? This will overwrite the current information.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="outline-primary" onClick={confirmUpdate}>
              Confirm Update
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
}

