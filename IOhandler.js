/*
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: July 12 2022
 * Author: Zachary Martin
 *
 */

// unzipper is a streaming api. will unzip code using streams
const unzipper = require("unzipper"),
  fs = require("fs"),
  fsP = fs.promises,
  PNG = require("pngjs").PNG,
  path = require("path");
  

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  // wrap the function in a promise
  return new Promise((resolve, reject) => {  // a way where you don't need this
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on('error', () => {
        reject("Error unzipping the file");
      })                   // or this
      .on('finish', () => {
        resolve("Unzip Successful");
      });                // or this
                                             // maye refer to 'Parse.promise() syntax sugar in notes
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
let pngFiles = [];
let pathFiles = [];

const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fsP.readdir(dir, "utf8")
      .then((data) => {
        pngFiles = data.filter((file) => path.extname(file).toLowerCase() == ".png");
        //pngFiles.forEach( element => pathFiles.push(path.resolve(`./unzipped/${element}`))); 
        pngFiles.forEach( element => pathFiles.push(path.resolve(`./unzipped/myfile/${element}`)));


        // debugging
        console.log("Printing path files " + pathFiles);   // debugging *********
        resolve(pathFiles);
      })
      .catch((err) => reject(err));
  });
};



/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
// input is a path to single image, output to where the grayscaled image will be
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {

    console.log("Inside gray scale function. pt 1");  // debugging
    let count = 1;

    // debuggin       // *********** path in is empty!
    console.log("\n-------------------");
    console.log(pathIn);
    console.log("-------------------\n");

    pathIn.forEach( element => {
      // this doesn't run... ?
      console.log("for loop ran");  // debugging     // not running
      fs.createReadStream(element)
      .pipe(
        // debug. dang can't print here
        new PNG()
      )
      .on("parsed", function () {
        // debugg
        console.log("parsed ran");

        console.log(this.height);
        console.log(this.length);


        
        for (var y = 0; y < this.height; y++) {
          //console.log("\nFirst for loop ran\n");  // not running
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            // debugging
            // hmmmmm this part isn't running =/
            // ***** if you have debugs in here it takes a million years *******
            //console.log("\n-------------------");
            //console.log("The pixel part ran");
            // console.log("-------------------\n");

            // grayscale:    // cool. this worked
            let luminosity =  0.2126 * this.data[idx] + 0.7152 * this.data[idx + 1] + 0.0722 * this.data[idx + 2];

            this.data[idx] = luminosity; //0.2126 * this.data[idx];
            this.data[idx + 1] = luminosity; //0.7152 * this.data[idx + 1];
            this.data[idx + 2] = luminosity; //0.0722 * this.data[idx + 2];

            // and reduce opacity
            //this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }
        

        this.pack().pipe(fs.createWriteStream(`${pathOut}/GS_${count}.png`));
        count++;
        resolve("Your photos have been GrayScaled");
      })
      .on("error", (error) => {
        reject(error)
      })

        });
      })

};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
