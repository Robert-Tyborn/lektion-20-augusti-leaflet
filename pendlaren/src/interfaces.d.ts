export interface Stop {
  StopLocation: StopLocation;
}

export interface StopLocation {
  dist: number;
  extId: string;
  id: string;
  lat: number;
  lon: number;
  name: string;
  productAtStop: ProductAtStop[];
  products: number;
  timezoneOffset: number;
  weight: number;
}

interface ProductAtStop {
  cls: string;
  icon: { res: number };
}
