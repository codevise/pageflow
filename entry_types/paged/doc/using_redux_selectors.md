# Using Redux Selectors

This guide assumes a solid understanding of React and Redux.

Pageflow stores all data about an entry and its current view state in
a Redux store. To access this information from React components in
pages and widgets, the components need to be connected to the
store. To decouple components from the internal structure of the
store, Pageflow provides selector functions which can be used to
extract the desired piece of information from the store. So instead of
accessing the store directly:

```jsx
const {connect} = pageflow.react;

connect(
  state => {
    return {
      someCustomSetting: state.settings.whatever.someCustomSetting
    };
  }
)(MyWidget);
```

We use a function from `pageflow.react.selectors` to create a
selector:

```jsx
const {connect} = pageflow.react;
const settingSelector = pageflow.react.selectors.setting({
  property: 'someCustomSetting'
});

connect(
  state => {
    return {
      comeCustomSetting: settingSelector(state)
    };
  }
)(MyWidget);
```

To make the above code more concise, Pageflow gives us a `combine`
method:

```jsx
const {connect, combine} = pageflow.react
const {setting} = pageflow.react.selectors;

connect(combine({
  comeCustomSetting: setting({
    property: 'someCustomSetting'
  })
}))(MyWidget);
```

## Connecting Page Components

The `pageAttribute` selector can be used to access configuration
attributes of pages, for example its title or some other option that
can be configured inside the editor. So if we want to create a
component that renders the title of the page with id 5, we can write:

```jsx
const {connect, combine} = pageflow.react
const {pageAttribute} = pageflow.react.selectors;

function HugeTitle(props) {
  return (
    <h4>{props.title}</h4>
  );
}

connect(combine({
  title: pageAttribute('title', {
    id: 5
  })
}))(HugeTitle);
```

For components that are rendered inside a page, though, we are mostly
interested in accessing attributes of the containing page. But how can
we know the id of the current page, so we can pass it to the selector?

To make this easy, Pageflow provides a specialized connect function
called `connectInPage`, which evaluates selectors in the context of
the page the component is rendered in:

```jsx
const {connectInPage, combine} = pageflow.react
const {pageAttribute} = pageflow.react.selectors;

function HugeTitle(props) {
  return (
    <h4>{props.title}</h4>
  );
}

connectInPage(combine({
  title: pageAttribute('title')
}))(HugeTitle);
```

Whenever we now render an instance of `HugeTitle` inside a page, it
will display the title of that page. This works up to and including
the outermost component that is passed to `registerPageType` (`Page`,
in the following example):

```jsx
// rainbow/app/assets/javascripts/rainbow/components.jsx
(function() {
  const {
    PageWrapper,
    PageBackground, PageBackgroundImage, PageShadow,
    PageContent, PageHeader, PageText
  } = pageflow.react.components;

  function Page(props) {
    return (
      <PageWrapper>
        <PageBackground>
          <PageBackgroundImage page={props.page} />
          <PageShadow page={props.page} />
        </PageBackground>

        <PageContent>
          <PageHeader page={props.page} />
          <PageText page={props.page} />
        </PageContent>
      </PageWrapper>
    );
  }

  const {registerPageType, connectInPage, combine} = pageflow.react;
  const {pageAttributes} = pageflow.react.selectors;

  registerPageType('rainbow', {
    component: connectInPage(
      combine({
        page: pageAttributes()
      })
    )(Page)
  });
}());
```
