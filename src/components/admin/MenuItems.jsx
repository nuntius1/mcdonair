import { useState, useEffect, useContext } from "react";
import { Form, Button, Card, Alert, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import { api } from "../users/api";
import AuthContext from "../../contexts/AuthContext";
import { Plus, Edit, Trash2 } from "lucide-react";

const CATEGORIES = ["Wraps", "Platters", "Sides & Salads", "Drinks & Sweets"];

export default function MenuItems() {

  const {auth, setAuth} = useContext(AuthContext);
  
  const [menuItems, setMenuItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    created_by: 'system',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all menu items on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("/api/menu/all");
      if (response.data.success) {
        setMenuItems(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to fetch menu items");
    } finally {
      setIsFetching(false);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    // If user clears the file input, reset to null (will use existing image if editing)
    if (!file) {
      setImageFile(null);
      setError("");
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      setImageFile(null);
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      setImageFile(null);
      return;
    }
    
    // Create a new File with a unique name if needed
    // The File constructor takes: fileBits (array), fileName, options
    const fileExtension = file.name.split('.').pop();
    const newFileName = `${file.name.split('.')[0]}-${Date.now()}.${fileExtension}`;
    const newFile = new File(
      [file], // fileBits - array containing the file data
      newFileName, // fileName
      {
        type: file.type,
        lastModified: file.lastModified
      }
    );
    
    setImageFile(newFile);
    setError("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate that image is selected (only for new items)
    if (!editingItem && !imageFile) {
      setError("Please select an image file");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData to send file
      const submitData = new FormData();

      console.log(imageFile);
      
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      submitData.append("created_by", formData.created_by);
      
      // Use update route if editing, otherwise use add route
      const endpoint = editingItem ? "/api/menu/update-menu-item" : "/api/menu/add-menu-item";
      
      if (editingItem) {
        submitData.append("unique_id", editingItem.unique_id);
        // If editing and no new file selected, use the existing image_key
        if (imageFile) {
          submitData.append("image_key", imageFile.name);
          submitData.append("image", imageFile);
        } else {
          // Keep the existing image_key when no new file is selected
          submitData.append("image_key", editingItem.image_key || "");
        }
      } else {
        // For new items, image is required
        if (imageFile) {
          submitData.append("image_key", imageFile.name);
          submitData.append("image", imageFile);
        }
      }

      const response = editingItem 
        ? await api.put(endpoint, submitData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await api.post(endpoint, submitData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
      setSuccess(editingItem ? "Menu item updated successfully!" : "Menu item added successfully!");
      setShowForm(false);
      // Reset form
      resetForm();
      // Refresh menu items list
      fetchMenuItems();
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      created_by: 'system',
    });
    setImageFile(null);
    setEditingItem(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      unique_id: item.unique_id || "",
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "",
      created_by: item.created_by || 'system',
    });
    setImageFile(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = (e, item) => {
    e.preventDefault();
    console.log('item', item);
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setError("");
    setSuccess("");
    if (!itemToDelete) return;
    console.log('itemToDelete', itemToDelete);
    
    try {
      setIsLoading(true);
      const response = await api.delete("/api/menu/delete", {
        data: { id: itemToDelete.unique_id }
      });
      
      if (response.data.success) {
        setSuccess("Menu item deleted successfully!");
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchMenuItems();
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      setSuccess("");
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  if (isFetching) {
    return (
      <Card>
        <Card.Body>
          <p className="text-black">Loading menu items...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-black">Menu Items</h3>
            <Button variant="outline-primary" onClick={handleAddNew}>
              <Plus size={18} className="me-2 mb-1"  style={{ display: "inline-block" }} />
              Menu Item
            </Button>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}

      {/* Menu Items List */}
      {!showForm && (
        // <Card>
          <Card.Body>
            {menuItems.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-black">No menu items found. Click "Add Menu Item" to create one.</p>
              </div>
            ) : (
              <div>
                {CATEGORIES.map((category) => {
                  const categoryItems = menuItems.filter((item) => item.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-5">
                      <h4 className="mb-3 pb-2 border-bottom text-black">{category}</h4>
                      <Row>
                        {categoryItems.map((item) => (
                          <Col md={6} lg={4} key={item.id} className="mb-4">
                            <Card className="h-100 d-flex flex-column">
                              {item.image_key && (
                                <Card.Img 
                                  variant="top" 
                                  src={item.image_key ? `${window.location.origin}/api/images/file/${item.image_key}` : undefined} 
                                  alt={item.name}
                                  style={{ height: "200px", objectFit: "cover" }}
                                />
                              )}
                              <Card.Body className="d-flex flex-column flex-grow-1">
                                <Card.Title className="mb-2 text-black">{item.name}</Card.Title>
                                <Card.Text className="text-black small mb-2 flex-grow-1" style={{ minHeight: "60px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                                  {item.description}
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="badge bg-secondary">{item.category}</span>
                                  <span className="fw-bold text-black">${parseFloat(item.price).toFixed(2)}</span>
                                </div>
                                <div className="d-flex gap-2 mt-auto">
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    onClick={() => handleEdit(item)}
                                    className="flex-grow-1 d-flex align-items-center justify-content-center"
                                    style={{ minWidth: 0 }}
                                  >
                                    <Edit size={14} className="me-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={(e) => handleDelete(e, item)}
                                    className="flex-grow-1 d-flex align-items-center justify-content-center"
                                    style={{ minWidth: 0 }}
                                  >
                                    <Trash2 size={14} className="me-1" />
                                    Delete
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  );
                })}
                {/* Show items with uncategorized or other categories not in CATEGORIES array */}
                {menuItems
                  .filter((item) => !CATEGORIES.includes(item.category))
                  .length > 0 && (
                  <div className="mb-5">
                    <h4 className="mb-3 pb-2 border-bottom text-black">Other</h4>
                    <Row>
                      {menuItems
                        .filter((item) => !CATEGORIES.includes(item.category))
                        .map((item) => (
                          <Col md={6} lg={4} key={item.id} className="mb-4">
                            <Card className="h-100 d-flex flex-column">
                              {item.image_key && (
                                <Card.Img 
                                  variant="top" 
                                  src={item.image_key ? `${window.location.origin}/api/images/file/${item.image_key}` : undefined} 
                                  alt={item.name}
                                  style={{ height: "200px", objectFit: "cover" }}
                                />
                              )}
                              <Card.Body className="d-flex flex-column flex-grow-1">
                                <Card.Title className="mb-2 text-black">{item.name}</Card.Title>
                                <Card.Text className="text-black small mb-2 flex-grow-1" style={{ minHeight: "60px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                                  {item.description}
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="badge bg-secondary">{item.category}</span>
                                  <span className="fw-bold text-black">${parseFloat(item.price).toFixed(2)}</span>
                                </div>
                                <div className="d-flex gap-2 mt-auto">
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    onClick={() => handleEdit(item)}
                                    className="flex-grow-1 d-flex align-items-center justify-content-center"
                                    style={{ minWidth: 0 }}
                                  >
                                    <Edit size={14} className="me-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={(e) => handleDelete(e, item)}
                                    className="flex-grow-1 d-flex align-items-center justify-content-center"
                                    style={{ minWidth: 0 }}
                                  >
                                    <Trash2 size={14} className="me-1" />
                                    Delete
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                    </Row>
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0 text-black" style={{ width: "100%" }}> {editingItem ? "Edit Menu Item" : "Add Menu Item"}</h3>
            <Button variant="outline-secondary" size="sm" onClick={() => { setShowForm(false); resetForm(); }}>
              Cancel
            </Button>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-black">Item Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter item name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-black">Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter item description"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-black">Price (CAD) *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price (e.g., 12.99)"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-black">Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-black">Image {!editingItem && "*"}</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editingItem}
                />
                <Form.Text className="text-black">
                  {editingItem ? "Leave empty to keep current image" : "Select an image file (JPG, PNG, GIF, etc. - Max 5MB)"}
                </Form.Text>
                {editingItem && editingItem.image_key && !imageFile && (
                  <div className="mt-2">
                    <p className="small text-black mb-1">Current image:</p>
                    <img 
                      src={editingItem.image_key ? `${window.location.origin}/api/images/file/${editingItem.image_key}` : undefined} 
                      alt={editingItem.name}
                      style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover", border: "1px solid #ddd", borderRadius: "4px", padding: "5px" }}
                    />
                  </div>
                )}
                {editingItem && imageFile && (
                  <div className="mt-2">
                    <p className="small text-black mb-1">New image (will replace current):</p>
                    <img 
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover", border: "1px solid #ddd", borderRadius: "4px", padding: "5px" }}
                    />
                  </div>
                )}
              </Form.Group>

              <Button variant="outline-primary" type="submit" disabled={isLoading} className="mt-3 submit-button-right">
                {isLoading ? (editingItem ? "Updating..." : "Adding...") : (editingItem ? "Update Item" : "Add Item")}
              </Button> 
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-black">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-black">Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="outline-danger" onClick={confirmDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

