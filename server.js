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
        doc2.setData(obj);

        try {
            doc.render();
            doc2.render();
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
        var buf2 = doc2.getZip().generate({ type: 'nodebuffer' });

        fs.mkdirSync(path.resolve(__dirname, obj.XXX + ' Market'));
        fs.writeFileSync(path.resolve(path.resolve(__dirname, obj.XXX + ' Market'), 'Global ' + obj.XXX + " Market Industry Research Report, Opportunities & Forecast, 2018-2025.docx"), buf2);
        fs.writeFileSync(path.resolve(path.resolve(__dirname, obj.XXX + ' Market'), 'Document.rtf'), buf);
        mv('./Codes.csv', path.resolve(__dirname, obj.XXX + ' Market') + '/Codes.csv', function (err) {
            console.log('Done');
        })
    });

var randomJson = {
    XXX: 'lololo',
    BBB: 'GE'
}