import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';
import { isUndefined } from 'util';

const VENDORS_FIELDS = gql`
  fragment VendorsFields on Vendor {
    id
    name
  }
`;

const DETAILED_VENDORS_FIELDS = gql`
  fragment DetailedVendorsFields on Vendor {
    id
    name
    models {
      id
      name
      vendorId
    }
  }
`;

const VENDORS = gql`
  query Vendors($pagination: PaginationInput) {
    vendors(pagination: $pagination) {
      ...VendorsFields
    }
  }
  ${VENDORS_FIELDS}
`;

const DETAILED_VENDORS = gql`
  query DetailedVendors($pagination: PaginationInput) {
    vendors(pagination: $pagination) {
      ...DetailedVendorsFields
    }
  }
  ${DETAILED_VENDORS_FIELDS}
`;

const VENDOR_ADDED = gql`
  subscription VendorAdded {
    vendorAdded {
      ...DetailedVendorsFields
    }
  }
  ${DETAILED_VENDORS_FIELDS}
`;

const VENDORS_COUNT = gql`
  query VendorsCount {
    vendorsCount
  }
`;

const ADD_VENDOR = gql`
  mutation AddVendor($newVendor: NewVendor!) {
    addVendor(input: $newVendor) {
      ...VendorsFields
    }
    ${VENDORS_FIELDS}
  }
`;

@Injectable({
  providedIn: 'root'
})
export class VendorsService {
  constructor(private apollo: Apollo) {}

  getAll(index?: number, size?: number): Observable<any> {
    const pagination =
      isUndefined(index) || isUndefined(size) ? null : { index, size };

    return this.apollo.watchQuery({
      query: VENDORS,
      variables: { pagination },
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  add(vendorName: string): Observable<Object> {
    return this.apollo.mutate({
      mutation: ADD_VENDOR,
      variables: { newVendor: { name: vendorName } },
      refetchQueries: ['DetailedVendors']
    });
  }

  getCount(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      query: VENDORS_COUNT,
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  getDetailed(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({ query: DETAILED_VENDORS }).valueChanges;
  }

  // subscribeForNewVendors(): Observable<ApolloQueryResult<any>> {

  // }
}
