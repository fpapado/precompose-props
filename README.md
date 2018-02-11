# Prop Utils
```shell
npm install precompose
# or
yarn add precompose
```

## Motivation
When working with React, I often want want to make a component that "wraps" the props of another component, mapping from one set to another.
This is especially true when composing styles; I want to have a higher-level "theme" prop, that collects a set of lower-level "style" props.
Doing this manually has some annoying boilerplate, and leads to more noise than I'd like.

Ideally, I would be able to do something like this:
```js
const Th = ({fontWeight, color, children}) => <th {fontWeight, color}>{children}</th>;

const Cell = withTheme({bold: {fontWeight: '7', color: 'black'}})(Th);
```

## Ideas
In his talk ["Oh Composable World!"](https://www.youtube.com/watch?v=SfWR3dKnFIo), Brian Lonsdorf (aka Dr. Boolean) goes over how to use `contramap` to compose props.
A contramap in this context allows us to use a function pre-process a set of props, before passing the result on to a component. This is exactly what we want!
(Also, that sounds like `mapStateToProps()` from `react-redux`).

Let's define contramap:
```js
const contramap = mapFn => Component => props => Component(mapFn(props));
```

In his talk, he defines a `Comp = x => {...}` function, because there is a larger point about composition and concatenation for React (contravariance and monoids).
I am not doing that, because calling .fold() would look out of place in our codebase. 
Would be simple to add and fun to try though :)

## Any abstraction you like
Another piece of wisdom by Dr. Boolean (I'm a fan, can't you tell?) is on API design (paraphrasing):
- A set of primitives
- A way to compose them
- A set of precomposed things

Armed with that thought, here are the functions provided and their use cases, lower- to higher- level.

Low-level
- `contramap`
  apply a mapping function from one set of props to another, pass to component

- `concatProps`
  concatenate props according to a specification

- `concatAndMergeProps`
  concatenate props according to a specification, merges

Higher-level
- `withTheme`
  maps props with specification, merge other props

- `mapTheme`
  maps props with specification, do not merge other props

If you see a pattern there, it's because they latter are simply compositions of the former!
Functions are curried by default. I have not used Ramda's `curry`; this is open to change.

# TODO
- Types
- Example folder
- Bundle and publish