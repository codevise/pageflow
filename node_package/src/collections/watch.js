import watchBackboneCollection from './watchBackboneCollection';
import loadFromSeed from './loadFromSeed';

import Backbone from 'backbone';

export default function({
  collection,
  collectionName,
  dispatch,
  attributes,
  includeConfiguration
}) {
  const delegate = Backbone.Collection && collection instanceof Backbone.Collection ?
                   watchBackboneCollection :
                   loadFromSeed;
  delegate({
    collection,
    collectionName,
    dispatch,
    attributes,
    includeConfiguration
  });
}
