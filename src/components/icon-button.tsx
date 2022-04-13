import React, { FC } from "react";
import styled from "styled-components";
import Icon, { IconProps } from "./icon";
import Button from "./button";

const StyledIconButton = styled(Button)`
  padding: 0;
`;

interface Props
  extends Partial<IconProps>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  background?: string;
  size?: string;
}

const IconButton: FC<Props> = ({
  onClick,
  title,
  disabled,
  size = "40px",
  iconSize = "25px",
  icon = "add",
  color = "white",
  background = "yellow",
}) => (
  <StyledIconButton
    onClick={onClick}
    title={title}
    disabled={disabled}
    background={background}
    style={{
      width: size,
      height: size,
    }}
  >
    <Icon icon={icon} iconSize={iconSize} color={disabled ? "white" : color} />
  </StyledIconButton>
);
export default IconButton;
