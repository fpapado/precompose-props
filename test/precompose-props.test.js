// Tests preliminaries
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
