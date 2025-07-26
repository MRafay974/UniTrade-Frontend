import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styles.css";

const API_BASE_URL = 'https://buy-sell-app-backend.vercel.app';

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response?.status === 413) {
      return Promise.reject(new Error('Image file size too large. Please upload smaller images.'));
    }
    if (error.response?.status === 415) {
      return Promise.reject(new Error('Unsupported file type. Please upload images only.'));
    }
    return Promise.reject(error);
  }
);

const AddProduct = () => {
  const defaultProducts = {
    name: "",
    price: "",
    category: "",
    description: "",
    details: {
      brand: "",
      condition: "new",
      warranty: "",
      features: ""
    },
    images: [null, null, null],
    inStock: true,
    onSaleNow: false,
    salePrice: "",
  };

  const [product, setProduct] = useState(defaultProducts);
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    images: ["", "", ""],
    submit: ""
  });
  const [previews, setPreviews] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingProducts, setExistingProducts] = useState([]);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/fetchProduct`);
        if (response.data) {
          setExistingProducts(response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const onChangeProductInput = (field, value, index = null) => {
    if (field === "images" && index !== null) {
      setProduct((prevProduct) => {
        const newImages = [...prevProduct.images];
        newImages[index] = value;
        return { ...prevProduct, images: newImages };
      });
      setErrors((prevErrors) => {
        const newImageErrors = [...prevErrors.images];
        newImageErrors[index] = "";
        return { ...prevErrors, images: newImageErrors };
      });
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [field]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  const onProductImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      onChangeProductInput("images", file, index);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let productErrors = {
      name: "",
      price: "",
      category: "",
      description: "",
      images: ["", "", ""],
      submit: ""
    };
    let isValid = true;

    if (!product?.name?.trim()) {
      productErrors.name = "Product name is required";
      isValid = false;
    }
    if (!product?.price?.trim()) {
      productErrors.price = "Product price is required";
      isValid = false;
    }
    if (!product?.category?.trim()) {
      productErrors.category = "Product category is required";
      isValid = false;
    }
    if (!product?.description?.trim()) {
      productErrors.description = "Product description is required";
      isValid = false;
    }
    if (product?.description?.trim().length < 10) {
      productErrors.description = "Description must be at least 10 characters long";
      isValid = false;
    }

    let hasImage = product.images.some((image) => !!image);
    if (!hasImage) {
      productErrors.images[0] = "At least one product image is required";
      isValid = false;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    product.images.forEach((image, index) => {
      if (image) {
        if (image.size > 5 * 1024 * 1024) {
          productErrors.images[index] = "Image size should be less than 5MB";
          isValid = false;
        }
        if (!allowedTypes.includes(image.type)) {
          productErrors.images[index] = "Only JPG, PNG and WebP images are allowed";
          isValid = false;
        }
      }
    });

    setErrors(productErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (validateForm()) {
        const formData = new FormData();
        Object.keys(product).forEach(key => {
          if (key === 'images') {
            product.images.forEach((image) => {
              if (image) {
                formData.append("images", image);
              }
            });
          } else if (key === 'details') {
            formData.append('details', JSON.stringify(product.details));
          } else {
            formData.append(key, product[key].toString());
          }
        });

        const response = await axios.post(
          `http://localhost:9000/products/addProduct`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          setShowSuccess(true);
          resetForm();
        } else {
          throw new Error('Failed to add product');
        }
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || error.message || "Failed to add product"
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProduct(defaultProducts);
    setPreviews([null, null, null]);
    setErrors({
      name: "",
      price: "",
      category: "",
      description: "",
      images: ["", "", ""],
      submit: ""
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-header">
          <h1 className="form-title">Add New Product</h1>
          <p className="form-subtitle">Fill in the details to list your product</p>
        </div>

        {showSuccess && (
          <div className="success-message">
            <span>✓ Product added successfully!</span>
            <button type="button" onClick={() => setShowSuccess(false)} className="close-button">×</button>
          </div>
        )}

        <div className="input-group">
          <div>
            <label className="form-label">Product Name <span className="required">*</span></label>
            <input
              type="text"
              className="form-input"
              value={product.name}
              onChange={(e) => onChangeProductInput('name', e.target.value)}
              placeholder="Enter product name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div> 
            <label className="form-label">Price <span className="required">*</span></label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={product.price}
              onChange={(e) => onChangeProductInput('price', e.target.value)}
              placeholder="Enter price"
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div>
            <label className="form-label">Category <span className="required">*</span></label>
            <select
              className="form-input"
              value={product.category}
              onChange={(e) => onChangeProductInput('category', e.target.value)}

            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="books">Books & Media</option>
              <option value="other">Other</option>
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
        </div>

        <div className="input-group">
          <div style={{ gridColumn: 'span 5' }}>
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea
              className="form-input description-input"
              value={product.description}
              onChange={(e) => onChangeProductInput('description', e.target.value)}
              placeholder="Provide a detailed description of your product..."
              rows={4}
              col={50}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
        </div>

        <div className="image-upload-section">
          <h3 className="section-title">Product Images</h3>
          <div className="input-group image-grid">
            {[0, 1, 2].map((index) => (
              <div key={index} className="image-upload-container">
                <label className="form-label">
                  Image {index + 1} {index === 0 && <span className="required">*</span>}
                </label>
                <div
                  className="image-upload"
                  onClick={() => document.getElementById(`image-${index}`).click()}
                >
                  {previews[index] ? (
                    <>
                      <img
                        src={previews[index]}
                        alt={`Preview ${index + 1}`}
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangeProductInput('images', null, index);
                          setPreviews(prev => {
                            const newPreviews = [...prev];
                            newPreviews[index] = null;
                            return newPreviews;
                          });
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="upload-placeholder">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Click to upload image</span>
                    </div>
                  )}
                  <input
                    id={`image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onProductImageChange(index, e)}
                    style={{ display: 'none' }}
                  />
                </div>
                {errors.images[index] && (
                  <span className="error-text">{errors.images[index]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading-text">
              <i className="fas fa-spinner fa-spin"></i> Adding Product...
            </span>
          ) : (
            'Add Product'
          )}
        </button>

        {errors.submit && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {errors.submit}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;