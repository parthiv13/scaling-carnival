const JSZip = require('jszip'),
    Docxtemplater = require('docxtemplater'),
    fs = require('fs'),
    path = require('path');

var content = fs.readFileSync(path.resolve(__dirname, 'input2.docx'), 'binary');

var zip = new JSZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

const csv = require('csvtojson');
var obj = {
    ppp: 'iei'
};
csv()
    .fromFile('Codes.csv')
    .then((jsonObj) => {
        for (let el of jsonObj) {
            if (el.Code != '' && el.Value != '') {
                //console.log(el.Code + "");
                obj[el.Code] = el.Value;
            }
        }
        console.log(obj);
        doc.setData(obj);
    });

var randomJson = {
    XXX: 'lololo',
    BBB: 'GE'
}

try {
    doc.render()
}
catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    console.log(JSON.stringify({ error: e }));

    throw error;
}

var buf = doc.getZip().generate({ type: 'nodebuffer' });

fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);