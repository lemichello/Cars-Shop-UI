import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
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
  constructor(private apollo: Apollo) {}

  getAll(): Observable<any> {
    return this.apollo.watchQuery({ query: COLORS }).valueChanges;
  }

  add(color: string): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_COLOR,
      variables: { newColor: { name: color } },
      refetchQueries: ['Colors']
    });
  }
}
