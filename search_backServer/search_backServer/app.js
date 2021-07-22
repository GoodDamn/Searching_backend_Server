var http = require('http');
const fs = require('fs');
const url = require('url');
const port = 1337;

var obj, phrases = [];
fs.readFile("jsons/trainings.json", "utf-8", (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    // Delete childs in json
    for (var i = 0; i < obj.length; i++) {
        delete obj[i]["Phrases"];
        delete obj[i]["ImageM"];
        delete obj[i]["ImageB"];
        phrases.push((obj[i]["Name"] + obj[i]["Desc"]).toLowerCase().replace(/\n/g, "").replace(/ /g, ""));
    }
});

var integers2;

function analyzing(query, response) {
    var integers = [];
    var minSum = 2147483647;
    for (var i = 0; i < phrases.length; i++)
    {
        if (phrases[i].toString().includes(query)) {
            if (minSum > phrases[i].length)
            {
                minSum = phrases[i].length;
                integers.push(i+1);
            }
        }
    }

    integers2 = [];
    var count = 0;
    if (integers.length - 7 >= 0) count = integers.length - 7;
    for (var i = (integers.length - 1); i >= count; i--) {
        integers2.push(obj[integers[i] - 1]);
        response.write(JSON.stringify(obj[integers[i] - 1]) + "\n");
    }
}

http.createServer((req, res) => {
    let urlRequest = url.parse(req.url, true);
    res.writeHead(200,{ "content-type": "application/json; charset=utf-8" });
    if (urlRequest.query.search)
    {
        analyzing(urlRequest.query.search, res);
        if (integers2.length == 0)
        {
            if (urlRequest.query.search.length >= 4)
            {
                analyzing(urlRequest.query.search.slice(1, 4), res);
                if (integers2.length == 0) res.end("No data. Sorry, dude :(");
            }
            else res.end("No data. Sorry, dude :(");
        }
        else res.end("");
    }
    else if (urlRequest.query.json == "trainings") // json
        res.end(JSON.stringify(obj));
    else if (urlRequest.query.info == "ip") // info
        res.end("Your ip: " + req.connection.remoteAddress);
    else res.end("Can you quess arguments? :)");
}).listen(port, () => {
    console.log("Server is running on port " + port + "...");
});