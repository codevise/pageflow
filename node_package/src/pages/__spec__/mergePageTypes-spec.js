import mergePageTypes from '../mergePageTypes';

import {expect} from 'support/chai';
import sinon from 'sinon';

describe('mergePageTypes', () => {
  it('keeps method only defined in base', () => {
    const base = {
      enhance: sinon.spy()
    };
    const mixin = {};

    const result = mergePageTypes(base, mixin);
    result.enhance();

    expect(base.enhance).to.have.been.called;
  });

  it('keeps method only defined in mixin', () => {
    const base = {};
    const mixin = {
      enhance: sinon.spy()
    };

    const result = mergePageTypes(base, mixin);
    result.enhance();

    expect(mixin.enhance).to.have.been.called;
  });

  it('calls both methods when page types provide conflicting method ', () => {
    const base = {
      enhance: sinon.spy()
    };
    const mixin = {
      enhance: sinon.spy()
    };

    const result = mergePageTypes(base, mixin);
    result.enhance();

    expect(base.enhance).to.have.been.called;
    expect(mixin.enhance).to.have.been.called;
  });

  it('uses return value of mixin', () => {
    const base = {
      enhance: sinon.stub().returns(4)
    };
    const mixin = {
      enhance: sinon.stub().returns(5)
    };

    const result = mergePageTypes(base, mixin);

    expect(result.enhance()).to.eq(5);
  });

  it('keeps properties only defined in base', () => {
    const base = {
      scroller: true
    };
    const mixin = {};

    const result = mergePageTypes(base, mixin);

    expect(result.scroller).to.eq(true);
  });

  it('keeps properties only defined in mixin', () => {
    const base = {};
    const mixin = {
      scroller: true
    };

    const result = mergePageTypes(base, mixin);

    expect(result.scroller).to.eq(true);
  });

  it('lets mixin properties win', () => {
    const base = {
      scroller: false
    };
    const mixin = {
      scroller: true
    };

    const result = mergePageTypes(base, mixin);

    expect(result.scroller).to.eq(true);
  });
});
