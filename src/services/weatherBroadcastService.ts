import { WeatherData } from '../types/weather';

class WeatherBroadcastService {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChange: ((speaking: boolean, cityName?: string) => void) | null = null;
  private currentCityPlaying: string | null = null;

  public setListener(cb: (speaking: boolean, cityName?: string) => void) {
    this.onStateChange = cb;
  }

  public generateScript(weather: WeatherData): string {
    const timeOfDay = weather.isDay ? 'day' : 'evening';
    const advisory = weather.condition === 'thunderstorm'
      ? 'A thunder alert is active with electric discharges and gusty winds.'
      : weather.condition === 'rain' || weather.condition === 'heavy-rain'
      ? 'Liquid precipitation is currently descending across the area. Waterproof gear is recommended.'
      : weather.condition === 'snow'
      ? 'Glacial snow flurries are falling with crisp sub-zero visibility.'
      : weather.uvIndex >= 6
      ? 'Sun protection is strongly advised due to high solar radiation.'
      : 'Atmospheric pressure is steady with excellent optical line of sight.';

    return `This is your Aether live meteorological broadcast for ${weather.cityName}. Currently, conditions are ${weather.conditionDescription}. The ambient temperature stands at ${weather.currentTemp} degrees Fahrenheit, feeling like ${weather.feelsLike} degrees. Today we expect a peak high of ${weather.tempMax} and an overnight low of ${weather.tempMin}. Surface wind is traveling from ${weather.windDirection} degrees at ${weather.windSpeed} miles per hour with gusts reaching ${weather.windGusts}. Humidity is measured at ${weather.humidity} percent, with a barometric pressure of ${weather.pressure} hectopascals. ${advisory} Have a wonderful ${timeOfDay} from Aether Liquid Weather.`;
  }

  public generateGlobalRoundup(weathers: WeatherData[]): string {
    const intros = weathers
      .slice(0, 5)
      .map(
        (w) =>
          `In ${w.cityName}, it is currently ${w.currentTemp} degrees and ${w.conditionDescription}`
      )
      .join('. ');

    return `This is your Aether World Meteorological Round-up. ${intros}. All global stations are reporting steady atmospheric telemetry. Stay tuned for continuous updates.`;
  }

  public speak(weather: WeatherData, onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    this.stop();

    const script = this.generateScript(weather);
    this.currentCityPlaying = weather.cityName;
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick best natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange(true, weather.cityName);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentCityPlaying = null;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentCityPlaying = null;
      if (this.onStateChange) this.onStateChange(false);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public speakRoundup(weathers: WeatherData[], onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    this.stop();

    const script = this.generateGlobalRoundup(weathers);
    this.currentCityPlaying = 'Global Round-up';
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange(true, 'Global Round-up');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentCityPlaying = null;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentCityPlaying = null;
    if (this.onStateChange) this.onStateChange(false);
  }

  public toggle(weather: WeatherData, onEnd?: () => void): boolean {
    if (this.isSpeaking && this.currentCityPlaying === weather.cityName) {
      this.stop();
      return false;
    } else {
      this.speak(weather, onEnd);
      return true;
    }
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getCurrentCityPlaying(): string | null {
    return this.currentCityPlaying;
  }
}

export const weatherBroadcast = new WeatherBroadcastService();
