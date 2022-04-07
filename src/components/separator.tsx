import styled from "styled-components";

const Separator = styled.div<{ height?: string }>`
  position: relative;
  left: -1rem;
  width: calc(100% + 2rem);
  
  border-bottom: 6px solid ${({ theme }) => theme.light};
`;

export default Separator;
