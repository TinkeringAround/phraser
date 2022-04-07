import React, { Fragment } from 'react';

interface Props<T> {
  values: T[];
  projector: (value: T, index: number) => any;
}

const For = <T,>({ values, projector }: Props<T>) => <Fragment>{values.map(projector)}</Fragment>;

export default For;
