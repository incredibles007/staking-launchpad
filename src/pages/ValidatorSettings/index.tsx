import React from "react";
import { Box, Heading, Text } from "grommet";
import styled from "styled-components";
import { WorkflowPageTemplate } from "../../components/WorkflowPage/WorkflowPageTemplate";
import { Paper } from "../../components/Paper";
import { NumberInput } from "./NumberInput";
import { CircleAlert } from "./CircleAlert";
import { StoreState } from "../../store/reducers";
import {
  ProgressStep,
  updateProgress,
  updateValidatorCount
} from "../../store/actions";
import { connect } from "react-redux";
import { InfoBox } from "../../components/InfoBox";
import { routeToCorrectProgressStep } from "../../utils/RouteToCorrectProgressStep";
import { Button } from "../../components/Button";
import { rainbowMutedColors } from "../../styles/styledComponentsTheme";
import { pricePerValidator } from "../../enums";

const warnings: string[] = [
  `Please make sure you send exactly ${pricePerValidator} ETH per validator, excluding fees.`,
  `Transactions with less than ${pricePerValidator} ETH will need to be topped up to run a validator.`,
  "You will sign a separate transaction for each validator."
];

const Container = styled.div`
  width: 100%;
  padding: 0 10px;
`;

interface Props {
  updateValidatorCount(count: number): void;
  validatorCount: number;
  updateProgress: () => void;
  progress: ProgressStep;
}

const _ValidatorSettingsPage = ({
  validatorCount,
  updateValidatorCount,
  updateProgress,
  progress
}: Props): JSX.Element => {
  const handleSubmit = () => {
    if (validatorCount > 0) {
      updateProgress();
    }
  };

  if (progress !== ProgressStep.VALIDATOR_SETTINGS) {
    return routeToCorrectProgressStep(progress);
  }

  return (
    <WorkflowPageTemplate
      title="Validator Settings"
      backgroundColor={rainbowMutedColors[1]}
    >
      <Paper>
        <Heading level={3} size="small" color="blueDark">
          How many validators would you like to run?
        </Heading>
        <div className="flex">
          <Container>
            <Text weight="bold">Validators</Text>
            <NumberInput
              value={validatorCount}
              setValue={updateValidatorCount}
            />
          </Container>
          <Container>
            <Text weight="bold">Cost</Text>
            <InfoBox>
              <Text>{validatorCount * pricePerValidator} ETH</Text>
            </InfoBox>
          </Container>
        </div>
      </Paper>
      <Paper error className="mt20">
        {warnings.map(warning => (
          <div className="flex my10" key={warning}>
            <CircleAlert />
            <Text size="medium" className="ml10" weight="bold">
              {warning}
            </Text>
          </div>
        ))}
      </Paper>
      <Box align="center" pad="large">
        <Button
          width={300}
          rainbow
          disabled={validatorCount <= 0}
          label={`GENERATE MY KEYPAIR${validatorCount > 1 ? "S" : ""}`}
          onClick={handleSubmit}
        />
      </Box>
    </WorkflowPageTemplate>
  );
};

const mstp = ({ validatorCount, progress }: StoreState) => ({
  validatorCount,
  progress
});
const mdtp = (dispatch: any) => ({
  updateValidatorCount: (count: number): void => {
    dispatch(updateValidatorCount(count));
  },
  updateProgress: (): void => {
    dispatch(updateProgress(ProgressStep.GENERATE_KEY_PAIRS));
  }
});

export const ValidatorSettingsPage = connect(
  mstp,
  mdtp
)(_ValidatorSettingsPage);
