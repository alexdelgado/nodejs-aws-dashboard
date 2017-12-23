interface IAppApiEndpoint {
    id: string;
    network: string;
    environment: string;
    endpoint: string;
}

interface IAppApi {
    name: string;
    title: string;
    endpoints: IAppApiEndpoint[];
}
