beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
});
