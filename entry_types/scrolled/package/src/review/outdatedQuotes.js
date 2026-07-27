// Picks the comments whose recorded quote no longer matches the text as it
// reads now. While a comment still refers to the current wording, the
// highlight in the entry is the better point of reference. Consecutive
// comments sharing a referent only show it on the first of them, so a run of
// replies about the same wording does not repeat it.
export function commentsWithOutdatedQuote(comments, currentQuote) {
  const ids = new Set();

  comments.forEach((comment, index) => {
    const previousQuote = index > 0 ? comments[index - 1].quote : undefined;

    if (comment.quote && comment.quote !== currentQuote && comment.quote !== previousQuote) {
      ids.add(comment.id);
    }
  });

  return ids;
}
