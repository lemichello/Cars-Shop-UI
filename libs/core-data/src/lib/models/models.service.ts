import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { isUndefined } from 'util';
import { ApolloQueryResult } from 'apollo-client';

const MODELS = gql`
  query Models($vendorId: Int!, $pagination: PaginationInput) {
    models(vendorId: $vendorId, pagination: $pagination) {
      id
      name
      vendorId
    }
  }
`;

const MODELS_COUNT = gql`
  query ModelsCount {
    modelsCount
  }
`;

const ADD_MODEL = gql`
  mutation AddModel($newModel: NewModel!) {
    addModel(input: $newModel) {
      id
      name
      vendorId
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ModelsService {
  constructor(private apollo: Apollo) {}

  getByVendor(
    vendorId: number,
    index?: number,
    size?: number
  ): Observable<ApolloQueryResult<any>> {
    const pagination =
      isUndefined(index) || isUndefined(size) ? null : { index, size };

    return this.apollo.watchQuery({
      query: MODELS,
      variables: { vendorId, pagination },
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  add(model: { name: string; vendorId: number }): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_MODEL,
      variables: { newModel: { name: model.name, vendorId: model.vendorId } },
      refetchQueries: ['DetailedVendors']
    });
  }

  getCount(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      query: MODELS_COUNT,
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }
}
