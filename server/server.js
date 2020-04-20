const express = require('express')
const app = express()
const path = require('path');
const port = 8080

const client = require('prom-client');
const request = require('request');

const collectDefaultMetrics = client.collectDefaultMetrics;

// Probe every 5th second.
collectDefaultMetrics({ timeout: 5000 });
const runtimeEnv = process.argv[2];
let domainName = "http://localhost:8081"

if (runtimeEnv === "prod") {
    // domainName = "http://backend.api.svc.cluster.local:8080"
    domainName = "http://nginx-ingress-controller.api.svc.cluster.local:80"
}
console.log("Runtime Environment: " + runtimeEnv);

const histogram = new client.Histogram({
    name: 'api_call_hist',
    help: 'number of api calls',
    labelNames: ['host', 'path']
})

const counter = new client.Counter({
    name: 'api_call_count',
    help: 'number of api calls',
    labelNames: ['host', 'path']
})

const timeGauge = new client.Gauge({
    name: 'api_call_time',
    help: 'Time of api calls',
    labelNames: ['host', 'path']
})

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
    req.start = Date.now();
    req.end = histogram.labels(req.hostname, req.url).startTimer();
    next();
});

app.use('/', express.static('build'))
// const publicPath = path.join(__dirname, '../build'+ '/');
// app.use('/', express.static(publicPath))
app.use('/v1', (req, res) => {
    console.log("request url in server.js::::::" + req.url);
    let url = domainName + "/v1" + req.url;
    // let url = domainName  + req.url;

    console.log("url::::::" + url);
    req.pipe(request(url)).pipe(res);
})
app.get('/health', (req, res) => {
    res.statusCode = 200;
    res.send("Healthy!")
})
app.use(function (req, res, next) {
    let endTime = Date.now() - req.start;
    req.end();
    timeGauge.labels(req.hostname, req.url).set(endTime)
    counter.labels(req.hostname, req.url).inc()
    next();
});
app.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType)
    res.end(client.register.metrics())
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))