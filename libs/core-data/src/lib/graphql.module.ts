import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { environment } from '../../../../apps/shop/src/environments/environment';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const apiUri = environment.apiUrl;
const wsUri = environment.wsUrl;

export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({
    uri: apiUri
  });
  const ws = new WebSocketLink({ uri: wsUri, options: { reconnect: true } });

  const link = split(
    ({ query }) => {
      //@ts-ignore
      const { kind, operation } = getMainDefinition(query);

      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    ws,
    http
  );

  return {
    link: link,
    cache: new InMemoryCache({
      dataIdFromObject: object => {
        switch (object.__typename) {
          case 'MinMaxPrice':
            //@ts-ignore
            return `MinMaxPrice:${object.minPrice}${object.maxPrice}`;
          default:
            return defaultDataIdFromObject(object);
        }
      }
    })
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
