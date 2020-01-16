import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';
import { isUndefined } from 'util';

const VENDORS = gql`
  query Vendors($pagination: PaginationInput) {
    vendors(pagination: $pagination) {
      id
      name
    }
  }
`;

const DETAILED_VENDORS = gql`
  query DetailedVendors($pagination: PaginationInput) {
    vendors(pagination: $pagination) {
      id
      name
      models {
        id
        name
        vendorId
      }
    }
  }
`;

const VENDORS_COUNT = gql`
  query VendorsCount {
    vendorsCount
  }
`;

const ADD_VENDOR = gql`
  mutation AddVendor($newVendor: NewVendor!) {
    addVendor(input: $newVendor) {
      id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  constructor(private httpClient: HttpClient, private apollo: Apollo) {}

  getAll(index?: number, size?: number): Observable<any> {
    const pagination =
      isUndefined(index) || isUndefined(size) ? null : { index, size };

    return this.apollo.watchQuery({ query: VENDORS, variables: { pagination } })
      .valueChanges;
  }

  add(vendorName: string): Observable<Object> {
    return this.apollo.mutate({
      mutation: ADD_VENDOR,
      variables: { newVendor: { name: vendorName } },
      refetchQueries: [{ query: VENDORS, variables: { pagination: null } }]
    });
  }

  getCount(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({ query: VENDORS_COUNT });
  }

  getDetailed(): Observable<ApolloQueryResult<any>> {
    return this.apollo.query({ query: DETAILED_VENDORS });
  }
}
