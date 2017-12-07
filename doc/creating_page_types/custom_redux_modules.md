# Custom Redux Modules

In the context of Pageflow, Redux modules are a way of packaging up
some Redux reducers and a Redux saga that together form a meaningful
piece of functionality. They are simple JavaScript objects with two
optional properties: `reducers` and `saga`. `reducers` is an object of
the form that one passes to `combineReducers` and `saga` is a
generator function.

When registering page types, we can pass Redux modules to give the
page additional functionality. For example, in the
[guide on displaying background images and videos](displaying_background_images_or_videos.md),
we are using the `mediaPageBackgroundReduxModule` which contains
reducers and sagas to handle background video playback. In this guide
we learn how to define our own Redux modules to store page state data
and handle side effects.

## Managing Page State with Custom Reducers

When defining a page type, we can use Pageflow's Redux store to keep
track of custom state. As a simple example, let's assume we want to
display a counter and an increment button on our page. In particular,
we want each page to have its own counter when there are multiple
pages using our page type. Pageflow makes it easy to manage this state
per page.

As a first step, we define Redux actions and action creators:

```js
const INCREMENT = 'MY_PLUGIN_INCREMENT';

function increment({pageId}) {
  return {
    type: INCREMENT,
    meta: {
      collectionName: 'pages',
      itemId: pageId
    }
  };
}
```
Note that we need to pass a special `meta` property inside the action
to keep track of which page the action is meant for.

Now we define a reducer to handle the page state:

```js
function counterReducer(state = 0, action) {
  switch (action.type) {
  case INCREMENT:
    return state + 1;
  default:
    return state;
  }
}
```

Then we define a page component to display the counter and increment
button.

```jsx
  const {
    PageWrapper,
    MediaPageBackground, PageBackgroundImage, PageShadow,
    PageContent, PageHeader, PageText
  } = pageflow.react.components;

  function Page(props) {
    return (
      <PageWrapper>
        <MediaPageBackground page={props.page} />

        <PageContent>
          <PageHeader page={props.page} />
          <PageText page={props.page} />

          Counter: {props.counter}
          <button onClick={props.onIncrement}>Increment</button>
        </PageContent>
      </PageWrapper>
    );
  }
```

When registering the page type, we can pass the custom page state
reducer inside the `reducers` property of a Redux Module. In the
`connectInPage` call, we use a `pageState` selector to retrieve the
counter from the page's state in the store. Finally, via the second
argument of the `connectInPage` call, we dispatch the `increment`
action whenever the `onIncrement` callback is invoked:

```jsx
  const {registerPageType, connectInPage, combine} = pageflow.react;
  const {pageAttributes, pageState} = pageflow.react.selectors;

  registerPageType('counter_page', {
    reduxModules: [
      {
        reducers: {
          counter: counterReducer
        }
      }
    },

    component: connectInPage(
      combine({
        page: pageAttributes(),
        counter: pageState('counter')
      }),
      {
        onIncrement: increment
      }
    )(Page)
  });
```

All selectors and actions are automatically scoped to the
corresponding page. Apart from having to pass the page id in the
action's `meta` property, Pageflow makes it look as if each page was
its own little Redux application.

## Handling Side Effects with Custom Sagas

TODO
