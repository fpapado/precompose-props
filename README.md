# Precompose-props
> Prop mapping made easy.

[![travis](https://travis-ci.org/fpapado/precompose-props.svg?branch=master)](https://travis-ci.org/fpapado/precompose-props)
[![npm](https://img.shields.io/npm/v/precompose-props.svg)](https://www.npmjs.com/package/precompose-props)

## Table of Contents

-   [Install](#install)
-   [Motivation](#install)
-   [Usage](#usage)
-   [API](#api)
-   [License](#license)

## Install
This package is distributed via [npm](https://www.npmjs.com/get-npm).

```shell
$ npm install --save precompose-props
# or
$ yarn add precompose-props
```

Then import according to your modules model and bundler, such as [Rollup](https://rollupjs.org/guide/en) and [Webpack](https://webpack.js.org/)

```js
// ES6 Modules
// For all possible functions to import, look at "export" in src/index.js
import { contramap, withTheme } from 'precompose-props';

/// CommonJS modules
var precomposeProps = require('precompose-props');
```

A [UMD](https://github.com/umdjs/umd) version is also available on [unpkg](https://unpkg.com/):
```html
<script src="https://unpkg.com/precompose-props/dist/precompose-props.umd.js"></script>

```

## Motivation

When working with React, I often want to make a component that "wraps" the props of another component, mapping from one set to another.
This is especially true when composing styles; I want to have a higher-level "theme" prop, that collects a set of lower-level "style" props.
Doing this manually has some annoying boilerplate, and leads to more noise than I'd like.

Ideally, I would be able to do something like this:

```jsx
const Th = ({fontWeight, color, children}) => <th style={{fontWeight, color}}>{children}</th>;

const Cell = withTheme({bold: {fontWeight: '7', color: 'black'}})(Th);
```

### Ideas

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

## Usage
```jsx
import React from "react";
import { render } from "react-dom";
import {
  withTheme,
  named,
  toggle,
  contramap,
  concatAndMergeProps
} from "precompose-props";

// The lower component
const P = ({ measure, lineHeight, fontSize, fontWeight, children }) => (
  <p style={{ maxWidth: measure, lineHeight, fontWeight, fontSize }}>
    {children}
  </p>
);

// Higher component
const Text = withTheme({
  bold: toggle({ fontWeight: "700" }),
  kind: named(
    { copy: { lineHeight: "1.5", measure: "34em" } },
    { heading: { lineHeight: "1.25" } }
  )
})(P);

// Equivalent forms
// Using concatAndMergeProps directly with contramap
const TextAlt = contramap(
  concatAndMergeProps({
    bold: toggle({ fontWeight: "700" }),
    kind: named(
      { copy: { lineHeight: "1.5", measure: "34em" } },
      { heading: { lineHeight: "1.25" } }
    )
  })
)(P);

// Using contramap with a custom function
/*
mapFakeToProps(({bold, kind, ...rest}) => "Fill this in");
const TextManual = contramap(mapFakeToProps)(P);
*/

const App = () => (
  <div>
    <Text kind="heading" fontSize="2rem" bold>
      I am a Heading
    </Text>
    <Text kind="copy" fontSize="1rem">
      This is a text oh this is a text, and would you guess, this is copy text
      with max widths and stuff.
    </Text>
    <TextAlt kind="copy" fontSize="1rem">
      This is a text oh this is a text, and would you guess, this is copy text
      with max widths and stuff.
    </TextAlt>
  </div>
);

render(<App />, document.getElementById("root"));
```

### Any abstraction you like

Another piece of wisdom by Dr. Boolean (I'm a fan, can't you tell?) is on API design (paraphrasing):

-   A set of primitives
-   A way to compose them
-   A set of precomposed things

Armed with that thought, here are the functions provided and their use cases, lower- to higher- level.

**Low-level**

-   `contramap`
      apply a mapping function from one set of props to another, pass to component

-   `concatProps`
      concatenate props according to a specification

-   `concatAndMergeProps`
      concatenate props according to a specification, merges

**Specification Utilities**

A specification is of the form
```ts
{[K in higherProp]: mapFn}

mapFn: higherPropValue => Partial<LowerProps>`.
```

-   `toggle(obj)(value)`
      return obj if value is true

-   `named(obj)(value)`
      return the entry at obj[value]

**Higher-level**

-   `withTheme`
      maps props with specification, merge other props

-   `mapTheme`
      maps props with specification, do not merge other props

If you see a pattern there, it's because the latter are simply compositions of the former!
Functions are curried by default. I have not used Ramda's `curry`; this is open to change.

### Examples
[Edit the example above on CodeSandbox](https://codesandbox.io/s/0107ywo83l)

### API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

## TODO

-   Types
-   Example folder

## Inspiration
- Brian Lonsdorf (drboolean) for his talks on functional JS. Even when the language is not the best for it, I
will occasionally run into cases where I think about concatenation or the order of operations.
- Jason Miller (developit) for his package build setups, and `microbundle`. They were a great starting
point to figure out how to publish this damn thing.
