
interface Coords {
  lat: any;
  lon: any;
}

export default class GeocodeService {
  private APIURL: string;

  constructor () {
    this.APIURL = 'https://geocode.xyz/';
  }


  // async function
  public async getCityName (coords: Coords) {
    const {lon, lat} = coords;
    console.log(coords);
    // const response = await fetch(`${this.APIURL}${coords.lat},${coords.lon}&json=1`);
    const response = await fetch(`${this.APIURL}${coords.lat},${coords.lon}?json=1`);

    const data = await response.json();
    return data;
  }
}

