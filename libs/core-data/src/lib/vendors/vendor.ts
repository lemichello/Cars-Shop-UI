import { Model } from '@cars-shop-ui/core-data';

export interface Vendor {
  id: number;
  name: string;
  models: Model[];
}
