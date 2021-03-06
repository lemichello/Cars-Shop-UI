import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditCarDto } from './models/edit-car-dto';
import { CarsFilter } from './models/cars-filter';
import gql from 'graphql-tag';
import { Apollo, QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';

const CARS_FIELDS = gql`
  fragment CarsFields on Car {
    id
    description
    model {
      id
      name
    }
    vendor {
      id
      name
    }
    color {
      id
      name
    }
    engineVolume {
      id
      volume
    }
    price
  }
`;

const DETAILED_CARS_FIELDS = gql`
  fragment DetailedCarsFields on Car {
    id
    description
    model {
      id
      name
    }
    vendor {
      id
      name
    }
    color {
      id
      name
    }
    engineVolume {
      id
      volume
    }
    pricesHistory {
      id
      price
      date
    }
  }
`;

const CARS = gql`
  query Cars($filter: CarsFilterInput, $pagination: PaginationInput) {
    cars(filter: $filter, pagination: $pagination) {
      ...CarsFields
    }
  }
  ${CARS_FIELDS}
`;

const CAR_FOR_EDIT = gql`
  query CarForEdit($carId: Int!) {
    car(id: $carId) {
      id
      description
      model {
        id
        vendorId
      }
      color {
        id
      }
      engineVolume {
        id
      }
      price
    }
  }
`;

const CAR = gql`
  query Car($carId: Int!) {
    car(id: $carId) {
      ...DetailedCarsFields
    }
  }
  ${DETAILED_CARS_FIELDS}
`;

const CARS_COUNT = gql`
  query CarsCount($filter: CarsFilterInput) {
    carsCount(filter: $filter)
  }
`;

const MIN_MAX_PRICES = gql`
  query MinMaxPrices {
    minMaxPrices {
      minPrice
      maxPrice
    }
  }
`;

const MIN_MAX_PRICES_CHANGED = gql`
  subscription MinMaxPricesChanged {
    minMaxPricesChanged {
      minPrice
      maxPrice
    }
  }
`;

const ADD_CAR = gql`
  mutation AddCar($newCar: NewCar!) {
    addCar(input: $newCar) {
      ...CarsFields
    }
  }
  ${CARS_FIELDS}
`;

const UPDATE_CAR = gql`
  mutation UpdateCar($updatingCar: NewCar!) {
    updateCar(input: $updatingCar) {
      ...DetailedCarsFields
    }
  }
  ${DETAILED_CARS_FIELDS}
`;

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  minMaxPricesQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {
    this.minMaxPricesQuery = this.apollo.watchQuery({ query: MIN_MAX_PRICES });

    this.subscribeForNewMinMaxPrices();
  }

  getCars(
    index: number,
    size: number,
    filter?: CarsFilter
  ): Observable<ApolloQueryResult<any>> {
    const pagination = { index, size };

    return this.apollo.watchQuery({
      query: CARS,
      variables: { pagination, filter },
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  getCarForEdit(carId: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      query: CAR_FOR_EDIT,
      variables: { carId },
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  add(car: EditCarDto): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_CAR,
      variables: { newCar: { ...car } }
    });
  }

  update(car: EditCarDto): Observable<Object> {
    return this.apollo.mutate({
      mutation: UPDATE_CAR,
      variables: { updatingCar: { ...car } }
    });
  }

  getCount(filter?: CarsFilter): Observable<any> {
    return this.apollo.watchQuery({
      query: CARS_COUNT,
      variables: { filter },
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  getById(carId: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      query: CAR,
      variables: { carId },
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  getMinMaxPrices(): Observable<ApolloQueryResult<any>> {
    return this.minMaxPricesQuery.valueChanges;
  }

  subscribeForNewMinMaxPrices(): void {
    this.minMaxPricesQuery.subscribeToMore({
      document: MIN_MAX_PRICES_CHANGED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        const oldPrices = prev['minMaxPrices'];
        const newMinMaxPrices = subscriptionData.data.minMaxPricesChanged;

        if (
          oldPrices.minPrice === newMinMaxPrices.minPrice &&
          oldPrices.maxPrice === newMinMaxPrices.maxPrice
        ) {
          return prev;
        }

        return Object.assign({}, prev, {
          minMaxPrices: newMinMaxPrices
        });
      }
    });
  }
}
