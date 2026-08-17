import {ReviewSession} from 'review/ReviewSession';

describe('ReviewSession', () => {
  it('emits reset event with threads after fetch', async () => {
    const request = jest.fn().mockResolvedValue({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        {id: 1, subjectType: 'ContentElement', subjectId: 10, comments: [
          {id: 100, body: 'Hello', creatorId: 42, creatorName: 'Alice'}
        ]}
      ]
    });

    const session = new ReviewSession({entryId: 5, request});
    const listener = jest.fn();
    session.on('reset', listener);

    await session.fetch();

    expect(request).toHaveBeenCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'GET'
    });

    expect(listener).toHaveBeenCalledWith({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        expect.objectContaining({
          id: 1,
          comments: [expect.objectContaining({body: 'Hello'})]
        })
      ],
      commentThreadReads: {}
    });
  });

  it('exposes initialState when passed to constructor', () => {
    const session = new ReviewSession({
      entryId: 5,
      initialState: {
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [{id: 1, comments: []}]
      }
    });

    expect(session.state).toEqual({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [{id: 1, comments: []}]
    });
  });

  it('exposes state after fetch', async () => {
    const request = jest.fn().mockResolvedValue({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        {id: 1, subjectType: 'CE', subjectId: 10, comments: [{id: 100, body: 'Hello'}]}
      ]
    });

    const session = new ReviewSession({entryId: 5, request});

    expect(session.state).toBeNull();

    await session.fetch();

    expect(session.state).toEqual({
      currentUser: {id: 42, name: 'Alice'},
      commentThreads: [
        expect.objectContaining({id: 1})
      ],
      commentThreadReads: {}
    });
  });

  it('emits change:thread after createThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'Looks good!', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      body: 'Looks good!'
    });

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: 'ContentElement',
          subject_id: 10,
          comment: {body: 'Looks good!'}
        }
      }
    });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, subjectType: 'ContentElement'})
    );
  });

  it('emits create:thread after createThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'Looks good!', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('create:thread', listener);

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      body: 'Looks good!'
    });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, subjectType: 'ContentElement'})
    );
  });

  it('does not emit create:thread when updating a thread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [{id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []}]
      })
      .mockResolvedValueOnce({
        id: 1, subjectType: 'ContentElement', subjectId: 10, resolved: true, comments: []
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('create:thread', listener);

    await session.updateThread({threadId: 1, resolved: true});

    expect(listener).not.toHaveBeenCalled();
  });

  it('includes subject_range in createThread request', async () => {
    const subjectRange = {
      anchor: {path: [0, 0], offset: 5},
      focus: {path: [0, 0], offset: 12}
    };

    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        subjectRange,
        comments: [{id: 100, body: 'About this text', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      subjectRange,
      body: 'About this text'
    });

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: 'ContentElement',
          subject_id: 10,
          subject_range: subjectRange,
          comment: {body: 'About this text'}
        }
      }
    });
  });

  it('includes section_perma_id in createThread request', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        sectionPermaId: 7,
        comments: [{id: 100, body: 'Looks good!', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      sectionPermaId: 7,
      body: 'Looks good!'
    });

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: 'ContentElement',
          subject_id: 10,
          section_perma_id: 7,
          comment: {body: 'Looks good!'}
        }
      }
    });
  });

  it('includes quote in the first comment of a createThread request', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'About this text', quote: 'quick brown', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      body: 'About this text',
      quote: 'quick brown'
    });

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: 'ContentElement',
          subject_id: 10,
          comment: {body: 'About this text', quote: 'quick brown'}
        }
      }
    });
  });

  it('omits quote from createThread request when not given', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'Looks good!', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      body: 'Looks good!'
    });

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads',
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: 'ContentElement',
          subject_id: 10,
          comment: {body: 'Looks good!'}
        }
      }
    });
  });

  it('omits section_perma_id from createThread request when not given', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'Looks good!', creatorId: 42}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createThread({
      subjectType: 'ContentElement',
      subjectId: 10,
      body: 'Looks good!'
    });

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        payload: {
          comment_thread: {
            subject_type: 'ContentElement',
            subject_id: 10,
            comment: {body: 'Looks good!'}
          }
        }
      })
    );
  });

  it('updates state after createThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: []
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'ContentElement',
        subjectId: 10,
        comments: [{id: 100, body: 'New thread'}]
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.createThread({subjectType: 'ContentElement', subjectId: 10, body: 'New thread'});

    expect(session.state.commentThreads).toEqual([
      expect.objectContaining({id: 1, comments: [expect.objectContaining({body: 'New thread'})]})
    ]);
  });

  it('emits change:thread with resolvedAt after updateThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []}
        ]
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'CE',
        subjectId: 10,
        resolvedAt: '2026-04-09T10:00:00Z',
        comments: []
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.updateThread({threadId: 1, resolved: true});

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads/1',
      method: 'PATCH',
      payload: {comment_thread: {resolved: true}}
    });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, resolvedAt: '2026-04-09T10:00:00Z'})
    );
  });

  it('updates state after updateThread', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: null, comments: []}
        ]
      })
      .mockResolvedValueOnce({
        id: 1, subjectType: 'CE', subjectId: 10,
        resolvedAt: '2026-04-09T10:00:00Z', comments: []
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.updateThread({threadId: 1, resolved: true});

    expect(session.state.commentThreads).toEqual([
      expect.objectContaining({id: 1, resolvedAt: '2026-04-09T10:00:00Z'})
    ]);
  });

  it('emits change:thread with null resolvedAt after unresolving', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, resolvedAt: '2026-04-09T10:00:00Z', comments: []}
        ]
      })
      .mockResolvedValueOnce({
        id: 1,
        subjectType: 'CE',
        subjectId: 10,
        resolvedAt: null,
        comments: []
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.updateThread({threadId: 1, resolved: false});

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({id: 1, resolvedAt: null})
    );
  });

  it('includes quote in createComment request', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'First', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({id: 101, body: 'Reply', quote: 'lazy dog', creatorId: 42});

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createComment({threadId: 1, body: 'Reply', quote: 'lazy dog'});

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads/1/comments',
      method: 'POST',
      payload: {comment: {body: 'Reply', quote: 'lazy dog'}}
    });
  });

  it('omits quote from createComment request when not given', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'First', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({id: 101, body: 'Reply', creatorId: 42});

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await session.createComment({threadId: 1, body: 'Reply'});

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads/1/comments',
      method: 'POST',
      payload: {comment: {body: 'Reply'}}
    });
  });

  it('updates state after createComment', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'First', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({id: 101, body: 'Reply', creatorId: 42});

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.createComment({threadId: 1, body: 'Reply'});

    expect(session.state.commentThreads[0].comments).toEqual([
      expect.objectContaining({body: 'First'}),
      expect.objectContaining({body: 'Reply'})
    ]);
  });

  it('emits change:thread with appended comment after createComment', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'First', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({
        id: 101, body: 'Reply', creatorId: 42
      });

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.createComment({threadId: 1, body: 'Reply'});

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads/1/comments',
      method: 'POST',
      payload: {comment: {body: 'Reply'}}
    });

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        comments: [
          expect.objectContaining({body: 'First'}),
          expect.objectContaining({body: 'Reply'})
        ]
      })
    );
  });

  it('sends updateComment request', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'Typo', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({id: 100, body: 'Fixed', creatorId: 42});

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.updateComment({threadId: 1, commentId: 100, body: 'Fixed'});

    expect(request).toHaveBeenLastCalledWith({
      url: '/review/entries/5/comment_threads/1/comments/100',
      method: 'PATCH',
      payload: {comment: {body: 'Fixed'}}
    });
  });

  it('replaces comment in state after updateComment', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'Typo', creatorId: 42},
            {id: 101, body: 'Reply', creatorId: 43}
          ]}
        ]
      })
      .mockResolvedValueOnce({id: 100, body: 'Fixed', creatorId: 42});

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();
    await session.updateComment({threadId: 1, commentId: 100, body: 'Fixed'});

    expect(session.state.commentThreads[0].comments).toEqual([
      expect.objectContaining({id: 100, body: 'Fixed'}),
      expect.objectContaining({id: 101, body: 'Reply'})
    ]);
  });

  it('emits change:thread with updated comment after updateComment', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'Typo', creatorId: 42}
          ]}
        ]
      })
      .mockResolvedValueOnce({id: 100, body: 'Fixed', creatorId: 42});

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    const listener = jest.fn();
    session.on('change:thread', listener);

    await session.updateComment({threadId: 1, commentId: 100, body: 'Fixed'});

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        comments: [expect.objectContaining({id: 100, body: 'Fixed'})]
      })
    );
  });

  // Editing is not drafted, so a failed attempt has to surface rather than
  // leave the form believing the new text was stored.
  it('rethrows and leaves state untouched when updateComment fails', async () => {
    const request = jest.fn()
      .mockResolvedValueOnce({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [
          {id: 1, subjectType: 'CE', subjectId: 10, comments: [
            {id: 100, body: 'Typo', creatorId: 42}
          ]}
        ]
      })
      .mockRejectedValueOnce(new Error('Forbidden'));

    const session = new ReviewSession({entryId: 5, request});
    await session.fetch();

    await expect(session.updateComment({threadId: 1, commentId: 100, body: 'Fixed'}))
      .rejects.toThrow('Forbidden');

    expect(session.state.commentThreads[0].comments).toEqual([
      expect.objectContaining({id: 100, body: 'Typo'})
    ]);
  });

  describe('subject range updates', () => {
    const threadA = {
      id: 1, subjectType: 'ContentElement', subjectId: 10,
      subjectRange: {anchor: {path: [0, 0], offset: 0},
                     focus: {path: [0, 0], offset: 5}},
      comments: []
    };
    const threadB = {
      id: 2, subjectType: 'ContentElement', subjectId: 10,
      subjectRange: {anchor: {path: [0, 0], offset: 10},
                     focus: {path: [0, 0], offset: 15}},
      comments: []
    };
    const newRangeA = {anchor: {path: [0, 0], offset: 1},
                       focus: {path: [0, 0], offset: 6}};

    function setupSession() {
      return new ReviewSession({
        entryId: 5,
        initialState: {
          currentUser: {id: 1, name: 'Alice'},
          commentThreads: [threadA, threadB]
        }
      });
    }

    describe('diffSubjectRangeUpdates', () => {
      it('returns only threads whose subjectRange actually changed', async () => {
        const session = setupSession();

        const changed = session.diffSubjectRangeUpdates({
          1: newRangeA,
          2: threadB.subjectRange
        });

        expect(changed).toEqual({1: newRangeA});
      });

      it('returns empty object when no ranges differ', async () => {
        const session = setupSession();

        const changed = session.diffSubjectRangeUpdates({
          1: threadA.subjectRange,
          2: threadB.subjectRange
        });

        expect(changed).toEqual({});
      });

      it('skips unknown thread ids', async () => {
        const session = setupSession();

        const changed = session.diffSubjectRangeUpdates({
          999: {anchor: {path: [9, 9], offset: 9},
                focus: {path: [9, 9], offset: 9}}
        });

        expect(changed).toEqual({});
      });

      it('does not mutate session state', async () => {
        const session = setupSession();

        session.diffSubjectRangeUpdates({1: newRangeA});

        const stored = session.state.commentThreads.find(t => t.id === 1);
        expect(stored.subjectRange).toEqual(threadA.subjectRange);
      });
    });

    describe('applySubjectRangeUpdates', () => {
      it('updates stored subjectRange for each passed thread', async () => {
        const session = setupSession();

        session.applySubjectRangeUpdates({1: newRangeA});

        const stored = session.state.commentThreads.find(t => t.id === 1);
        expect(stored.subjectRange).toEqual(newRangeA);
      });

      it('emits change:thread for each updated thread', async () => {
        const session = setupSession();
        const listener = jest.fn();
        session.on('change:thread', listener);

        session.applySubjectRangeUpdates({1: newRangeA});

        expect(listener).toHaveBeenCalledWith(
          expect.objectContaining({id: 1, subjectRange: newRangeA})
        );
      });

      it('ignores unknown thread ids', async () => {
        const session = setupSession();
        const listener = jest.fn();
        session.on('change:thread', listener);

        session.applySubjectRangeUpdates({
          999: {anchor: {path: [9, 9], offset: 9},
                focus: {path: [9, 9], offset: 9}}
        });

        expect(listener).not.toHaveBeenCalled();
      });
    });
  });

  describe('findThreadsFor', () => {
    const threadA = {
      id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []
    };
    const threadB = {
      id: 2, subjectType: 'ContentElement', subjectId: 10, comments: []
    };
    const threadC = {
      id: 3, subjectType: 'ContentElement', subjectId: 20, comments: []
    };
    const threadD = {
      id: 4, subjectType: 'Section', subjectId: 10, comments: []
    };

    function setupSession() {
      return new ReviewSession({
        entryId: 5,
        initialState: {
          currentUser: null,
          commentThreads: [threadA, threadB, threadC, threadD]
        }
      });
    }

    it('returns threads matching subjectType and subjectId', () => {
      const session = setupSession();

      const result = session.findThreadsFor({
        subjectType: 'ContentElement', subjectId: 10
      });

      expect(result.map(t => t.id)).toEqual([1, 2]);
    });

    it('returns empty array when nothing matches', () => {
      const session = setupSession();

      const result = session.findThreadsFor({
        subjectType: 'ContentElement', subjectId: 99
      });

      expect(result).toEqual([]);
    });

    it('returns empty array before fetch when state is null', () => {
      const session = new ReviewSession({entryId: 5});

      const result = session.findThreadsFor({
        subjectType: 'ContentElement', subjectId: 10
      });

      expect(result).toEqual([]);
    });
  });

  describe('applyThreadUpdates', () => {
    const threadA = {
      id: 1, subjectType: 'ContentElement', subjectId: 10,
      subjectRange: {anchor: {path: [0, 0], offset: 0},
                     focus: {path: [0, 0], offset: 5}},
      comments: []
    };
    const threadB = {
      id: 2, subjectType: 'ContentElement', subjectId: 10,
      subjectRange: {anchor: {path: [0, 0], offset: 10},
                     focus: {path: [0, 0], offset: 15}},
      comments: []
    };

    function setupSession() {
      return new ReviewSession({
        entryId: 5,
        initialState: {
          currentUser: null,
          commentThreads: [threadA, threadB]
        }
      });
    }

    it('updates subjectRange for a thread that stays on its content element', () => {
      const session = setupSession();
      const newRange = {anchor: {path: [0, 0], offset: 1},
                        focus: {path: [0, 0], offset: 6}};

      session.applyThreadUpdates({1: {subjectRange: newRange}});

      const stored = session.state.commentThreads.find(t => t.id === 1);
      expect(stored.subjectRange).toEqual(newRange);
    });

    it('migrates a thread to a different subject_id with a new range', () => {
      const session = setupSession();
      const newRange = {anchor: {path: [0, 0], offset: 0},
                        focus: {path: [0, 0], offset: 2}};

      session.applyThreadUpdates({
        2: {subjectId: 60, subjectRange: newRange}
      });

      const stored = session.state.commentThreads.find(t => t.id === 2);
      expect(stored).toMatchObject({subjectId: 60, subjectRange: newRange});
    });

    it('emits change:thread for each updated thread', () => {
      const session = setupSession();
      const listener = jest.fn();
      session.on('change:thread', listener);

      session.applyThreadUpdates({
        1: {subjectRange: threadA.subjectRange},
        2: {subjectId: 60}
      });

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({id: 1}));
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({id: 2, subjectId: 60})
      );
    });

    it('ignores unknown thread ids', () => {
      const session = setupSession();
      const listener = jest.fn();
      session.on('change:thread', listener);

      session.applyThreadUpdates({
        999: {subjectId: 60}
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('drafts', () => {
    function setupSession({request} = {}) {
      return new ReviewSession({
        entryId: 5,
        request: request || jest.fn(),
        initialState: {currentUser: {id: 42, name: 'Alice'}, commentThreads: []}
      });
    }

    it('stores a draft per subject and emits change:drafts', () => {
      const session = setupSession();
      const listener = jest.fn();
      session.on('change:drafts', listener);

      session.setDraft({
        subjectType: 'ContentElement', subjectId: 10, body: 'Half a thought'
      });

      expect(session.drafts).toEqual({
        'ContentElement:10': {
          subjectType: 'ContentElement',
          subjectId: 10,
          body: 'Half a thought',
          pending: false
        }
      });
      expect(listener).toHaveBeenCalledWith(session.drafts);
    });

    it('keeps drafts of replies separate from those of new threads', () => {
      const session = setupSession();

      session.setDraft({
        subjectType: 'ContentElement', subjectId: 10, body: 'A new topic'
      });
      session.setDraft({threadId: 10, body: 'A reply'});

      expect(session.drafts).toEqual({
        'ContentElement:10': expect.objectContaining({body: 'A new topic'}),
        'Thread:10': {threadId: 10, body: 'A reply', pending: false}
      });
    });

    it('discards the draft of a reply when the body is blank', () => {
      const session = setupSession();
      session.setDraft({threadId: 10, body: 'A reply'});

      session.setDraft({threadId: 10, body: ''});

      expect(session.drafts).toEqual({});
    });

    it('shares one draft between the ranges of a subject', () => {
      const session = setupSession();

      session.setDraft({
        subjectType: 'ContentElement', subjectId: 10, body: 'About one phrase'
      });
      session.setDraft({
        subjectType: 'ContentElement', subjectId: 10, body: 'About another'
      });

      expect(Object.keys(session.drafts)).toEqual(['ContentElement:10']);
      expect(session.drafts['ContentElement:10'].body).toEqual('About another');
    });

    it('discards the draft when the body is blank', () => {
      const session = setupSession();
      session.setDraft({
        subjectType: 'ContentElement', subjectId: 10, body: 'Half a thought'
      });

      const listener = jest.fn();
      session.on('change:drafts', listener);

      session.setDraft({subjectType: 'ContentElement', subjectId: 10, body: '  '});

      expect(session.drafts).toEqual({});
      expect(listener).toHaveBeenCalledWith({});
    });

    it('marks the draft pending while the thread is being created', async () => {
      let respond;
      const request = jest.fn(() => new Promise(resolve => {respond = resolve}));
      const session = setupSession({request});

      const promise = session.createThread({
        subjectType: 'ContentElement', subjectId: 10, body: 'Looks good!'
      });

      expect(session.drafts['ContentElement:10']).toEqual({
        subjectType: 'ContentElement',
        subjectId: 10,
        body: 'Looks good!',
        pending: true
      });

      respond({id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []});
      await promise;

      expect(session.drafts).toEqual({});
    });

    it('drops the draft only after announcing the created thread', async () => {
      const request = jest.fn().mockResolvedValue({
        id: 1, subjectType: 'ContentElement', subjectId: 10, comments: []
      });
      const session = setupSession({request});

      const events = [];
      session.on('create:thread', () => events.push('create:thread'));
      session.on('change:drafts', () => events.push('change:drafts'));

      await session.createThread({
        subjectType: 'ContentElement', subjectId: 10, body: 'Looks good!'
      });

      expect(events).toEqual(['change:drafts', 'create:thread', 'change:drafts']);
    });

    it('marks the draft of a reply pending while it is being created', async () => {
      let respond;
      const request = jest.fn(() => new Promise(resolve => {respond = resolve}));
      const session = new ReviewSession({
        entryId: 5,
        request,
        initialState: {
          currentUser: {id: 42, name: 'Alice'},
          commentThreads: [{
            id: 7, subjectType: 'ContentElement', subjectId: 10, comments: []
          }]
        }
      });

      const promise = session.createComment({threadId: 7, body: 'A reply'});

      expect(session.drafts['Thread:7']).toEqual({
        threadId: 7, body: 'A reply', pending: true
      });

      respond({id: 100, body: 'A reply'});
      await promise;

      expect(session.drafts).toEqual({});
    });

    it('keeps the draft of a reply and clears pending when creating fails', async () => {
      const error = new Error('500 Internal Server Error');
      const session = setupSession({request: jest.fn().mockRejectedValue(error)});

      await expect(session.createComment({threadId: 7, body: 'A reply'}))
        .rejects.toThrow(error);

      expect(session.drafts['Thread:7']).toEqual({
        threadId: 7, body: 'A reply', pending: false
      });
    });

    it('keeps the draft and clears pending when creating fails', async () => {
      const error = new Error('500 Internal Server Error');
      const session = setupSession({request: jest.fn().mockRejectedValue(error)});

      await expect(session.createThread({
        subjectType: 'ContentElement', subjectId: 10, body: 'Looks good!'
      })).rejects.toThrow(error);

      expect(session.drafts['ContentElement:10']).toEqual({
        subjectType: 'ContentElement',
        subjectId: 10,
        body: 'Looks good!',
        pending: false
      });
      expect(session.state.commentThreads).toEqual([]);
    });
  });

  describe('#markThreadsRead', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    async function createFetchedSession({commentThreadReads = {}} = {}) {
      const request = jest.fn().mockResolvedValue({
        currentUser: {id: 42, name: 'Alice'},
        commentThreads: [{id: 1, permaId: 5, comments: []}],
        commentThreadReads
      });

      const session = new ReviewSession({entryId: 5, request});
      await session.fetch();
      request.mockClear();
      request.mockResolvedValue(null);

      return {session, request};
    }

    it('exposes read timestamps from fetch in state', async () => {
      const {session} = await createFetchedSession({
        commentThreadReads: {5: '2026-08-17T10:00:00.000Z'}
      });

      expect(session.state.commentThreadReads).toEqual({5: '2026-08-17T10:00:00.000Z'});
    });

    it('emits change:reads with read timestamp for marked threads', async () => {
      const {session} = await createFetchedSession();
      const listener = jest.fn();
      session.on('change:reads', listener);

      session.markThreadsRead([5]);

      expect(listener).toHaveBeenCalledWith({5: expect.any(String)});
      expect(session.state.commentThreadReads[5]).toEqual(expect.any(String));
    });

    it('keeps read timestamps of other threads', async () => {
      const {session} = await createFetchedSession({
        commentThreadReads: {7: '2026-08-17T10:00:00.000Z'}
      });

      session.markThreadsRead([5]);

      expect(session.state.commentThreadReads[7]).toEqual('2026-08-17T10:00:00.000Z');
    });

    it('sends marked perma ids in single request after delay', async () => {
      const {session, request} = await createFetchedSession();

      session.markThreadsRead([5]);
      session.markThreadsRead([6]);

      expect(request).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        url: '/review/entries/5/comment_thread_reads',
        method: 'POST',
        payload: {comment_thread_perma_ids: [5, 6]}
      });
    });

    it('does not send perma id twice', async () => {
      const {session, request} = await createFetchedSession();

      session.markThreadsRead([5]);
      session.markThreadsRead([5]);
      jest.runAllTimers();

      expect(request).toHaveBeenCalledWith(
        expect.objectContaining({payload: {comment_thread_perma_ids: [5]}})
      );
    });

    it('does not send request for empty list of perma ids', async () => {
      const {session, request} = await createFetchedSession();

      session.markThreadsRead([]);
      jest.runAllTimers();

      expect(request).not.toHaveBeenCalled();
    });

    it('ignores marks before state has been fetched', () => {
      const request = jest.fn();
      const session = new ReviewSession({entryId: 5, request});

      session.markThreadsRead([5]);
      jest.runAllTimers();

      expect(request).not.toHaveBeenCalled();
    });

    it('sends pending perma ids on flushReads', async () => {
      const {session, request} = await createFetchedSession();

      session.markThreadsRead([5]);
      await session.flushReads();

      expect(request).toHaveBeenCalledTimes(1);
    });

    it('does not send request again when nothing is pending', async () => {
      const {session, request} = await createFetchedSession();

      session.markThreadsRead([5]);
      await session.flushReads();
      await session.flushReads();

      expect(request).toHaveBeenCalledTimes(1);
    });

    it('retries perma ids of failed request on next flush', async () => {
      const {session, request} = await createFetchedSession();
      request.mockRejectedValueOnce(new Error('Network down'));

      session.markThreadsRead([5]);
      await session.flushReads();
      await session.flushReads();

      expect(request).toHaveBeenCalledTimes(2);
      expect(request).toHaveBeenLastCalledWith(
        expect.objectContaining({payload: {comment_thread_perma_ids: [5]}})
      );
    });
  });
});
