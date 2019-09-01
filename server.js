const JSZip = require('jszip'),
    Docxtemplater = require('docxtemplater'),
    fs = require('fs'),
    path = require('path');
const mv = require('mv');

var content2 = fs.readFileSync(path.resolve(__dirname, 'input2.docx'), 'binary');
var content = fs.readFileSync(path.resolve(__dirname, 'input3.docx'), 'binary');

var zip = new JSZip(content);
var zip2 = new JSZip(content2);

var doc = new Docxtemplater();
doc.loadZip(zip);
var doc2 = new Docxtemplater();
doc2.loadZip(zip2);

const csv = require('csvtojson');

csv()
    .fromFile('Codes.csv')
    .then((jsonObj) => {
        //Get the header.
        console.log("Analysing number of headers.")
        var headerArray = Object.keys(jsonObj[0]);
        console.log("Analysis done.")
        console.log("Possible number of folders to be created..." + (headerArray.length-1));

        console.log("Process started.")
        for(let i = 1; i <= headerArray.length; i++) {
            let tempEl = {};
            for(let j=0; j<=jsonObj.length; j++) {
                let row = jsonObj[j];
                if(row !== undefined) {
                    if(row.Code !== undefined && row.Code !== '' && row[headerArray[i]] !== undefined && row[headerArray[i]] !== '')
                        tempEl[row.Code] = row[headerArray[i]];
                }
            }
            doc.setData(tempEl);
            doc2.setData(tempEl);
            if(Object.keys(tempEl).length !== 0) {
                console.log("Generating docs for the market: " + tempEl.XXX);
                try {
                    doc.render();
                    doc2.render();
                    var buf = doc.getZip().generate({ type: 'nodebuffer' });
                    var buf2 = doc2.getZip().generate({ type: 'nodebuffer' });
    
                    fs.mkdirSync(path.resolve(__dirname, tempEl.XXX + ' Market'));
                    fs.writeFileSync(path.resolve(path.resolve(__dirname, tempEl.XXX + ' Market'), 'Global ' + tempEl.XXX + " Market Industry Research Report, Opportunities & Forecast, 2018-2025.docx"), buf2);
                    fs.writeFileSync(path.resolve(path.resolve(__dirname, tempEl.XXX + ' Market'), 'Document.rtf'), buf);
                    fs.createReadStream('Codes.csv').pipe(fs.createWriteStream(path.resolve(__dirname, tempEl.XXX + ' Market/Global ' + tempEl.XXX + ' Codes.csv')));
                    console.log("Completed generating folder " + tempEl.XXX + " with all the required files.");
                }
                catch (error) {
                    var e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    }
                    console.log("Error generating folder: " + tempEl.XXX);
                    console.log("Continuing with the next market.")
                }
            }
        }
        console.log("Process completed.")
    });