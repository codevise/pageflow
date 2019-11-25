import '$pageflow/frontend';

describe('pageflow.PageTransitions', function() {
  var PageTransitions = pageflow.PageTransitions;

  it('allows registering with different options per direction', function() {
    var pageTransitions = new PageTransitions(fakeNavigationDirection('v'));

    pageTransitions.register('scroll', {
      v: {className: 'scroll-v', duration: 500},
      h: {className: 'scroll-h', duration: 700}
    });
    var transition = pageTransitions.get('scroll');

    expect(transition.className).to.eq('scroll-v');
    expect(transition.duration).to.eq(500);
  });

  it('returns matching options if navigation direction is horizontal', function() {
    var pageTransitions = new PageTransitions(fakeNavigationDirection('h'));

    pageTransitions.register('scroll', {
      v: {className: 'scroll-v', duration: 500},
      h: {className: 'scroll-h', duration: 700}
    });
    var transition = pageTransitions.get('scroll');

    expect(transition.className).to.eq('scroll-h');
    expect(transition.duration).to.eq(700);
  });

  it('allows getting names of registered transitions', function() {
    var pageTransitions = new PageTransitions(fakeNavigationDirection('h'));

    pageTransitions.register('scroll', {
      v: {className: 'scroll-v', duration: 500},
      h: {className: 'scroll-h', duration: 700}
    });
    pageTransitions.register('fade', {
      v: {className: 'fade-v', duration: 500},
      h: {className: 'fade-h', duration: 700}
    });
    var names = pageTransitions.names();

    expect(names).to.eql(['scroll', 'fade']);
  });

  function fakeNavigationDirection(direction) {
    return {
      isHorizontal: function() {
        return direction == 'h';
      }
    };
  }
});
