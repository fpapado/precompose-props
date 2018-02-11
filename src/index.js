// import { mapObjIndexed, filter, has } from "ramda";
import {compose, map, toPairs, pickBy, has, mergeAll} from 'ramda';

// Lighter Object.assign stand-in
function assign(obj, props) {
  for (let i in props) obj[i] = props[i];
  return obj;
}

// 1: A set of primitives
// Helpers for mapping props to values; use these with concatProps
// TODO: make fully monoids
export const toggle = val => on => (on ? val : {});
export const named = obj => key => obj[key];
export const scale = arr => i => arr[i];

/* "Preprocess" a set of props and pass the transformed ones to the component
 * contramap<T, P> = (Component: React.Component<P>, mapFn: T => P) => React.Component<T>
 * Or equivalently
 * contramap<T, P> = (Component: React.Component<P>, mapFn: T => P) => props: T => React.Component
*/
export const contramap = mapFn => Component => props => Component(mapFn(props));

// 2: Ways to compose them

/* Take a map from higher props to lower props, and higher props then return the transformed ones
 * Use this if you want to merge other props yourself
*/
export const concatProps = propMap => props =>
  mergeAll(map(([propName, fn]) => fn(props[propName]), toPairs(propMap)));

/* Take a map from higher props to lower props, and higher props
 * then return the transformed ones and any props that are not higher
 * Use this in conjuction with contramap
*/
export const concatAndMergeProps = propMap => props =>
  assign(
    assign({}, pickBy((v, p) => !has(p, propMap), props)),
    concatProps(propMap)(props)
  );

// 3: A set of pre-composed things
// withTheme<T, P> = (Component: React.Component<P>, propMap: T => P) => React.Component<T&P>
// Assumes a propMap, merges
export const withTheme = compose(contramap, concatAndMergeProps);
// const withTheme = propMap => contramap(concatAndMergeProps(propMap));
// const withTheme = propMap => props => contramap(concatAndMergeProps(propMap))(props);

// mapTheme<T, P> = (Component: React.Component<P>, mapFn: T => P) => React.Component<T>
// Assumes a propMap, does not merge
export const mapTheme = compose(contramap, concatProps);
// const mapTheme = propMap => contramap(concatProps(propMap));
// const mapTheme = propMap => props => contramap(concatProps(propMap))(props);

// NOTE:
// If you require a custom map function, just use contramap(mapFn)(Component)
