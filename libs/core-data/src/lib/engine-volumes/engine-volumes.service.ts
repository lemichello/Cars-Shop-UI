import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';

const ENGINE_VOLUMES_FIELDS = gql`
  fragment EngineVolumesFields on EngineVolume {
    id
    volume
  }
`;

const ENGINE_VOLUMES = gql`
  query EngineVolumes {
    engineVolumes {
      ...EngineVolumesFields
    }
  }
  ${ENGINE_VOLUMES_FIELDS}
`;

const ENGINE_VOLUME_ADDED = gql`
  subscription EngineVolumeAdded {
    engineVolumeAdded {
      ...EngineVolumesFields
    }
  }
  ${ENGINE_VOLUMES_FIELDS}
`;

const ADD_ENGINE_VOLUME = gql`
  mutation AddEngineVolume($newEngineVolume: NewEngineVolume!) {
    addEngineVolume(input: $newEngineVolume) {
      ...EngineVolumesFields
    }
  }
  ${ENGINE_VOLUMES_FIELDS}
`;

@Injectable({
  providedIn: 'root'
})
export class EngineVolumesService {
  engineVolumesQuery: QueryRef<any>;

  constructor(private apollo: Apollo) {
    this.engineVolumesQuery = this.apollo.watchQuery({
      query: ENGINE_VOLUMES
    });

    this.subscribeForNewEngineVolumes();
  }

  getAll(): Observable<ApolloQueryResult<any>> {
    return this.engineVolumesQuery.valueChanges;
  }

  add(engineVolumeValue: number): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_ENGINE_VOLUME,
      variables: { newEngineVolume: { volume: engineVolumeValue } },
      refetchQueries: ['EngineVolumes']
    });
  }

  subscribeForNewEngineVolumes(): void {
    this.engineVolumesQuery.subscribeToMore({
      document: ENGINE_VOLUME_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        const newEngineVolume = subscriptionData.data.engineVolumeAdded;

        return Object.assign({}, prev, {
          engineVolumes: [...prev['engineVolumes'], newEngineVolume]
        });
      }
    });
  }
}
