/**
 * Local service that will count the characters in the file buffer
 */
module.exports = {
  execute: ({ filebuffer, filename }, serviceCallback) => {
    const request = require("request");

    console.log(
      "starting service LocalService for ",
      filename,
      "buffer: ",
      filebuffer
    );

    var filenameExact = filename.split("-").slice(-1)[0];
	 
    var text = "";
      try {
        text = filebuffer.toString("utf-8");
      } catch (error) {
        console.log(error);
        serviceCallback(error.status, {
          error: "File format cannot be translated",
        });
      }
      
    var textLength = text.length;
    
    serviceCallback(200, {
      result: `Der Text der Datei ${filenameExact} enthielt ${textLength} Zeichen!`,
    });   
  }
};
