import styled from "styled-components";

const StyledFeature = styled.article`
  position: relative;

  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: min-content min-content minmax(0, 1fr);
  row-gap: 1rem;

  font-family: "Roboto", sans-serif;

  header {
    display: flex;
    align-items: center;
    flex-direction: row;
    
    min-height: 40px;
  }

  main {
    display: flex;

    overflow: auto;
  }
`;

export default StyledFeature;
