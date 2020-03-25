import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { EthRoundLogo } from './EthRoundLogo';
import { ProgressStep } from '../../store/actions';
import { routesEnum } from '../../Routes';
import { rainbowColors } from '../../styles/styledComponentsTheme';

export const logoPositions = {
  small: [-7, 16, 38, 59, 80.5, 98],
  medium: [-5, 14.5, 36.5, 57.5, 79.5, 97.5],
  large: [-2, 16.5, 37.5, 57.5, 78, 96],
};

const Container = styled.div`
  background-color: white;
  height: 200px;
  display: flex;
`;
const SubContainer = styled.div`
  box-sizing: border-box;
  max-width: ${p => p.theme.screenSizes.largest};
  width: 100%;
  margin: 80px auto 0;
  padding: 0 120px;

  @media only screen and (max-width: ${p => p.theme.screenSizes.largest}) {
    max-width: 1024px;
    padding: 0px 60px;
  }
  @media only screen and (max-width: 1024px) {
    max-width: 768px;
  }
`;
const BarContainer = styled.div`
  position: relative;
  margin: auto;
  height: 50px;

  width: 85%;
  @media only screen and (max-width: ${p => p.theme.screenSizes.largest}) {
  }
  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
`;
const CompletedColor = styled.div`
  width: ${(p: { position: number }) => logoPositions.large[p.position] + 1}%;
  background: ${(p: { position: number }) => rainbowColors[p.position]};
  border-radius: 8px;
  height: 10px;
  position: absolute;
  z-index: 1;

  @media only screen and (max-width: ${p => p.theme.screenSizes.largest}) {
    width: ${(p: { position: number }) =>
      logoPositions.medium[p.position] + 1}%;
  }
  @media only screen and (max-width: 1024px) {
    width: ${(p: { position: number }) => logoPositions.small[p.position] + 1}%;
  }
`;
const GreyedColor = styled.div`
  width: 100%;
  background: ${p => p.theme.gray.medium};
  border-radius: 8px;
  height: 4px;
  position: absolute;
  top: 3px;
`;

const Flexbox = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Step = styled.div`
  margin: 0 20px;
  text-align: center;
  color: ${(p: {
    disabled: boolean;
    active: boolean;
    index: number;
    theme: any;
  }) => {
    if (p.disabled) return p.theme.gray.medium;
    return rainbowColors[p.index];
  }};
  font-weight: ${p => (p.active ? 600 : undefined)};
`;

const mapPathnameToProgressStep = (pathname: routesEnum) => {
  const routesInOrder = [
    routesEnum.acknowledgementPage,
    routesEnum.validatorSettingsPage,
    routesEnum.generateKeysPage,
    routesEnum.uploadValidatorPage,
    routesEnum.connectWalletPage,
    routesEnum.summaryPage,
  ];
  return routesInOrder.indexOf(pathname);
};

const _WorkflowProgressBar = ({ history }: { history?: any }) => {
  const mappedProgress = mapPathnameToProgressStep(history.location.pathname);
  interface step {
    step: ProgressStep;
    text: string;
  }
  const steps: step[] = [
    { step: ProgressStep.OVERVIEW, text: 'Overview' },
    { step: ProgressStep.VALIDATOR_SETTINGS, text: 'Validator Settings' },
    { step: ProgressStep.GENERATE_KEY_PAIRS, text: 'Generate Keys' },
    { step: ProgressStep.UPLOAD_VALIDATOR_FILE, text: 'Upload Validator' },
    { step: ProgressStep.CONNECT_WALLET, text: 'Connect Wallet' },
    { step: ProgressStep.SUMMARY, text: 'Summary' },
  ];
  return (
    <Container>
      <SubContainer>
        <BarContainer>
          <GreyedColor />
          <CompletedColor position={mappedProgress} />
          <EthRoundLogo position={mappedProgress} />
        </BarContainer>
        <Flexbox>
          {steps.map(({ step, text }, i) => (
            <Step
              key={text}
              index={i}
              disabled={mappedProgress < step}
              active={mappedProgress === step}
            >
              {text}
            </Step>
          ))}
        </Flexbox>
      </SubContainer>
    </Container>
  );
};

export const WorkflowProgressBar = withRouter(_WorkflowProgressBar);
