// tslint:disable:no-var-requires

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const awsService = require(path.join(__dirname, "services/AmazonWebService.js"));
const aws = new awsService.AmazonWebService();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/static", express.static(path.join(__dirname, "../")));

/**
 * Git Branch Routes
 */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "index.html"));
});

app.post("/", (req, res) => {
    const request = require("request");

    const options = {
        url: "http://" + req.body.url + "/version.json",
        hostname: req.body.url,
        path: "/version.json",
        method: "GET",
    };

    request(options, (error, response, body) => {

        if (error) {

            res.status(500).send(error);

        } else {

            try {
                const data = JSON.parse(body.replace(/[^a-z0-9\s{}:_""\.\/\\,\(\)]/gi, ""));

                res.status(200).send(data);

            } catch (e) {

                res.status(404).send("Unable to retrieve contents of: " + options.url);

            }
        }
    });
});

/**
 * Radio Player API Routes
 */
app.get("/api-listing", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "API/index.html"));
});

/**
 * Elastic Cloud Routes
 */
app.get("/ec2", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "EC2/index.html"));
});

app.post("/ec2", (req, res) => {

    aws.getEC2Instances().then((response) => {
        res.json(response);
    },
    (error) => {
        res.status(500).send("An error occured while attempting to contact AWS.");
    });
});

app.get("/ec2/tag/:tag", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "EC2/index.html"));
});

app.post("/ec2/tag/:tag?", (req, res) => {
    let tag = null;

    if (undefined !== req.body.Key && undefined !== req.body.Value) {

        tag = {
            Key: req.body.Key,
            Value: req.body.Value,
        };

    }

    aws.getEC2Instances(tag).then((response) => {
        res.json(response);
    },
    (error) => {
       res.status(500).send("An error occured while attempting to contact AWS.");
    });
});

app.get("/ec2/instance/:instanceId", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "EC2/instance-details.html"));
});

app.post("/ec2/instance/:instanceId", (req, res) => {

    aws.getEC2Instance(req.params.instanceId).then((response) => {
        res.json(response);
    },
    (error) => {
       res.status(500).send("An error occured while attempting to contact AWS.");
    });
});

/**
 * Route53 Routes
 */
app.get("/route53", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "Route53/index.html"));
});

app.post("/route53", (req, res) => {

    aws.getRoute53HostedZones().then((response) => {
        res.json(response);
    },
    (error) => {
        res.status(500).send("An error occured while attempting to contact AWS.");
    });
});

app.get("/route53/zone/:zoneId/:zone?", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "Route53/hosted-zone.html"));
});

app.post("/route53/zone/:zone/:nextRecordName?", (req, res) => {

    aws.getRoute53Records(req.params.zone, req.params.nextRecordName).then((response) => {
        res.json(response);
    },
    (error) => {
        res.status(500).send("An error occured while attempting to contact AWS.");
    });
});

const server = app.listen(8080);
