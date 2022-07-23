/*
 * File Name: main.js
 * Description:
 *
 * Created Date: July 12 2022
 * Author: Zachary Martin
 *
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped/myfile`,
  pathProcessed = `${__dirname}/grayscaled`;    // directory doesn't exist
  //pathProcessed = `${__dirname}/unzipped/myfile`

// getting weird errors on directory routes. creating a redundant folder, but it's working


  /*
  let count = 0;

  IOhandler.unzip(zipFilePath, pathUnzipped)  
  .then(() => IOhandler.readDir(pathUnzipped))  // read in unzipped folder
  .then( (filePaths) => {                       // array of file paths
    filePaths.forEach(path => IOhandler.grayScale(path, pathProcessed + count++)) // each image will need its own path. tack somethign on ??
  } )  
  .catch( err => console.log(err));
  */
  

// this format works though
  IOhandler.unzip(zipFilePath,pathUnzipped)
  .then((msg)=>{
     console.log(msg);
     console.log("readDir running");  // debugging

     return IOhandler.readDir(pathUnzipped);
   })
   .then((result)=>{
    console.log(result);  // debugging   ** not getting anythign back!
    console.log("grayscale running");  // debugging
     return IOhandler.grayScale(result,pathProcessed);
   })
   .then((msg)=> console.log("msg"))
   .catch((err)=> console.log(err))

   