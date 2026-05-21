// jsdom's Selection implementation is incomplete for slate-react's
// usage. Stub it so slate-using components don't blow up trying to
// read DOM selection state during tests.
beforeEach(() => {
  window.getSelection = () => undefined;
});
