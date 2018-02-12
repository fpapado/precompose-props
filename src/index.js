import {toPairs, pickBy, has, mergeAll} from 'ramda';

// 1: A set of primitives

/* "Preprocess" a set of props and pass the transformed ones to the component
 * contramap<T, P> = (Component: React.Component<P>, mapFn: T => P) => React.Component<T>
 * Or equivalently
 * contramap<T, P> = (Component: React.Component<P>, mapFn: T => P) => props: T => React.Component
*/
export const contramap = mapFn => Component => props => Component(mapFn(props));

// 2: Ways to compose them
// Helpers for mapping props to values; use these with concatProps
export const toggle = val => on => (on ? val : {});
export const named = obj => key => obj[key];

/* Take a map from higher props to lower props, and higher props then return the transformed ones
 * Use this if you want to merge other props yourself
*/
// TODO: make more generic
export const concatProps = propMap => props =>
  mergeAll(toPairs(propMap).map(([propName, fn]) => fn(props[propName])));

/* Take a map from higher props to lower props, and higher props
 * then return the transformed ones and any props that are not higher
 * Use this in conjuction with contramap
*/
export const concatAndMergeProps = propMap => props =>
  mergeAll([
    pickBy((v, p) => !has(p, propMap), props),
    concatProps(propMap)(props)
  ]);

// 3: A set of pre-composed things
// NOTE: If you require a custom map function, just use contramap(mapFn)(Component)
// NOTE 2: These functions return a function that takes props (e.g a React Component)

// Take a propMap, transform and merge the props given after
// withTheme<T, P> = (Component: React.Component<P>, propMap: ???) => React.Component<T&(whatever else)>
export const withTheme = propMap => contramap(concatAndMergeProps(propMap));

// Take a propMap, transform the props given after, but do not merge extras
// mapTheme<T, P> = (Component: React.Component<P>, propMap: ???) => React.Component<T>
export const mapTheme = propMap => contramap(concatProps(propMap));
