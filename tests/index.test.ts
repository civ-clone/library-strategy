import { expect, use, spy } from 'chai';
import * as spies from 'chai-spies';

use(spies);

describe('Fake test', (): void => {
  it('should assert something', (): void => {
    expect(true).to.equal(true);

    const newSpy = spy(() => true)

    expect(newSpy()).to.equal(true);
    expect(newSpy).called.once;

    const obj = {
      call: () => false
    };

    spy.on(obj, 'call');

    obj.call();

    expect(obj.call).called.once;
  });
});
