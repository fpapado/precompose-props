// import { mapObjIndexed, filter, has } from "ramda";
const {map, toPairs, pickBy, has, mergeAll} = require('ramda');

// 1: A set of primitives
// Helpers for mapping props to values; use these with concatProps
const toggle = val => on => (on ? val : {});
const named = obj => key => obj[key];
const scale = arr => i => arr[i];

/* "Preprocess" a set of props and pass the transformed ones to the component
 * contramap<T, P> = (Component: React.Component<P>, mapFn: T => P) => React.Component<T>
 * Or equivalently
 * contramap<T, P> = (Component: React.Component<P>, mapFn: T => P) => props: T => React.Component
*/
const contramap = (Component, mapFn) => props => Component(mapFn(props));

// 2: Ways to compose them

/* Take a map from higher props to lower props, and higher props then return the transformed ones
 * Use this if you want to merge other props yourself
*/
const concatProps = propMap => props =>
  mergeAll(map(([propName, fn]) => fn(props[propName]), toPairs(propMap)));

/* Take a map from higher props to lower props, and higher props
 * then return the transformed ones and any props that are not higher
 * Use this in conjuction with contramap
*/
const concatAndMerge = propMap => props => ({
  ...pickBy((v, p) => !has(p, propMap), props),
  ...concatProps(propMap)(props)
});

// 3: A set of pre-composed things
// withTheme<T, P> = (Component: React.Component<P>, propMap: T => P) => React.Component<T&P>
// Takes any fn, merges
const withThemeFn = (Component, mapFn) => contramap(Component, mapFn);
// Assumes a propMap, merges
const withTheme = (Component, propMap) => withThemeFn(Component, concatAndMerge(propMap));

// mapTheme<T, P> = (Component: React.Component<P>, mapFn: T => P) => React.Component<T>
// Assumes a propMap, does not merge
const mapThemeFn = (Component, mapFn) => contramap(Component, mapFn);
// Takes any fn, does not merge
const mapTheme = (Component, propMap) => mapThemeFn(Component, concatProps(propMap));

// Tests
console.log('Should have only the transformed and other lower props.');
contramap(
  console.log,
  concatAndMerge({
    bold: toggle({fontWeight: '5', color: 'red'}),
    textKind: named({
      title: {lineHeight: 'solid'},
      copy: {lineHeight: 'copy', measure: 'normal'}
    })
  })
)({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});

console.log(
  'Should be equivalent to calling contramap(concatAndMerge(mapObj)) directly'
);
withTheme(console.log, {
  bold: toggle({fontWeight: '5', color: 'red'}),
  textKind: named({
    title: {lineHeight: 'solid'},
    copy: {lineHeight: 'copy', measure: 'normal'}
  })
})({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});

console.log('Should have only the transformed props.');
contramap(
  console.log,
  concatProps({
    bold: toggle({fontWeight: '5', color: 'red'}),
    textKind: named({
      title: {lineHeight: 'solid'},
      copy: {lineHeight: 'copy', measure: 'normal'}
    })
  })
)({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});

console.log(
  'Should be equivalent to calling contramap(concatProps(mapObj)) directly'
);
mapTheme(console.log, {
  bold: toggle({fontWeight: '5', color: 'red'}),
  textKind: named({
    title: {lineHeight: 'solid'},
    copy: {lineHeight: 'copy', measure: 'normal'}
  })
})({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});
