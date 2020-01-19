import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { isUndefined } from 'util';
import { ApolloQueryResult } from 'apollo-client';

const MODELS_FIELDS = gql`
  fragment ModelsFields on Model {
    id
    name
    vendorId
  }
`;

const MODELS = gql`
  query Models($vendorId: Int!, $pagination: PaginationInput) {
    models(vendorId: $vendorId, pagination: $pagination) {
      ...ModelsFields
    }
  }
  ${MODELS_FIELDS}
`;

const MODELS_COUNT = gql`
  query ModelsCount($vendorId: Int!) {
    modelsCount(vendorId: $vendorId)
  }
`;

const ADD_MODEL = gql`
  mutation AddModel($newModel: NewModel!) {
    addModel(input: $newModel) {
      ...ModelsFields
    }
  }
  ${MODELS_FIELDS}
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

  getCount(vendorId: number): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      query: MODELS_COUNT,
      variables: { vendorId },
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }
}
