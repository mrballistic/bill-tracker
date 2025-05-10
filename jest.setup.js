if (typeof global.Request === 'undefined') {
  // @ts-expect-error: Mocking global.Request for test environment compatibility
  global.Request = class {};
}
