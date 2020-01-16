import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const COLORS = gql`
  query Colors {
    colors {
      id
      name
    }
  }
`;

const ADD_COLOR = gql`
  mutation AddColor($newColor: NewColorInput!) {
    addColor(input: $newColor) {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  constructor(private httpClient: HttpClient, private apollo: Apollo) {}

  getAll(): Observable<any> {
    return this.apollo.watchQuery({ query: COLORS }).valueChanges;
  }

  add(color: string): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_COLOR,
      variables: { newColor: { name: color } },
      refetchQueries: [{ query: COLORS }]
    });
  }
}
