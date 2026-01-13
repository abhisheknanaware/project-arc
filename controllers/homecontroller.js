const Contact = require('../models/contact');

const { spawn } = require("child_process");

const fs=require('fs');

exports.gethome=(req,res,next)=>{
    res.render("index");
}
exports.postreqdata=(req,res,next)=>{
    const { name, phoneNumber, email, weatherdata,message } = req.body;
    const contact = new Contact({  name, phoneNumber, email, weatherdata,message });
    contact.save().then(()=>{
        console.log("New msg Details Received:", contact);
        res.redirect("/Contactus");
    })
    .catch(err => {
            console.log("Error while adding home:", err);
        });  
}

exports.getapidata=(req,res,next)=>{
  console.log("Received request for /api/data. Running Python script...");

  // Use 'python3' if 'python' doesn't work
  const pythonProcess = spawn("python", ["predict.py"]);

  let dataBuffer = "";
  let errorBuffer = "";

  pythonProcess.stdout.on("data", (data) => {
    dataBuffer += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorBuffer += data.toString();
    console.error(`Python STDERR: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);

    if (code !== 0) {
      return res
        .status(500)
        .json({ error: "Python script failed.", details: errorBuffer });
    }

    try {
      const jsonData = JSON.parse(dataBuffer);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({
        error: "Failed to parse JSON from Python script.",
        details: parseError.message,
        rawData: dataBuffer,
      });
    }
  });
};

exports.getaboutus=(req,res,next)=>{
    res.render("aboutus");
};

exports.getcontactus=(req,res,next)=>{
    res.render("Contactus");
}
exports.getlogin=(req,res,next)=>{
    res.render("login");
};

exports.postlogin=(req,res,next)=>{
  const reqbody = req.body;
  fs.appendFile(
    "userlogin.txt",
    JSON.stringify(reqbody, null, 2) + "\n",
    (err) => {
      if (err) throw err;
      console.log("data is written in the file");
      res.redirect("/");
    }
  );
};



