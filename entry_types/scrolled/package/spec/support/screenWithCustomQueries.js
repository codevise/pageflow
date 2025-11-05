import {queries, within} from '@testing-library/dom';

import * as roleQueriesExcludingInert from 'support/roleQueriesExcludingInert';

const allQueries = {
  ...queries,
  ...roleQueriesExcludingInert
};

export const screen = within(document.body, allQueries);
