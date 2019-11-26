import { Model, Vendor } from '@cars-shop-ui/core-data';

export interface DetailedVendor extends Vendor {
  models: Model[];
}
