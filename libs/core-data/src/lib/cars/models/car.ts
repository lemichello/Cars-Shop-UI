import { Color, EngineVolume, Model, PriceHistory, Vendor } from '../../..';

export interface Car {
  id: number;
  description: string;
  model: Model;
  vendor: Vendor;
  color: Color;
  engineVolume: EngineVolume;
  pricesHistory: PriceHistory[];
  price: number;
}
