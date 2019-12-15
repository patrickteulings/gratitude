
interface Coords {
  latitude: any;
  longitude: any;
}

export default class GeocodeService {
  private APIURL: string;

  constructor () {
    this.APIURL = 'https://geocode.xyz/';
  }


  // async function
  public async getCityName (coords: Coords) {
    const {longitude, latitude} = coords;
    const response = await fetch(`${this.APIURL}${coords.latitude},${coords.longitude}?json=1`);
    const data = await response.json();

    return data;
  }
}

