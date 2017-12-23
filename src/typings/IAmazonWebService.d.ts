/**
 * Elastic Cloud Interfaces
 */
interface IEC2InstanceTag {
    Key: string;
    Value: string;
}

interface IEC2InstanceState {
    Code: number;
    Name: string;
}

interface IEC2Instance {
    InstanceId: string;
    InstanceType: string;
    PublicDnsName: string;
    State: IEC2InstanceState;
    Tags: IEC2InstanceTag[];
}

interface IEC2InstanceGroup {
    GroupName: string;
    GroupId: string;
}

interface IEC2Instances {
    ReservationId: string;
    OwnerId: string;
    Groups: IEC2InstanceGroup[];
    Instances: IEC2Instance[];
}

interface IEC2Reservations {
    Reservations: IEC2Instances[];
}

interface IEC2Environment {
    ReservationId: string;
    InstanceId: string;
    InstanceType: string;
    PublicDnsName: string;
    Status: string;
}


/**
 * Route53 Interfaces
 */
interface IRoute53ZoneConfig {
    PrivateZone: boolean;
}

interface IRoute53HostedZone {
    CallerReference: string;
    Config: IRoute53ZoneConfig;
    Id: string;
    Name: string;
    ResourceRecordSetCount: number;
}

interface IRoute53HostedZones {
    HostedZones: IRoute53HostedZone[];
    IsTruncated: boolean;
    MaxItems: string;
}

interface IRoute53ResourceRecord {
}

interface IRoute53ResourceRecordSet {
    Name: string;
    Type: string;
    TTL: number;
    ResourceRecords: IRoute53ResourceRecord[];
}

interface IRoute53ResourceRecordSets {
    IsTruncated: boolean;
    MaxItems: string;
    NextRecordName: string;
    NextRecordType: string;
    ResourceRecordSets: IRoute53ResourceRecordSet[];
}

interface IRoute53Domain {
    AutoRenew: boolean;
    DomainName: string;
    Expiry: number;
    TransferLock: boolean;
}

interface IRoute53Domains {
    Domains: IRoute53Domain[];
}