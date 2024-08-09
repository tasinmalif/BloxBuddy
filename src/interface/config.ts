export default interface iConfig {
  secrets: {
    prefix: string;
    id: string;
    guild: string;
    token: string;
    mode: string;
    owner: string;
    log: string;
    devs: string[];
  };
  colors: {
    red: number;
    pink: number;
    green: number;
    yellow: number;
    primary: number;
  };
  settings: {
    dashboard: boolean;
  };
}
