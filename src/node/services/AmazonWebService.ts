/// <reference path="../typings/index.d.ts" />
/// <reference path="../../../node_modules/aws-sdk/clients/ec2.d.ts" />

// tslint:disable:object-literal-shorthand

/*
 * Copyright 2013. Amazon Web Services, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class AmazonWebService {

    private AWS;

    constructor() {

        // load the https library
        const https = require("https");

        // set max connections
        const agent = new https.Agent({
            maxSockets: 25,
        });

        // load the SDK and UUID
        const AWS = require("aws-sdk");

        AWS.config.update({
            httpOptions: {
                agent: agent,
            },
        });

        // load AWS Credentials from file
        // ======================================
        AWS.config.loadFromPath("./static/node/aws-config.json");

        this.AWS = AWS;
    }

    public getRoute53HostedZones() {

        return new Promise((resolve, reject) => {

            const zones = this.queryRoute53HostedZones();

            zones.on("success", (response) => {
                resolve(this.generateHostedZones(response.data));
            }).on("error", (error, response) => {
                reject(false);
            });

        });

    }

    public getRoute53Records(hostedZone: string, nextRecordIdentifier?: string) {

        return new Promise((resolve, reject) => {

            const domains = this.queryRoute53Records(hostedZone, nextRecordIdentifier);

            domains.on("success", (response) => {

                response.data.ResourceRecordSets = response.data.ResourceRecordSets.sort((a, b) => {
                    const x = a.Name;
                    const y = b.Name;

                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });

                resolve(response.data);

            }).on("error", (error, response) => {
                reject(false);
            });

        });

    }

    public getEC2Instances(tag?: IEC2InstanceTag) {

        return new Promise((resolve, reject) => {

            const instances = this.queryEC2Instances(tag);

            instances.on("success", (response) => {

                const ec2Instances = response.data as IEC2Reservations;

                resolve(this.generateInstances(ec2Instances.Reservations));

            }).on("error", (error, response) => {
                reject(false);
            });

        });
    }

    public getEC2Instance(instance: string) {

        return new Promise((resolve, reject) => {

            const instances = this.queryEC2Instance(instance);

            instances.on("success", (response) => {

                const ec2Instances = response.data as IEC2Reservations;

                resolve(ec2Instances.Reservations[0]);

            }).on("error", (error, response) => {
                reject(false);
            });

        });
    }

    private queryRoute53HostedZones() {

        // create Route53 service object
        // ===========================================
        const route53 = new this.AWS.Route53();

        const params = {
            MaxItems: "100",
        };

        // returns a list of your public and private hosted zones registered to the current AWS account.
        return route53.listHostedZones(params, (error, data) => {

            if (error) {
                console.error("Error", error.stack);
            }

        });
    }

    private generateHostedZones(zones: IRoute53HostedZones) {
        return zones.HostedZones.sort((a, b) => {
            const x = a.Name;
            const y = b.Name;

            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    private queryRoute53Records(hostedZone: string, startRecordName?: string) {

        // create Route53 service object
        // ===========================================
        const route53 = new this.AWS.Route53();

        const params: any = {
            HostedZoneId: hostedZone,
            MaxItems: "100",
        };

        if ("undefined" !== startRecordName) {
            params.StartRecordName = startRecordName;
        }

        // returns all the resource record sets in the specified hosted zone for the current AWS account.
        return route53.listResourceRecordSets(params, (error, data) => {

            if (error) {
                console.error("Error", error.stack);
            }

        });
    }

    private queryEC2Instances(tag?: IEC2InstanceTag) {

        // create EC2 service object
        // ===========================================
        const ec2: AWS.EC2 = new this.AWS.EC2({ apiVersion: "2016-11-15" });

        const params: any = {
            DryRun: false,
        };

        if (undefined !== tag && null !== tag) {

            params.Filters = [{
                Name: `tag:${tag.Key}`,
                Values: [tag.Value],
            }];

        }

        // call EC2 to retrieve the policy for selected bucket
        return ec2.describeInstances(params, (error, data) => {

            if (error) {
                console.error("Error", error.stack);
            }

        });
    }

    private generateInstances(reservations: IEC2Instances[]) {

        const environments: IEC2Environment[] = [];

        reservations.forEach((Reservation) => {

            Reservation.Instances.forEach((Instance) => {

                const dns = Instance.Tags.find((x) => x.Key === "DNS");

                if (undefined !== dns) {

                    const environment = {
                        ReservationId: Reservation.ReservationId,
                        InstanceId: Instance.InstanceId,
                        Status: Instance.State.Name,
                        PublicDnsName: dns.Value.replace(new RegExp("(.*)\.$"), "$1"),
                        InstanceType: Instance.InstanceType,
                    } as IEC2Environment;

                    environments.push(environment);
                }

            });

        });

        return environments.sort((a, b) => {
            const x = a.PublicDnsName;
            const y = b.PublicDnsName;

            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    private queryEC2Instance(instance: string) {

        // create EC2 service object
        // ===========================================
        const ec2: AWS.EC2 = new this.AWS.EC2({ apiVersion: "2016-11-15" });

        const params: any = {
            DryRun: false,
            InstanceIds: [instance],
        };

        // call EC2 to retrieve the policy for selected bucket
        return ec2.describeInstances(params, (error, data): void => {

            if (error) {
                console.error("Error", error.stack);
            }

        });
    }
}
