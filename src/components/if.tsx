import React, { FC, Fragment } from "react";

interface Props {
  condition: boolean;
}

const If: FC<Props> = ({ condition, children }) => (
  <Fragment>{condition && children}</Fragment>
);

export default If;
