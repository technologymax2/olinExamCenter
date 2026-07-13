import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import "./addcategory.css";
import AdminHome from "./home";
import Footer from "../../components/Footer";

function AddCategory() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    min_price: "",
    max_price: "",
    image: null,
  });
  const [sucssMessage, setSucssMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/addcat");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else if (e.target.name === "name") {
      // Capitalize the first letter of the name
      const capitalizedValue =
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
      setFormData({ ...formData, [e.target.name]: capitalizedValue });
    } else if (e.target.name === "min_price" || e.target.name === "max_price") {
      // Ensure min_price is not greater than max_price
      if (
        e.target.name === "min_price" &&
        parseInt(e.target.value) > parseInt(formData.max_price)
      ) {
        setFormData({
          ...formData,
          [e.target.name]: formData.max_price,
          max_price: e.target.value,
        });
      } else if (
        e.target.name === "max_price" &&
        parseInt(e.target.value) < parseInt(formData.min_price)
      ) {
        setFormData({
          ...formData,
          [e.target.name]: formData.min_price,
          min_price: e.target.value,
        });
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append("name", formData.name);
    formDataWithImage.append("min_price", formData.min_price);
    formDataWithImage.append("max_price", formData.max_price);
    formDataWithImage.append("image", formData.image);

    try {
      await axios.post("http://localhost:5000/addcat", formDataWithImage);
      setFormData({
        name: "",
        min_price: "",
        max_price: "",
        image: null,
      });
      fetchData();
      setSucssMessage("Uploaded successfully");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/addcat/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div>
      <div className="section-body">
        <AdminHome />
        <div className="section-container">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography>
                  <div className="input-form-section">
                    <h2 className="addsectionTitle">Add Category</h2>
                    <form
                      onSubmit={handleSubmit}
                      encType="multipart/form-data"
                      className="input-form-inputs-section"
                    >
                      {sucssMessage && (
                        <p style={{ color: "green" }}>{sucssMessage}</p>
                      )}
                      <div className="input-form-inputs-section-imput">
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="input-form-inputs-section-imput">
                        <input
                          type="number"
                          name="min_price"
                          placeholder="Minimum Price"
                          value={formData.min_price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="input-form-inputs-section-imput">
                        <input
                          type="number"
                          name="max_price"
                          placeholder="Maximum Price"
                          value={formData.max_price}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="input-form-inputs-section-impu">
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload file
                          <input
                            type="file"
                            name="image"
                            className="uploadbtn-section"
                            onChange={handleInputChange}
                          />
                        </Button>
                      </div>

                      <Button variant="contained" type="submit" color="success">
                        Finish
                      </Button>
                    </form>
                  </div>
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="together-section-display">
                <ul>
                  {data.map((item) => (
                    <div className="dilete-view-btn-safe-div">
                      <li
                        key={item._id}
                        className="data-item-section-display-li"
                      >
                        {item.image && (
                          <div className="together-section-display-img">
                            <img src={item.image} alt="Uploaded" />
                          </div>
                        )}
                        <div className="section-name">
                          <strong>{item.name}</strong>
                        </div>
                        <div className="section-price">
                          <strong>
                            ${item.min_price} - ${item.max_price}
                          </strong>
                        </div>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </li>
                    </div>
                  ))}
                </ul>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddCategory;
