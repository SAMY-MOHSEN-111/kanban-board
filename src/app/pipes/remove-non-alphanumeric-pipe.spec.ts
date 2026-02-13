import { RemoveNonAlphanumericPipe } from './remove-non-alphanumeric-pipe';

describe('RemoveNonAlphanumericPipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveNonAlphanumericPipe();
    expect(pipe).toBeTruthy();
  });
});
