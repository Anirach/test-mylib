/// <reference types="jest" />

declare global {
  namespace NodeJS {
    interface Global {
      describe: jest.Describe;
      it: jest.It;
      test: jest.It;
      expect: jest.Expect;
      beforeAll: jest.Lifecycle;
      afterAll: jest.Lifecycle;
      beforeEach: jest.Lifecycle;
      afterEach: jest.Lifecycle;
      jest: typeof jest;
    }
  }
}

export {};
