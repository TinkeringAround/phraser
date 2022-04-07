import styled from "styled-components";

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) min-content;
  
  height: 100%;
  width: 100%;

  background: ${({ theme: { light } }) => light};
`;

export default Layout;
