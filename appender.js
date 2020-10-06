const csv = require('csvtojson');
const out = require('jszip/lib/object');
const fs = require('fs')

csv()
    .fromFile('Codes3.csv')
    .then((jsonObj) => {
        let headers = Object.keys(jsonObj[0])
        let output = []
        for(let j=0; j<jsonObj.length; j++) {
            let row = jsonObj[j];
            let code = row.Code.substr(0, 2);
            let outputRow = {}
            if(row[headers[1]] == undefined || row[headers[1]] == '') {
                continue;
            }
            
            for(let i=1; i<headers.length; i++) {
                if (output.length == 0) {
                    if(row[headers[i]] !== undefined && row[headers[i]] !== '') {
                        outputRow.Code = code
                        outputRow[headers[i]] = row[headers[i]]
                    }
                } else {
                    let indexOfMatch = 0;
                    while(indexOfMatch<output.length) {
                        if (output[indexOfMatch].Code == code) {
                            break;
                        }
                        indexOfMatch++;
                    }
                    if (indexOfMatch == output.length) {
                        outputRow.Code = code
                        outputRow[headers[i]] = row[headers[i]]
                        continue
                    }
                    let rowOfMatch = output[indexOfMatch];
                    if(row[headers[i]] !== undefined && row[headers[i]] !== '' && rowOfMatch[headers[i]] !== undefined) {
                        rowOfMatch[headers[i]] = [rowOfMatch[headers[i]] ,row[headers[i]]].join('\n')
                        output[indexOfMatch] = rowOfMatch
                    }
                }
            }
            if(outputRow.Code !== undefined) {
                output.push(outputRow)
            }
        }


        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(output[0])
        let csvData = output.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        // console.log(csvData)
        csvData.unshift(header.join(','))
        csvData = csvData.join('\r\n')
        // console.log(csvData)

        fs.writeFileSync('awesome.csv', csvData)
    })