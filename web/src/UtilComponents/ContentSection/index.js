import styled from 'styled-components';
import { font } from '../sharedStyles';
import { space, flex } from "styled-system";


const ContentSection = styled.article`
  display: flex;
  flex-direction: column;
  ${font}
  ${space}
`;


export { ContentSection };