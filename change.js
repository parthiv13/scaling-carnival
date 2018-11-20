const csv = require('csvtojson');
var obj = {};
csv()
    .fromFile('Codes.csv')
    .then((jsonObj) => {
        for(let el of jsonObj) {
            if(el.Code != '')
            obj[el.Code] = el.Value;
        }
        console.log(obj)
    });