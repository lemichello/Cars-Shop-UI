import { PriceFilter } from './price-filter';

export interface CarsFilter {
  modelsId: number[];
  colorId?: number;
  engineVolumeId?: number;
  price: PriceFilter;
}
