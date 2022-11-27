import Notify from "./Notify";

export interface Race {
    name: string;
    description: string;
    creator: string;
    delprops: DProp[];
    props: Prop[];
    initialVehicle?: number;
    checkpointCount: number;
    checkpoints: Checkpoint[];
    laps: number;
    grid: Grid[];
    pickups?: Pickup[];
}

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface Vector4 {
    x: number;
    y: number;
    z: number;
    w?: number;
}

interface Prop {
    position: Vector3;
    model: number;
    rotation: Vector3;
    color: number;
    speedBoostArgument: number;
}

interface DProp {
    model: number;
}

interface Checkpoint {
    position: Vector3;
    heading: number;
    round: boolean;
}

interface Pickup {
    position: Vector3;
    heading: number;
    type: number;
    subtype?: number;
}

interface Grid {
    position: Vector3;
    heading: number;
}

function leaveOnlyUnique(t: DProp[]) {
    let unique = t.filter((element, index) => {
        return t.indexOf(element) === index;
    });
    return unique;
}

function getFormattedProps(t: any, size: number) {
    let props: Prop[] = {} as Prop[]
    for (let i = 0; i < size; i++) {
        let prop = {} as Prop;
        prop.position = t.loc[i] as Vector3;
        prop.model = t.model[i] as number;
        prop.rotation = t.vRot[i] as Vector3;
        prop.color = t.prpclr[i] as number;
        prop.speedBoostArgument = t.prpsba[i] as number;
        props[i] = prop;
    }
    return props
}

function checkpointIsRound(t: any, i: number) {
    if (t.rndchk !== undefined) {
        return t.rndchk[i];
    } else if (t.cpbs1 !== undefined) {
        return t.cpbs1[i] > 1
    }
    return false;
}

function getFormattedCheckpoints(t: any, size: number) {
    let checkpoints = {} as Checkpoint[];
    for (let i = 0; i < size; i++) {
        let checkpoint = {} as Checkpoint;
        checkpoint.position = t.chl[i] as Vector3;
        checkpoint.heading = t.chh[i] as number;
        checkpoint.round = checkpointIsRound(t, i) as boolean;
        checkpoints[i] = checkpoint;
    }
    return checkpoints;
}

function getFormattedPickups(t: any, size: number) {
    let pickups = {} as Pickup[];
    for (let i = 0; i < size; i++) {
        let pickup = {} as Pickup;
        pickup.position = t.loc[i] as Vector3;
        pickup.heading = t.head[i] as number;
        pickup.type = t.type[i] as number;
        // need to find a way to check if this exist because 
        // if not is breaking the execution.
        // pickup.subtype = t.subtype[i] as number; 
        pickups[i] = pickup;
    }
    return pickups
}

function getFormattedGrid(t: any, size: number) {
    let grids = {} as Grid[];
    for (let i = 0; i < size; i++) {
        let grid = {} as Grid;
        grid.position = t.loc[i] as Vector3;
        grid.heading = t.head[i] as number;
        grids[i] = grid;
    }
    return grids;
}

function ConvertJson(jsonData: any) {
    let m = jsonData.mission;
    let oa: Race = {} as Race;

    if (m === undefined || m.race === undefined) return;

    oa.name = m.gen?.nm;
    oa.description = m.gen?.dec;
    oa.creator = m.gen?.ownerid === '_RSN_' ? 'Rockstar' : jsonData.mission?.gen?.ownerid;

    oa.delprops = leaveOnlyUnique(m.dhprop?.mn);
    if (m.gen?.propno !== undefined) {
        oa.props = getFormattedProps(m.prop, m.gen.propno || 0);
    } else if (m.prop?.no) {
        oa.props = getFormattedProps(m.prop, m.prop.no || 0);
    }

    oa.initialVehicle = m.gen?.ivm;

    let r = m.race;
    oa.checkpoints = getFormattedCheckpoints(r, r.chp || 0);
    oa.laps = r.lap || 0;

    let veh = m.veh;
    oa.grid = getFormattedGrid(veh, veh.no || 0);
    oa.pickups = getFormattedPickups(m.weap, m.weap.no || 0);

    return oa;
}

export default function ConvertJsonFromUrl(url: string) {
    Notify('Getted url -> ' + url, 'info')
    const possibleGtaLink1 = 'https://prod.cloud.rockstargames.com/ugc/gta5mission/';
    const possibleGtaLink2 = 'http://prod.cloud.rockstargames.com/ugc/gta5mission/';
    if (url.includes('.json') || url.includes(possibleGtaLink1) || url.includes(possibleGtaLink2)) {
        Notify('Ok')
    } else {
        Notify('No has introducido una URL de Rockstar válida', 'error')
    }
}