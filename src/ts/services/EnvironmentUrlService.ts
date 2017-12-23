// tslint:disable:align
// tslint:disable:no-reference
// tslint:disable:object-literal-sort-keys
/// <reference path="../../typings/index.d.ts" />

export class EnvironmentUrlService {

    private environments: IAppEnvironment[] = [
        {
            environment: "systest",
            title: "System Testing",
        },
        {
            environment: "uat",
            title: "User Acceptance Testing",
        },
    ];

    private domains: IAppDomain[] = [
        {
            domain: "abc-{domain}.awsdashboard.dev",
            id: "abc-{domain}",
            title: "ABC",
        },
        {
            domain: "player.abc-{domain}.awsdashboard.dev",
            id: "player-abc-{domain}",
            title: "ABC Player",
        },
        {
            domain: "def-{domain}.awsdashboard.dev",
            id: "def-{domain}",
            title: "DEF",
        },
        {
            domain: "player.def-{domain}.awsdashboard.dev",
            id: "player-def-{domain}",
            title: "DEF Player",
        },
    ];

    public getProductionVersion(domain: string, tableId: string): void {

         $.ajax({
            method: "POST",
            url: "/",
            data: { url: domain },
        })
        .done((json) => {

            let html = '<table id="abc-network" class="table table-striped">';
                html += "<tbody>";
                    html += "<tr>";
                        html += "<td>Version:</td>";
                        html += `<td>${json.GIT_BRANCH}</td>`;
                    html += "</tr>";
                    html += "<tr>";
                        html += "<td>Last Built:</td>";
                        html += `<td>${json.BuildDate}</td>`;
                    html += "</tr>";
                    html += "<tr>";
                        html += "<td>Last Commit:</td>";
                        html += `<td>${json.GIT_COMMIT}</td>`;
                    html += "</tr>";
                html += "</tbody>";
            html += "</table>";

            $(tableId).find(".loading").remove();
            $(tableId).html(html);

        })
        .fail(() => {
            let html: string = "";

            html += `<table class="environment-urls__version">`;
                html += `<tr>`;
                    html += `<td>There is no build information available for this environment.</td>`;
                html += `</tr>`;
            html += `</table>`;

            $(tableId).html(html);

            console.error("An error occured while trying to request the version.json file for", domain);
        });
    }

    public generateEnvironmentUrls(branch: string) {
        let html: string = "";

        this.environments.forEach((env: IAppEnvironment): void => {
            const tableId: string = `${env.environment}-table`;
            const loadingId: string = `${env.environment}-loading`;

            html += `<a name="${this.anchor(env.environment)}"></a>`;

            html += `<h2 class="environment-urls__heading">${env.title}</h2>`;

            html += `<div id="${loadingId}" class="loading">`;
                html += `<img src="/static/img/ring.svg" class="loading__icon"> Fetching latest build information...`;
            html += `</div>`;

            html += `<table id="${tableId}" class="table table-striped table-hover environment-urls__domains">`;

            html += "<tbody>";

            this.domains.forEach((dn: IAppDomain, index: number): void => {
                let domain: string;
                let instanceId: string;
                let href: string;

                domain = env.environment + "-" + branch;

                instanceId = dn.id.replace("{domain}", domain);

                href = `http://${ dn.domain.replace("{domain}", domain) }/`;

                if (href.indexOf("-cms-") > 0) {
                    href += "cms/";
                }

                if (0 === index) {

                    $.ajax({
                        method: "POST",
                        url: "/",
                        data: { url: dn.domain.replace("{domain}", domain) },
                    })
                    .done((json) => {
                        let output: string = "";

                        output += `<table class="environment-urls__version">`;
                            output += `<tr>`;
                                output += `<td><span>Branch:</span> ${json.GIT_BRANCH}</td>`;
                                output += `<td><span>Last Build:</span> ${json.BuildDate}</td>`;
                                output += `<td><span>Last Commit:</span> ${json.GIT_COMMIT}</td>`;
                            output += `</tr>`;
                        output += `</table>`;

                        $(`#${loadingId}`).remove();
                        $(`#${tableId}`).before(output);
                    })
                    .fail(() => {
                        let output: string = "";

                        output += `<table class="environment-urls__version">`;
                            output += `<tr>`;
                                output += `<td>There is no version information available for this environment.</td>`;
                            output += `</tr>`;
                        output += `</table>`;

                        $(`#${loadingId}`).remove();
                        $(`#${tableId}`).before(output);

                        console.error("An error occured while trying to request the version.json file for", href);
                    });

                }

                html += `<tr id="${instanceId}">`;
                    html += `<th>${dn.title}</th>`;
                    html += `<td><a href="${href}" target="_blank">${href}</a></td>`;
                html += `</tr>`;
            });

            html += "</tbody>";

            html += "</table>";
        });

        return html;
    }

    private anchor(title: string): string {
        return title.toLowerCase().replace(" ", "-");
    }
}
