const http = require('http');
const https = require('https');
const CsvJson = require('csvjson');
const Xlsx = require('xlsx');

function XlsxBufferToArray(buffer) {
    var workbook = XLSX.read(buffer);
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function (y) {
        var worksheet = workbook.Sheets[y];
        resolve(Xlsx.utils.sheet_to_json(worksheet));
    });
}

function CSVBufferToArry(buffer) {
    CsvJson.toObject(buffer.toString())
}

function loadRemoteFileToBuffer(url) {
    var request = url.startsWith("http://") ? http : https
    return new Promise((resolve, reject) => {
        request.get(url, function (response) {
            var buffers = [];
            response.on("data", (chunk) => {
                buffers.push(chunk);
            })
            response.on("end", function () {
                var buffer = Buffer.concat(buffers);
                resolve(buffer);
            })
            response.on("error", function (error) {
                reject(error);
            });
        });
    })
}

function getArrayData(url, type = "xlsx") {
    return loadRemoteFileToBuffer(url)
        .then(buffer => {
            switch (type) {
                case "xlsx": return XlsxBufferToArray(buffer);
                case "csv": return CSVBufferToArry(buffer);
                default: return [];
            }
        })
}

