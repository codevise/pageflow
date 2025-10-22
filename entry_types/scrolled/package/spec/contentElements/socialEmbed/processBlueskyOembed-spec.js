import {processBlueskyOembed} from 'contentElements/socialEmbed/processBlueskyOembed';

describe('processBlueskyOembed', () => {
  it('extracts data-bluesky-uri from blockquote', () => {
    const oembedResponse = {
      html: '<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:testuser123/app.bsky.feed.post/abc123xyz" data-bluesky-cid="bafyreitestcid123"><p lang="">Test post content</p></blockquote>',
      url: 'https://bsky.app/profile/test.user/post/abc123xyz'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('at://did:plc:testuser123/app.bsky.feed.post/abc123xyz');
  });

  it('extracts data-bluesky-uri from complex HTML with script tag', () => {
    const oembedResponse = {
      html: '<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:testdid456/app.bsky.feed.post/post789" data-bluesky-cid="bafyreitestcid456" data-bluesky-embed-color-mode="system"><p lang="">Post content<br><br><a href="https://bsky.app/profile/did:plc:testdid456/post/post789?ref_src=embed">[image or embed]</a></p>&mdash; Test User (<a href="https://bsky.app/profile/did:plc:testdid456?ref_src=embed">@test.user</a>) <a href="https://bsky.app/profile/did:plc:testdid456/post/post789?ref_src=embed">January 1, 2025 at 12:00 PM</a></blockquote><script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>',
      url: 'https://bsky.app/profile/test.user/post/post789'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('at://did:plc:testdid456/app.bsky.feed.post/post789');
  });

  it('returns fallback URL when blockquote is missing', () => {
    const oembedResponse = {
      html: '<div>Some other content</div>',
      url: 'https://example.com/post/123'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('https://example.com/post/123');
  });

  it('returns fallback URL when blockquote lacks bluesky-embed class', () => {
    const oembedResponse = {
      html: '<blockquote data-bluesky-uri="at://test">Content</blockquote>',
      url: 'https://example.com/post/456'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('https://example.com/post/456');
  });

  it('returns fallback URL when data-bluesky-uri attribute is missing', () => {
    const oembedResponse = {
      html: '<blockquote class="bluesky-embed"><p>Content without uri</p></blockquote>',
      url: 'https://example.com/post/789'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('https://example.com/post/789');
  });

  it('returns fallback URL when data-bluesky-uri is empty string', () => {
    const oembedResponse = {
      html: '<blockquote class="bluesky-embed" data-bluesky-uri=""><p>Content</p></blockquote>',
      url: 'https://example.com/post/empty'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('https://example.com/post/empty');
  });

  it('returns undefined as fallback when url is not provided', () => {
    const oembedResponse = {
      html: '<div>No blockquote here</div>'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBeUndefined();
  });

  it('handles multiple blockquotes and selects the first with bluesky-embed class', () => {
    const oembedResponse = {
      html: '<blockquote>First generic</blockquote><blockquote class="bluesky-embed" data-bluesky-uri="at://first/uri">First Bluesky</blockquote><blockquote class="bluesky-embed" data-bluesky-uri="at://second/uri">Second Bluesky</blockquote>',
      url: 'https://example.com/fallback'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('at://first/uri');
  });

  it('handles special characters in AT Protocol URI', () => {
    const oembedResponse = {
      html: '<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:testuser-123_xyz/app.bsky.feed.post/abc-123_XYZ"><p>Content</p></blockquote>',
      url: 'https://example.com/fallback'
    };

    const result = processBlueskyOembed(oembedResponse);

    expect(result).toBe('at://did:plc:testuser-123_xyz/app.bsky.feed.post/abc-123_XYZ');
  });
});
