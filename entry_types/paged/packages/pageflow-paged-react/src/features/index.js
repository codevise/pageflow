export default {
  createReducers({enabledFeatureNames}) {
    return {features: () => enabledFeatureNames};
  }
};
