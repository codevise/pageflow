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
