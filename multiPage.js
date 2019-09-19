const JSZip = require('jszip'),
    Docxtemplater = require('docxtemplater'),
    fs = require('fs'),
    path = require('path');

var content2 = fs.readFileSync(path.resolve(__dirname, 'input4.docx'), 'binary');
var jsZipContent = new JSZip(content2);

var doc = new Docxtemplater();
doc.loadZip(jsZipContent).setOptions({ paragraphLoop: true });

var data = [];

const csv = require('csvtojson');
csv()
    .fromFile('Codes1.csv')
    .then((jsonObj) => {
        console.log("Analysing number of headers.")
        var headerArray = Object.keys(jsonObj[0]);
        for(let i = 1; i <= headerArray.length; i++) {
            let tempEl = {};
            for(let j=0; j<=jsonObj.length; j++) {
                let row = jsonObj[j];
                if(row !== undefined) {
                    if(row.Code !== undefined && row.Code !== '' && row[headerArray[i]] !== undefined && row[headerArray[i]] !== '')
                        tempEl[row.Code] = row[headerArray[i]];
                }
            }
            data.push(tempEl);
            doc.setData(tempEl);
        }
        doc.setData({
            data: data
        })

        try {
            console.log("trial 1");
            console.log(data);
            doc.render();
        } catch(error) {
            console.log(error);
        }
        var buf2 = doc.getZip().generate({ type: "nodebuffer" }); 
        fs.writeFileSync(path.resolve(__dirname, "out.docx"), buf2)
    })   
       
