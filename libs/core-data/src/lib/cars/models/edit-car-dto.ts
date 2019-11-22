import { CarDto, Model } from '@cars-shop-ui/core-data';

export interface EditCarDto extends CarDto{
  id: number;
  model: Model;
}
