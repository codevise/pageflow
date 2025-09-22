import {queries, buildQueries} from '@testing-library/dom'

const queryAllByRoleExcludingInert = (container, role, options) => {
  return queries
    .queryAllByRole(container, role, options)
    .filter(el => !el.closest('[inert]'));
}

const getMultipleError = (_c, role) =>
  `Found multiple elements with the role of ${role}, excluding inert ones`;

const getMissingError = (_c, role) =>
  `Unable to find an element with the role of ${role}, excluding inert ones`;

export const [
  queryByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
] = buildQueries(queryAllByRoleExcludingInert, getMultipleError, getMissingError);
