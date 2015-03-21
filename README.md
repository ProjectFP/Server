Project FP server-side POC

tesseract
https://www.npmjs.com/package/node-tesseract

Need this command to install canvas.js

wget https://raw.githubusercontent.com/LearnBoost/node-canvas/master/install -O - | sh

1. Install tesseract (brew install tesseract)
2. In repo directory, install Caman (https://github.com/Automattic/node-canvas/wiki/Installation---OSX)
3. npm install
4. Start server (nodemon app.js)
5. Go to localhost:3000, choose a file, and upload. If text is output onto the console, that means tesseract was able to read some of the text

Sources:
https://www.npmjs.com/package/node-tesseract
https://github.com/Automattic/node-canvas/wiki/Installation---OSX


Filter Testing Environment
The goal is to make filter testing faster by automating some of the repetitive actions. Once the environment is started, the original and filtered images will be displayed in the browser. The filtered image will automatically be sent to Tesseract after the filtering is done. The read text from Tesseract will be displayed in the browser and the page background color will change colors to reflect the result (green = successfully read all numbers, yellow = read something but not all numbers, red = didn't read anything)

Instructions for seting up the filter test environment

1. Make sure you have all the required packages (npm install, bower install)
2. Run 'gulp dev'
3. Create your filters in the filters.js file
4. Add your custom filters to the Caman stack (app.js file - loadImages function)
5. Save and your browser should automatically update

Notes:
1. To change the image that loads when the page loads, update the imagePath variable in the app.js file to an image in the public/img folder
2. To change the image manually in the browser, click on the 'choose file' button on the page to select another image from your hard drive