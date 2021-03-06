import styled from "styled-components";
import { whenSmallScreen, darkGray, lightGray } from "../sharedStyles";
import { Box, boxy } from "../Box";
import { P } from "../Typography/Typography";

export const Card = styled.div`
  ${boxy}
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  background-color: ${lightGray};
`;

export const CardTitle = styled(P)`
  text-transform: uppercase;
  font-weight: 800;
  color: ${darkGray};
`;

export const CardContent = styled.div`
  ${boxy}
  width: 300px;
  ${whenSmallScreen`
  width: 100%;
`}
  align-self: center;
  display: flex;
  flex-direction: column;
`;
