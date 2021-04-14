import { Button, ContentSection, Title } from "../UtilComponents";
import { P, TitleH2 } from "../UtilComponents/Typography/Typography";
import { CloseBox } from "../UtilComponents/CloseBox/CloseBox";
import { toLocalTime } from "../util";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled from "styled-components";
import { observer } from "mobx-react";
import { Flex, Text, Image } from "rebass";

import React, { useState } from "react";

const CardBox = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  transition: 0.2s;
  :hover {
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);
  }
`;

const DialogContent = styled(Flex)`
  flex-direction: column;
`;

export const ModuleCard = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  // 
  const fullScreen = useMediaQuery("(max-width: 40em)");
  const { appStore, CheckoutForm, settings } = props;
  const {
    name: moduleName,
    description: moduleDescription,
    module_sessions: moduleSessions,
  } = props.moduleData;
  return (
    <>
      <CardBox sx={{ borderRadius: 15 }} p={20} mb={20}>
        <Image
          sx={{ "@media screen and (max-width: 500px)": { display: "none" } }}
          src={`${settings.assets}/upcoming-sessions/computer-city-nighttime.png`}
          alt={moduleName}
          mr={2}
          width="50%"
        />

        <TitleH2 fontWeight="bold" color="primary" textAlign="center">
          {moduleName}
        </TitleH2>

        <P>{moduleDescription}</P>
        <P>Choose a start time:</P>
        {moduleSessions.map((ms, index) => {
          const sessionDtLocalTime = toLocalTime(ms._session_datetime);
          return (
            <Button
              key={index}
              m={1}
              alignSelf="center"
              maxWidth="500px"
              onClick={() => {
                setDialogOpen(true);
                setSelectedSession(sessionDtLocalTime);
              }}
            >
              {sessionDtLocalTime}
            </Button>
          );
        })}
      </CardBox>

      <Dialog
        open={dialogOpen}
        onBackdropClick={() => setDialogOpen(false)}
        fullScreen={fullScreen}
      >
        <DialogContent flexDirection="column" p={20}>
          <CloseBox
            size="30"
            alignSelf="flex-end"
            onClick={() => setDialogOpen(false)}
          />
          <Title>{moduleName}</Title>

          <ContentSection>
            <P>
              This class begins on <b>{selectedSession}</b>.
            </P>
            {appStore.authData == null && (
              <>
                <P>Already registered as a student? Sign in!</P>
                <P>
                  Otherwise, register for this class as a guest. You can create
                  a student profile later.
                </P>
              </>
            )}
          </ContentSection>
          <CheckoutForm
            // sessionData={sessionData}
            onCloseClick={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};