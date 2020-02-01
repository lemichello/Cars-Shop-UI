import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const COLORS_FIELDS = gql`
  fragment ColorsFields on Color {
    id
    name
  }
`;

const COLORS = gql`
  query Colors {
    colors {
      ...ColorsFields
    }
  }
  ${COLORS_FIELDS}
`;

const COLOR_ADDED = gql`
  subscription ColorAdded {
    colorAdded {
      ...ColorsFields
    }
  }
  ${COLORS_FIELDS}
`;

const ADD_COLOR = gql`
  mutation AddColor($newColor: NewColorInput!) {
    addColor(input: $newColor) {
      ...ColorsFields
    }
  }
  ${COLORS_FIELDS}
`;

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  colorsQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {
    this.colorsQuery = this.apollo.watchQuery({ query: COLORS });

    this.subscribeForNewColors();
  }

  getAll(): Observable<any> {
    return this.colorsQuery.valueChanges;
  }

  add(color: string): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_COLOR,
      variables: { newColor: { name: color } },
      refetchQueries: ['Colors']
    });
  }

  subscribeForNewColors(): void {
    this.colorsQuery.subscribeToMore({
      document: COLOR_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        const newColor = subscriptionData.data.colorAdded;

        return Object.assign({}, prev, {
          colors: [...prev['colors'], newColor]
        });
      }
    });
  }
}
