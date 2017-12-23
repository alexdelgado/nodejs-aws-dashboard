/// <reference path="../../typings/index.d.ts" />

export class ApiUrlService {

    private apis = [
        {
            name: "podcasts-catchup",
            title: "Podcasts/Catchup",
            endpoints: [
                {
                    id: "abc-catchup-staging",
                    network: "ABC",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "abc-catchup-production",
                    network: "ABC",
                    environment: "Production",
                    endpoint: "",
                },
                {
                    id: "def-catchup-staging",
                    network: "DEF",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "def-catchup-production",
                    network: "DEF",
                    environment: "Production",
                    endpoint: "",
                },
            ],
        },
        {
            name: "podcasts-search",
            title: "Podcasts/Search",
            endpoints: [
                {
                    id: "abc-search-staging",
                    network: "ABC",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "abc-search-production",
                    network: "ABC",
                    environment: "Production",
                    endpoint: "",
                },
                {
                    id: "def-search-staging",
                    network: "DEF",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "def-search-production",
                    network: "DEF",
                    environment: "Production",
                    endpoint: "",
                },
            ],
        },
        {
            name: "schedules",
            title: "Schedules",
            endpoints: [
                {
                    id: "abc-nowplaying-staging",
                    network: "ABC",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "abc-nowplaying-production",
                    network: "ABC",
                    environment: "Production",
                    endpoint: "",
                },
                {
                    id: "def-nowplaying-staging",
                    network: "DEF",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "def-nowplaying-production",
                    network: "DEF",
                    environment: "Production",
                    endpoint: "",
                },
            ],
        },
        {
            name: "now-playing",
            title: "Schedules/Now Playing",
            endpoints: [
                {
                    id: "abc-schedule-staging",
                    network: "ABC",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "abc-schedule-production",
                    network: "ABC",
                    environment: "Production",
                    endpoint: "",
                },
                {
                    id: "def-schedule-staging",
                    network: "DEF",
                    environment: "Staging",
                    endpoint: "",
                },
                {
                    id: "def-schedule-production",
                    network: "DEF",
                    environment: "Production",
                    endpoint: "",
                },
            ],
        },
    ];

    public generateEnvironmentUrls(station: string) {
        let html: string = "";

        this.apis.forEach((api: IAppApi): void => {
            const tableId: string = `${api.name}-table`;

            html += `<a name="${api.name}"></a>`;

            html += `<h2 class="environment-urls__heading">${api.title}</h2>`;

            html += `<table id="${tableId}" class="table table-striped table-hover table--sortable environment-urls__domains">`;

                html += "<thead>";
                    html += `<tr>`;
                            html += `<th>Network</th>`;
                            html += `<th>Environment</th>`;
                            html += `<td>Endpoint</td>`;
                        html += `</tr>`;
                html += "</thead>";

                html += "<tbody>";

                    api.endpoints.forEach((endpoint: IAppApiEndpoint, index: number): void => {
                        const href = endpoint.endpoint.replace("{stationCode}", station);

                        html += `<tr id="${endpoint.id}">`;
                            html += `<th>${endpoint.network}</th>`;
                            html += `<th>${endpoint.environment}</th>`;
                            html += `<td><a href="${href}" target="_blank">${href}</a></td>`;
                        html += `</tr>`;

                    });

                html += "</tbody>";

            html += "</table>";
        });

        return html;
    }
}
