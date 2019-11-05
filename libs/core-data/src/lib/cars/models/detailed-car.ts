import { BaseCar } from './base-car';
import { PriceHistory } from './price-history';

export interface DetailedCar extends BaseCar {
  pricesHistory: PriceHistory[];
}
