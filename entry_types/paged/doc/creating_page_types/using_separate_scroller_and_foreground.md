# Using Separate Scroller and Foreground

In the default setup, the `PageContent` component wraps the content of
the page into a scroller. For some page types it might be necessary to
place elements in the page foreground, but outside of the
scroller. The most common case involves the display of player
controls. For this case, you can use separate `PageForeground` and
`PageScroller` components instead of the `PageContent` component:

```jsx
const {
  PageWrapper,
  PageBackground, PageBackgroundImage, PageShadow,
  PageForeground, PageScroller, PageHeader, PageText
} = pageflow.react.components;

function Page(props) {
  return (
    <PageWrapper>
      <PageBackground>
        <PageBackgroundImage page={props.page} />
        <PageShadow page={props.page} />
      </PageBackground>

      <PageForeground>
        <SomeCustomPlayerControls />

        <PageScroller>
          <PageHeader page={props.page} />
          <PageText page={props.page} />
        </PageScroller>
      </PageForeground>
    </PageWrapper>
  );
}
```

That way the player controls can be part of the page foreground, which
is animated when the current page changes, but are still outside of
the scroller.
