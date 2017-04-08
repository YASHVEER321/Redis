let express = require("express");
const app = express();
var redis = require('redis');
var client = redis.createClient();
var request = require('request');

var bodyParser = require('body-parser');
//var cors = require('cors')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.json({ type: 'application/json' }));

// client.get('frameworkf', function(err, reply) {
//     console.log(reply);
// });



// client.exists('framework', function(err, reply) {
//     if (reply === 1) {
//         console.log('exists');
//     } else {
//         console.log('doesn\'t exist');
//     }
// });
//app.use(bodyParser)
app.get("/set", (req, res) => {
    client.set('framework', 'Yash', function(err, reply) {
        client.expire('framework', 10);
        console.log(reply);
        res.send(reply);
    });

});

app.get("/check", (req, res) => {
    // client.exists('framework', function(err, reply) {
    //     if (reply === 1) {
    //         console.log('exists');
    //         res.send("exit");
    //     } else {
    //         res.send("does't exits");
    //         console.log('doesn\'t exist');
    //     }
    // });
    client.get('framework', function(err, reply) {
        console.log(reply);
        res.send(reply);
    });

})

app.post("/api", (req, res) => {
    let s = {}
    let key = {
        "brand": [],
        "frameSize": [],
        "frameStyle": [],
        "gender": ["Men", "Unisexxxxk"],
        "lensColor": [],
        "priceRangeFrom": 1,
        "priceRangeTo": 10000,
        "rimType": [],
        "weight": []
    }
    key = JSON.stringify(key);
    //let brand = req;
    client.exists(key.toString(), function(err, reply) {
        if (reply === 1) {
            console.log('exists');
            client.get(key.toString(), function(err, reply) {
                // console.log(reply);
                res.send(reply);
            });
        } else {
            console.log('doesn\'t exist');
            request({
                "url": 'https://lensclues.sia.co.in/product/test', //URL to hit
                'method': "POST",
                form: {
                    limit: 20
                },
                'Content-Type': 'application/json'
            }, function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log("Check", body);
                    client.set(key.toString(), body, function(err, reply) {
                        client.expire(key, 10);

                    });
                    res.send(body);

                }
            });
        }
    });
    console.log("Request", JSON.stringify(key))
})
app.listen(3000, (err) => {
    console.log("Server Start at 3000 port no")
})