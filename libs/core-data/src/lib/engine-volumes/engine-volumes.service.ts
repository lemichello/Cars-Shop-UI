import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
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
  constructor(private apollo: Apollo) {}

  getAll(): Observable<ApolloQueryResult<any>> {
    return this.apollo.watchQuery({
      query: ENGINE_VOLUMES,
      fetchPolicy: 'no-cache'
    }).valueChanges;
  }

  add(engineVolumeValue: number): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_ENGINE_VOLUME,
      variables: { newEngineVolume: { volume: engineVolumeValue } },
      refetchQueries: ['EngineVolumes']
    });
  }
}
