
// Imports
import { ICoords } from '@/interfaces/coords';

export default class GeocodeService {
  private APIURL: string;

  constructor () {
    this.APIURL = 'https://geocode.xyz/';
    // https://maps.googleapis.com/maps/api/geocode/json?latlng=52.06184,4.28605&key=AIzaSyDU9_GiahRE2NDwcw-_jUMaknmJeQeUspg
  }


  // async function
  public async getCityName (coords: ICoords) {
    const {longitude, latitude} = coords;
    const response = await fetch(`${this.APIURL}${coords.latitude},${coords.longitude}?json=1`);
    const data = await response.json();

    return data;
  }
}

