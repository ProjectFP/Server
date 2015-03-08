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
