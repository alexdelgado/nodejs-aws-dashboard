/// <reference path="../typings/index.d.ts" />

import { AmazonWebService } from "./services/AmazonWebService";
import { ApiUrlService } from "./services/ApiUrlService";
import { EnvironmentUrlService } from "./services/EnvironmentUrlService";

export class App {

    public init(): void {
        this.route();
    }

    private route(): void {
        const route = window.location.pathname.replace(/(\w+)\/$/, "$1");
        const path = window.location.pathname.split("/");

        if (undefined !== path[1]) {

            // Route53 Routes
            if ("route53" === path[1]) {

                const zoneId: string = (undefined !== path[3] ? path[3] : null);
                const zoneName: string = (undefined !== path[4] ? path[4] : null);

                if (null !== zoneId) {
                    return this.route53Controller(zoneId, zoneName);
                }

            } else if ("ec2" === path[1]) {
                const tag: string = (undefined !== path[2] && "tag" === path[2] ? path[3] : null);
                const instance: string = (undefined !== path[2] && "instance" === path[2] ? path[3] : null);

                if (null !== tag) {
                    return this.ec2Controller(tag);
                } else if (null !== instance) {
                    return this.ec2InstanceController(instance);
                }

            }

        }

        console.info("route", route);

        switch (route) {
            case "/":
                this.branchController();
                break;
            case "/api-listing":
                this.apiController();
                break;
            case "/ec2":
                this.ec2Controller();
                break;
            case "/route53":
                this.route53Controller();
                break;
        }
    }

    private branchController(): void {
        const urlService = new EnvironmentUrlService();

        urlService.getProductionVersion("", "#abc-network-prod");
        urlService.getProductionVersion("", "#abc-network-cms-prod");

        urlService.getProductionVersion("", "#def-network-prod");
        urlService.getProductionVersion("", "#def-network-cms-prod");

        urlService.getProductionVersion("", "#abc-network-stg");
        urlService.getProductionVersion("", "#abc-network-cms-stg");

        urlService.getProductionVersion("", "#def-network-stg");
        urlService.getProductionVersion("", "#def-network-cms-stg");

        $("#cms-environments").on("submit", (e: JQueryEventObject): void => {
            e.preventDefault();

            const branch: string = $("#branch-name").val().replace("/", "-");

            const output = urlService.generateEnvironmentUrls(branch);

            $("#jump-links").show();
            $("#jump-to-top").show();
            $("#environment-urls").html("").html(output);

        });
    }

    private apiController(): void {
        const apiUrlService = new ApiUrlService();

        $("#api-environments").on("submit", (e: JQueryEventObject): void => {
            e.preventDefault();

            const station: string = $("#station").val();

            const output = apiUrlService.generateEnvironmentUrls(station);

            $("#jump-links").show();
            $("#jump-to-top").show();
            $("#environment-urls").html("").html(output);

        });
    }

    private ec2Controller(tag?: string): void {
        const aws = new AmazonWebService();

        aws.getEC2Instances(tag);
    }

    private ec2InstanceController(instance: string): void {
        const aws = new AmazonWebService();

        $("h1").append(": " + instance);
        aws.getEC2Instance(instance);
    }

    private route53Controller(zoneId?: string, zoneName?: string): void {
        const aws = new AmazonWebService();

        if (undefined !== zoneId && null !== zoneId) {

            $("h1").append(": " + zoneName);

            aws.getRoute53Domains(zoneId);

        } else {
            aws.getRoute53HostedZones();
        }

        $("#hosted-zone-pagination").on("click", (e) => {
            e.preventDefault();

            $("#loading").show();
            aws.getRoute53Domains(zoneId, $(e.target).data("nextrecordname"));
        });

    }
}
