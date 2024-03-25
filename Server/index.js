const express = require("express");
const multer = require("multer");
const fs = require("fs");

const PDFLib = require("pdf-lib");

const cors = require("cors");

const app = express();

const port = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }

  res.status(200).send("File Uploaded to server");
});

app.post("/upload/page", async (req, res) => {
  let flag = 0;

  if (req.body.page_no === "" || req.body.name===undefined) {
    res.status(400).send("Enter a valid page number and select a pdf file");
  } else {
    const pdfBytes = await fs.readFileSync(`uploads/${req.body.name}`);

    const firstdoc = await PDFLib.PDFDocument.load(pdfBytes);

    const split_string = req.body.page_no;
    const pdfDoc = await PDFLib.PDFDocument.create();
    let num_list = split_string[0];

    //this for loop is to seperate types of page extraction i.e loop pages or certain page
    for (let i = 0; i < split_string.length; i++) {
      if (split_string[i + 1]) {
        if (split_string[i + 1] != "," || split_string[i + 1] != "-") {
          num_list += split_string[i + 1];
        }
      }
    }
    let num_final = num_list.split(",");

    // this for loop is for logic for page extraction based on loop pages or extract a certain page 
    for (let i = 0; i < num_final.length; i++) {
      if (num_final[i].includes("-")) {
        let inner_num = num_final[i].split("-");
        for (let i = parseInt(inner_num[0]); i <= parseInt(inner_num[1]); i++) {
          try {
            const [firstPage1] = await pdfDoc.copyPages(firstdoc, [i - 1]);
            pdfDoc.addPage(firstPage1);
          } catch (err) {
            flag = 1;
            res.status(400).send("error");
          }
        }
      } else if (!num_final[i].includes("-")) {
        try {
          const [firstPage1] = await pdfDoc.copyPages(firstdoc, [
            parseInt(num_final[i]) - 1,
          ]);
          pdfDoc.addPage(firstPage1);
        } catch (err) {
          flag = 1;
          res.status(400).send("error");
        }
      } else if (i === num_final.length - 1) {
        const [firstPage1] = await pdfDoc.copyPages(firstdoc, [
          parseInt(num_final[i]) - 1,
        ]);
        pdfDoc.addPage(firstPage1);
      }
    }
    if (flag != 1) {
      const pdfBytesresult = await pdfDoc.save();
      let filename = "new_pdf";
      fs.writeFileSync(filename, pdfBytesresult);

      res.status(200).json({ name: filename });
    }
  }
});



app.get("/upload/page", async (req, res) => {
  var data = fs.readFileSync(`${req.query.name}`);

  res.contentType("application/pdf");

  res.send(data);
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
