/// <reference path="../typings/index.d.ts" />

"use strict";

export class AmazonWebService {

    private tableSorterParams = {
        cssAsc: "header--asc",
        cssDesc: "header--desc",
        cssHeader: "header",
    };

    private pagination = "";

    public getRoute53HostedZones(): void {

        $.ajax({
            type: "POST",
            url: "/route53",
        })
        .done((data, textStatus, jqXHR) => {
            this.generateHostedZones(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error("Error:", errorThrown);
        });
    }

    public getRoute53Domains(zone: string, nextRecordName?: string): void {

        $.ajax({
            type: "POST",
            url: `/route53/zone/${zone}/${nextRecordName}`,
        })
        .done((data, textStatus, jqXHR) => {
            this.generateRecords(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error("Error:", errorThrown);
        });
    }

    public getEC2Instances(tag: string): void {

        $.ajax({
            type: "POST",
            url: "/ec2" + (null !== tag ? "/tag/" : ""),
            data: {
                Key: "Project",
                Value: "CMS",
            }
        })
        .done((data, textStatus, jqXHR) => {
            this.generateInstances(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error("Error:", errorThrown);
        });
    }

    public getEC2Instance(instance: string) {

         $.ajax({
            type: "POST",
            url: "/ec2/instance/" + instance,
        })
        .done((data, textStatus, jqXHR) => {
            this.generateInstanceDetails(data);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            console.error("Error:", errorThrown);
        });
    }

    private generateHostedZones(zones: IRoute53HostedZone[]): void {
        let html: string = "<tbody>\n";

        zones.forEach((zone: IRoute53HostedZone, index: number) => {
            const i: number = (index + 1);
            const zoneId = zone.Id.replace("/hostedzone/", "");

            html += "<tr>\n";
                html += `<td>${i}</td>\n`;
                html += `<td><a href="/route53/zone/${zoneId}/${zone.Name}" target="_self">${zone.Name}</a></td>\n`;
                html += `<td>${zoneId}</td>\n`;
                html += `<td>${zone.Config.PrivateZone}</td>\n`;
            html += "</tr>\n";

        });

        html += "</tbody>\n";

        $("#loading").hide();
        $("#hosted-zones-table").append(html).tablesorter(this.tableSorterParams);
    }

    private generateRecords(records: IRoute53ResourceRecordSets): void {
        let html: string = "<tbody>\n";

        const start = $("#hosted-zone-table > tbody").children().length;

        records.ResourceRecordSets.forEach((record: IRoute53ResourceRecordSet, index: number) => {
            const i: number = (start + index + 1);

            html += "<tr>\n";
                html += `<td>${i}</td>\n`;
                html += `<td>${record.Name}</td>\n`;
                html += `<td>${record.Type}</td>\n`;
                html += `<td>${record.TTL}</td>\n`;
            html += "</tr>\n";

        });

        html += "</tbody>\n";

        $("#loading").hide();
        $("#hosted-zone-table").append(html).tablesorter(this.tableSorterParams);

        if (true === records.IsTruncated) {
            $("#hosted-zone-pagination").html(`<a href="" class="btn btn-lg btn_name_load-more" data-nextrecordname="${records.NextRecordName}">Load More</a>`);
        } else {
            $("#hosted-zone-pagination").html("");
        }
    }

    private generateDomains(domains: IRoute53Domain[]): void {
        let html: string = "<tbody>";

        domains.forEach((domain: IRoute53Domain, index: number) => {
            const i: number = (index + 1);

            html += "<tr>\n";
                html += `<td>${i}</td>\n`;
                html += `<td>${domain.DomainName}</td>\n`;
                html += `<td>${domain.Expiry}</td>\n`;
            html += "</tr>\n";

        });

        html += "</tbody>\n";

        $("#aws-environments-table").append(html).tablesorter(this.tableSorterParams);
    }

    private generateInstances(instances: IEC2Environment[]): void {
        let html: string = "<tbody>\n";

        instances.forEach((instance: IEC2Environment, index: number) => {
            const i: number = (index + 1);

            html += "<tr>\n";
                html += `<td>${i}</td>\n`;
                html += `<td>${instance.PublicDnsName}</td>\n`;
                html += `<td><a href="/ec2/instance/${instance.InstanceId}" target="_self">${instance.InstanceId}</a></td>\n`;
                html += `<td>${instance.InstanceType}</td>\n`;
                html += `<td>${instance.Status}</td>\n`;
            html += "</tr>\n";

        });

        html += "</tbody>\n";

        $("#loading").hide();
        $("#ec2-instances-table").append(html).tablesorter(this.tableSorterParams);
    }

    private generateInstanceDetails(instance: IEC2Instances): void {
        let html: string = "<tbody>\n";

        for (const i in instance) {

            if (instance.hasOwnProperty(i)) {
                let value = instance[i];

                if ("Instances" === i && value.hasOwnProperty(0)) {
                    const instances = value[0];

                    for (const x in instances) {

                        if (instances.hasOwnProperty(x)) {
                            value =  instances[x];

                            if ("object" === typeof instances[x]) {
                                value = ( instances[x].length > 0 ? "<pre>" + JSON.stringify(instances[x], null, 2) + "</pre>" : "");
                            }

                            if ("PublicDnsName" === x && "" === instances[x]) {
                                const dns = instances.Tags.find((y) => y.Key === "DNS");

                                value = (dns.hasOwnProperty("Value") ? dns.Value.replace(/\.$/, "") : "");
                            }

                            html += "<tr>\n";
                                html += `<td>${x}</td>\n`;
                                html += `<td>${value}</td>\n`;
                            html += "</tr>\n";
                        }

                    }

                } else {

                    html += "<tr>\n";
                        html += `<td>${i}</td>\n`;
                        html += `<td>${value}</td>\n`;
                    html += "</tr>\n";
                }

             }

        }

        html += "</tbody>\n";

        $("#loading").hide();
        $("#ec2-instance-table").append(html).tablesorter(this.tableSorterParams);
    }
}
