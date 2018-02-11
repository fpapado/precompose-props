// import { mapObjIndexed, filter, has } from "ramda";
const {compose, map, toPairs, pickBy, has, mergeAll} = require('ramda');

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
const contramap = mapFn => Component => props => Component(mapFn(props));

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
const concatAndMergeProps = propMap => props => ({
  ...pickBy((v, p) => !has(p, propMap), props),
  ...concatProps(propMap)(props)
});

// 3: A set of pre-composed things
// withTheme<T, P> = (Component: React.Component<P>, propMap: T => P) => React.Component<T&P>
// Assumes a propMap, merges
const withTheme = compose(contramap, concatAndMergeProps);
// const withTheme = propMap => contramap(concatAndMergeProps(propMap));
// const withTheme = propMap => props => contramap(concatAndMergeProps(propMap))(props);

// mapTheme<T, P> = (Component: React.Component<P>, mapFn: T => P) => React.Component<T>
// Assumes a propMap, does not merge
const mapTheme = compose(contramap, concatProps);
// const mapTheme = propMap => contramap(concatProps(propMap));
// const mapTheme = propMap => props => contramap(concatProps(propMap))(props);

// NOTE:
// If you require a custom map function, just use contramap(mapFn)(Component)

// Tests
console.log('Should have only the transformed and other lower props.');
contramap(
  concatAndMergeProps({
    bold: toggle({fontWeight: '5', color: 'red'}),
    textKind: named({
      title: {lineHeight: 'solid'},
      copy: {lineHeight: 'copy', measure: 'normal'}
    })
  })
)(console.log)({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});

console.log(
  'Should be equivalent to calling contramap(concatAndMergeProps(mapObj)) directly'
);
withTheme({
  bold: toggle({fontWeight: '5', color: 'red'}),
  textKind: named({
    title: {lineHeight: 'solid'},
    copy: {lineHeight: 'copy', measure: 'normal'}
  })
})(console.log)({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});

console.log('Should have only the transformed props.');
contramap(
  concatProps({
    bold: toggle({fontWeight: '5', color: 'red'}),
    textKind: named({
      title: {lineHeight: 'solid'},
      copy: {lineHeight: 'copy', measure: 'normal'}
    })
  })
)(console.log)({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});

console.log(
  'Should be equivalent to calling contramap(concatProps(mapObj)) directly'
);
mapTheme({
  bold: toggle({fontWeight: '5', color: 'red'}),
  textKind: named({
    title: {lineHeight: 'solid'},
    copy: {lineHeight: 'copy', measure: 'normal'}
  })
})(console.log)({
  bold: true,
  textKind: 'copy',
  children: '<H1>Hello, World</H1>'
});