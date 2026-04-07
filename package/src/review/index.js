import {ReviewSession} from './ReviewSession';
import {request} from './request';

export {ReviewSession};

export function createReviewSession({entryId}) {
  return new ReviewSession({entryId, request});
}
