import { useState } from "react";
import "./App.css";
import axios from "axios";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";


function App() {
  let [page_type, SetPage_type] = useState("");
  const [page, setPage] = useState("");

  const title = `If continous pages are required, use '-' in between first and last page number.


  Example:1-5,here you will get page 1 till page 5 in chronological order.

  If you want a particular page only, simply give that page number.

  Example:6, this give only page number 6. Use ',' to seperate each set or individual pages.`;

  function handleFileSelect(e) {
    let file = e.target.files[0];

    if (!e.target.value.includes(".pdf")) {
      alert("Select A pdf format file");
      e.target.value="";
    } else {
      SetPage_type(file);
    }
  }

  const handlePageChange = (e) => {
    setPage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!page_type) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", page_type);

    try {
      let response = await axios.post(
        `http://localhost:5000/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (await response) {
        alert("Page is uploaded succesfully");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleExtractPage = async () => {
    try {
      let body = {
        name: page_type.name,
        page_no: page,
      };
      await axios
        .post(`http://localhost:5000/upload/page`, body)
        .then((res) => {
          axios
            .get(`http://localhost:5000/upload/page?name=${res.data.name}`)
            .then((data) => {
              window.open(data.config.url, "_blank");
            });
        });
    } catch (error) {
      if (page_type === "") {
        alert("Please select a file");
      } else {
        alert("Enter a valid page number");
      }
    }
  };

  return (
    <div className="container" id="container-test">
      <h1 id="header-test" className="heading">
        PDF UPLOADER
      </h1>
      <div className="container-form">
        <input
          type="file"
          accept="image/*,.pdf"
          id="upload"
          className="input-file"
          onChange={handleFileSelect}
        />
        <br />
        <label className="label-page">Pages to be extracted : </label>
        <input
          type="text"
          className="page-input"
          data-testid="page-input"
          onChange={handlePageChange}
          placeholder="eg:1-5,9,10-13"
        />
        <Tooltip data-testid="tooltip" className="tooltip" title={title}>
          <Button data-testid="info" sx={{ m: 0 }}>
            <h3 className="info">!</h3>
          </Button>
        </Tooltip>
        <br />
        <div className="btn-col">
          <button onClick={handleSubmit} className="Submit-btn">
            <h1>Submit PDF</h1>
          </button>
          <input
            type="button"
            className="extract-btn"
            value="Extract PDF"
            target="__blank"
            onClick={handleExtractPage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
