import {contramap, toggle, named, concatProps, concatAndMergeProps} from '../src';

const FakeComponent = ({fontWeight, color, children}) => ({
  fontWeight,
  color,
  children
});

describe('contramap()', () => {
  it('should transform props and not merge rest by default', () => {
    const FakeHigherStrict = contramap(({bold, ...rest}) => ({
      fontWeight: bold ? '7' : '4',
      color: bold ? 'black' : 'red'
    }))(FakeComponent);

    expect(
      FakeHigherStrict({bold: true, children: 'hello', color: 'teal'})
    ).toMatchObject({
      fontWeight: '7',
      color: 'black'
    });
  });

  it('can be toggled to merge other props in', () => {
    const FakeHigher = contramap(({bold, ...rest}) => ({
      ...rest,
      fontWeight: bold ? '7' : '4',
      color: bold ? 'black' : 'red'
    }))(FakeComponent);

    expect(
      FakeHigher({bold: true, children: 'hello', color: 'teal'})
    ).toMatchObject({
      fontWeight: '7',
      color: 'black',
      children: 'hello'
    });
  });
});

// console.log('Should have only the transformed props.');
describe('concatProps()', () => {
  it('should concatenate props with a specification', () => {
    const transformedProps = concatProps({
      bold: toggle({fontWeight: '7', color: 'black'})
    })({
      bold: true
    });

    expect(transformedProps).toMatchObject({
      fontWeight: '7',
      color: 'black'
    });
  });

  it('should work with any spec-abiding map', () => {
    const transformedProps = concatAndMergeProps({
      bold: toggle({fontWeight: '7', color: 'black'}),
      textKind: named({
        title: {lineHeight: 'solid'},
        copy: {lineHeight: 'copy', measure: 'normal'}
      })
    })({
      bold: true,
      textKind: 'copy',
      children: 'hello'
    });

    expect(transformedProps).toMatchObject({
      fontWeight: '7',
      color: 'black',
      lineHeight: 'copy',
      measure: 'normal',
    });
  });

  it('should ignore other props', () => {
    const transformedProps = concatProps({
      bold: toggle({fontWeight: '7', color: 'black'})
    })({
      bold: true,
      children: 'hello',
      color: 'red',
      NOTHERE: 'I am an ostritch'
    });

    expect(transformedProps).toMatchObject({
      fontWeight: '7',
      color: 'black'
    });
  });
});

// it('can be invoked uncurried', () => {
// contramap(props =>
// });
//
describe('concatAndMergeProps()', () => {
  it('should concatenate props with a specification', () => {
    const transformedProps = concatAndMergeProps({
      bold: toggle({fontWeight: '7', color: 'black'})
    })({
      bold: true
    });

    expect(transformedProps).toMatchObject({
      fontWeight: '7',
      color: 'black'
    });
  });

  it('should work with any spec-abiding map', () => {
    const transformedProps = concatAndMergeProps({
      bold: toggle({fontWeight: '7', color: 'black'}),
      textKind: named({
        title: {lineHeight: 'solid'},
        copy: {lineHeight: 'copy', measure: 'normal'}
      })
    })({
      bold: true,
      textKind: 'copy',
      children: 'hello'
    });

    expect(transformedProps).toMatchObject({
      fontWeight: '7',
      color: 'black',
      lineHeight: 'copy',
      measure: 'normal',
      children: 'hello'
    });
  });

  it('should merge other props not in the specification', () => {
    const transformedProps = concatAndMergeProps({
      bold: toggle({fontWeight: '7', color: 'black'})
    })({
      bold: true,
      children: 'hello'
    });

    expect(transformedProps).toMatchObject({
      fontWeight: '7',
      color: 'black',
      children: 'hello'
    });
  });

  it('should prioritise specificed props when merging', () => {
    const transformedProps = concatAndMergeProps({
      bold: toggle({fontWeight: '7', color: 'black'})
    })({
      color: 'red',
      bold: true,
      color: 'teal',
      children: 'hello'
    });

    expect(transformedProps).toMatchObject({
      fontWeight: '7',
      color: 'black',
      children: 'hello'
    });
  });
});

// WithTheme
// console.log(
// 'Should be equivalent to calling contramap(concatAndMergeProps(mapObj)) directly'
// );
// withTheme({
// bold: toggle({fontWeight: '5', color: 'red'}),
// textKind: named({
// title: {lineHeight: 'solid'},
// copy: {lineHeight: 'copy', measure: 'normal'}
// })
// })(console.log)({
// bold: true,
// textKind: 'copy',
// children: '<H1>Hello, World</H1>'
// });

// MapTheme
// console.log(
// 'Should be equivalent to calling contramap(concatProps(mapObj)) directly'
// );
// mapTheme({
// bold: toggle({fontWeight: '5', color: 'red'}),
// textKind: named({
// title: {lineHeight: 'solid'},
// copy: {lineHeight: 'copy', measure: 'normal'}
// })
// })(console.log)({
// bold: true,
// textKind: 'copy',
// children: '<H1>Hello, World</H1>'
// });

// Equivalence/composition checks
