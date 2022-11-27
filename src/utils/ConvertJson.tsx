import { getClient } from '@tauri-apps/api/http';
import Delay from "./Delay";
import Notify from "./Notify";

export interface Race {
    name: string;
    description: string;
    creator: string;
    imageUrl: string;
    categories: string[];
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

function ConvertJson(jsonData: any, image: string) {
    let m = jsonData.mission;
    let oa: Race = {} as Race;

    if (m === undefined || m.race === undefined) return;

    oa.name = m.gen?.nm;
    oa.description = m.gen?.dec;
    oa.creator = m.gen?.ownerid === '_RSN_' ? 'Rockstar' : jsonData.mission?.gen?.ownerid;
    oa.imageUrl = image;

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

const possibleGtaLink1 = 'https://prod.cloud.rockstargames.com/ugc/gta5mission/';
const possibleGtaLink2 = 'http://prod.cloud.rockstargames.com/ugc/gta5mission/';
const jsonNumbers = [
    '0_0_',
    '0_1_',
    '0_2_',
    '1_0_',
    '1_1_',
    '1_2_',
    '2_0_',
    '2_1_',
    '2_2_'
]
const jsonCountries = [
    'en',
    'fr',
    'es',
    'de',
    'it',
    'ru',
    'pt',
    'cn',
    'jp',
    'kr',
    'mx',
    'pl'
]

async function getJsonFromURL(jsonUrl: string) {
    const client = await getClient();
    console.log('Doing request ' + jsonUrl);
    const response = await client.request({
        method: 'GET',
        url: jsonUrl
    });
    return response.status === 200 && response.data || JSON.parse('{}')
}

async function getRaceJson(rockstarId: string) {
    let checkUrl: string = '';
    for (let i = 0; i < jsonNumbers.length; i++) {
        const numbers = jsonNumbers[i]
        for (let c = 0; c < jsonCountries.length; c++) {
            const country = jsonCountries[c]
            const fullJsonPrefix = numbers + country;
            checkUrl = `https://prod.cloud.rockstargames.com/ugc/gta5mission/7031/${rockstarId}/${fullJsonPrefix}.json`
            const rockstarJson = await getJsonFromURL(checkUrl);
            if (rockstarJson.mission !== undefined) {
                return rockstarJson
            }
        }
    }
    return 'notfound';
}

export default async function ConvertJsonFromUrl(url: string, setSpinner: any) {
    if (url.includes('.json')) {
        Notify('Ok, we get direct json link, should get the image.');
    } else if (url.includes(possibleGtaLink1) || url.includes(possibleGtaLink2)) {
        const paths = new URL(url).pathname;
        const separatedPaths = paths.split('/');
        const rid = separatedPaths[separatedPaths.length - 2];
        setSpinner(true);
        let rockstarJson = await getRaceJson(rid);
        setSpinner(false);
        if (rockstarJson === 'notfound') {
            Notify('No hemos podido encontrar la URL del JSON', 'error')
        } else {
            const convertedJson = ConvertJson(rockstarJson, url)
            console.log(convertedJson);
        }
    } else {
        Notify('No has introducido una URL de Rockstar válida', 'error');
    }
}