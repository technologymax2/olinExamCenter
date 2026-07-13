import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Button } from "@material-ui/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { MdExpandLess } from 'react-icons/md';
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import "./addSection.css";
import AdminHome from "./home";
import Footer from "../../components/Footer";

function AddSection() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cat: "",
    detail: "",
    link: "",
    image: null,
  });
  const [sucssMessage, setSucssMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items to display per page

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/addsec");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append("name", formData.name);
    formDataWithImage.append("link", formData.link);
    formDataWithImage.append("price", formData.price);
    formDataWithImage.append("image", formData.image);
    formDataWithImage.append("detail", formData.detail);
    formDataWithImage.append("cat", formData.cat);

    try {
      await axios.post("http://localhost:5000/addsec", formDataWithImage);
      setFormData({
        name: "",
        link: "",
        price: "",
        cat: "",
        detail: "",
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
      await axios.delete(`http://localhost:5000/addsec/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleShowDetail = (id) => {
    const detailId = `detail-hide-display-${id}`;
    document.getElementById(detailId).style.display = "block";
  };

  const handleHideDetail = (id) => {
    const detailId = `detail-hide-display-${id}`;
    document.getElementById(detailId).style.display = "none";
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Calculate the range of items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data.slice(startIndex, endIndex);

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
                    <h2 className="addsectionTitle">Add Section</h2>
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
                          type="text"
                          name="cat"
                          placeholder="Category"
                          value={formData.cat}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="input-form-inputs-section-imput">
                        <input
                          type="text"
                          name="link"
                          placeholder="Preview URL"
                          value={formData.link}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group-section-input-price">
                        <input
                          type="text"
                          name="price"
                          placeholder="Price"
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="textarea-detail">
                        <textarea
                          type="text"
                          name="detail"
                          placeholder="detail"
                          value={formData.detail}
                          onChange={handleInputChange}
                        ></textarea>
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
                  {displayedData.map((item) => (
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
                        <div>
                          <a href={item.link}>
                            <button className="preview-button">Preview</button>
                          </a>
                          <>{item.price}</>

                          <button
                            onClick={() => handleShowDetail(item._id)}
                            className="detail-button"
                          >
                            Detail
                          </button>
                        </div>

                        <div
                          id={`detail-hide-display-${item._id}`}
                          className="detail-display"
                        >
                          <>{item.detail}</>
                          
                          <button
                            onClick={() => handleHideDetail(item._id)}
                            className="hide-button"
                          >
                             <MdExpandLess size={24} />
                          </button>
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

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="pagination-container">
                <Pagination
                  count={Math.ceil(data.length / itemsPerPage)}
                  color="secondary"
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddSection;
