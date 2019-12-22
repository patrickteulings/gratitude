
interface Coords {
  lat: any;
  lon: any;
}

export default class WeatherService {
  private APIKEY: string;
  private APIURL: string;

  constructor () {
    this.APIKEY = 'ea8619a8f88dc06dcddfd36682d398a2';
    this.APIURL = 'https://api.openweathermap.org/data/2.5/weather?';
  }


  // async function
  public async getRequest (coords: Coords) {
    const {lon, lat} = coords;
    const response = await fetch(`${this.APIURL}lat=${coords.lat}&lon=${coords.lon}&appid=${this.APIKEY}&units=metric`);
    const data = await response.json();
    return data;
  }
}

