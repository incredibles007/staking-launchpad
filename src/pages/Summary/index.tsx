import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Box, CheckBox, Heading, Text } from 'grommet';
import { Spinning } from 'grommet-controls';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import Web3 from 'web3';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Eth } from 'web3-eth';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SendOptions } from 'web3-eth-contract';
import { StoreState } from '../../store/reducers';
import { keyFile, ProgressStep, updateProgress } from '../../store/actions';
import { Paper } from '../../components/Paper';
import { web3ReactInterface } from '../ConnectWallet';
import { NetworkChainId } from '../ConnectWallet/web3Utils';
import { WorkflowPageTemplate } from '../../components/WorkflowPage/WorkflowPageTemplate';
import { InfoBox } from '../../components/InfoBox';
import { Keylist } from './Keylist';
import { Link } from '../../components/Link';
import { AcknowledgementSection } from './AcknowledgementSection';
import { routeToCorrectProgressStep } from '../../utils/RouteToCorrectProgressStep';
import { Button } from '../../components/Button';
import { rainbowMutedColors } from '../../styles/styledComponentsTheme';
import { prefix0X } from '../../utils/prefix0x';
import { contractAbi } from '../../contractAbi';
import { pricePerValidator, contractAddress } from '../../enums';

// DEPOSIT CONTRACT VARIABLES(public for transparency)
const CONTRACT_ADDRESS = contractAddress;
const TX_VALUE = pricePerValidator * 1e18; // 3.2 eth for testnet, change to 32 on mainnet
const NETWORK_NAME = 'Göerli Testnet';
const NETWORK_ID = NetworkChainId[NETWORK_NAME];

const SummarySection = styled(Box)`
  width: 30%;
`;

const _SummaryPage = ({
  validatorCount,
  keyFiles,
  progress,
  updateProgress,
}: {
  validatorCount: number;
  keyFiles: keyFile[];
  progress: ProgressStep;
  updateProgress: (step: ProgressStep) => void;
}): JSX.Element => {
  const [losePhrase, setLosePhrase] = useState(false);
  const [earlyAdopt, setEarlyAdopt] = useState(false);
  const [nonReverse, setNonReverse] = useState(false);
  const [noPhish, setNoPhish] = useState(false);
  const [txMining, setTxMining] = useState(false);
  const allChecked = losePhrase && earlyAdopt && nonReverse && noPhish;
  const validatorKeys = keyFiles.map(file => file.pubkey);

  const { account, chainId, connector }: web3ReactInterface = useWeb3React<
    Web3Provider
  >();

  const renderSummarySection = (): JSX.Element => (
    <Paper>
      <Heading level={3} size="small" color="blueDark">
        Deposit Ceremony Summary
      </Heading>
      <Box className="flex flex-row">
        <SummarySection>
          <Text weight="bold">Validators</Text>
          <InfoBox>{validatorCount}</InfoBox>
        </SummarySection>
        <SummarySection className="mx20">
          <Text weight="bold">Amount</Text>
          <InfoBox>{validatorCount * pricePerValidator} ETH</InfoBox>
        </SummarySection>
        <SummarySection>
          <Text weight="bold">Key Pairs Generated</Text>
          <InfoBox>{keyFiles.length}</InfoBox>
        </SummarySection>
      </Box>
    </Paper>
  );

  const renderKeyList = (): JSX.Element => (
    <Paper className="mt20">
      <Heading level={3} size="small" color="blueDark">
        keys
      </Heading>
      <Keylist validatorKeys={validatorKeys} />
    </Paper>
  );

  const renderAcknowledgements = (): JSX.Element => (
    <div>
      <AcknowledgementSection title="Please proceed with caution">
        <CheckBox
          onChange={e => setLosePhrase(e.target.checked)}
          checked={losePhrase}
          label="I understand that if I lose my mnemonic phrase, I won't be able to withdraw my funds"
        />
        <span className="mt20">
          <CheckBox
            onChange={e => setEarlyAdopt(e.target.checked)}
            checked={earlyAdopt}
            label="I am aware of the early adopter and slashing risks"
          />
        </span>
        <span className="mt20">
          <CheckBox
            onChange={e => setNonReverse(e.target.checked)}
            checked={nonReverse}
            label="I am aware that this transaction is not reversible"
          />
        </span>
      </AcknowledgementSection>
      <AcknowledgementSection title="Please make sure you aren't being phished">
        <Text>
          You are responsible for the transaction. Fraudulent websites might
          lure you into sending the {pricePerValidator} ETH to them, instead of
          the official deposit contract. Please check that the address you are
          sending the transaction to is the correct address.
        </Text>
        <Link to="https://www.google.com" external className="mt10" primary>
          Learn here how to do it safely
        </Link>
        <span className="mt20">
          <CheckBox
            onChange={e => setNoPhish(e.target.checked)}
            checked={noPhish}
            label="I know how to check that I am sending my ETH into the correct deposit contract and will do so."
          />
        </span>
      </AcknowledgementSection>
    </div>
  );

  const handleTransaction = async (depositFile: keyFile): Promise<void> => {
    const {
      pubkey,
      signature,
      // eslint-disable-next-line camelcase
      withdrawal_credentials,
      // eslint-disable-next-line camelcase
      signed_deposit_data_root,
    } = depositFile;

    try {
      const walletProvider: any = await (connector as AbstractConnector).getProvider();
      const web3: Eth = new Web3(walletProvider).eth;
      const contract = new web3.Contract(contractAbi, CONTRACT_ADDRESS);

      const transactionParameters: SendOptions = {
        gasPrice: '0x0055e72a000', // TODO: estimate gas price
        from: account as string,
        value: TX_VALUE,
      };

      // Send validator transaction
      contract.methods
        .deposit(
          prefix0X(pubkey),
          prefix0X(withdrawal_credentials),
          prefix0X(signature),
          prefix0X(signed_deposit_data_root)
        )
        .send(transactionParameters)
        // Event for when the user confirms the tx
        .on('transactionHash', (): void => {
          setTxMining(true);
          // TODO(tx UI feature): return txId
        })
        // Event is for when the tx is mined
        .on(
          'confirmation',
          (confirmation: number, receipt: { status: {} }): any => {
            if (confirmation === 0) {
              console.log('receipt: ', receipt);
              if (receipt.status) {
                console.log('receipt status: ', receipt.status);
                // TODO(tx UI feature): return status
                updateProgress(ProgressStep.CONGRATULATIONS);
              } else {
                console.log('error: receipt status not received');
              }
            }
          }
        );
    } catch (rejected) {
      console.log('user rejected transaction: ', rejected);
      // TODO(tx UI): return rejected status
    }
  };

  // Fires off a transaction for each validator in the users deposit key file
  const handleDepositClick = async () => {
    keyFiles.forEach(validator => {
      handleTransaction(validator);
    });
  };

  if (progress !== ProgressStep.SUMMARY) {
    return routeToCorrectProgressStep(progress);
  }

  // Handles the edge case for when the user disconnects the wallet while on this page
  // TODO(Post release UI): consider moving the user back to connect wallet or making the wallet connection reusable for this edgecase
  if (!account || !connector) {
    return (
      <WorkflowPageTemplate title="deposit summary">
        <AcknowledgementSection title="Your wallet has disconnected">
          <Text>
            Your wallet has disconnected. Please connect your wallet and refresh
            the page to begin the deposit process again.
          </Text>
        </AcknowledgementSection>
      </WorkflowPageTemplate>
    );
  }

  // Handles the edge case for when the user changes the network while on this page
  if (chainId !== NETWORK_ID) {
    return (
      <WorkflowPageTemplate title="Summary">
        <AcknowledgementSection title="Your network has changed">
          <Text>
            Your Ethereum network is not correct, Please connect to the{' '}
            {NETWORK_NAME} network and refresh the page to begin the deposit
            process again.
          </Text>
        </AcknowledgementSection>
      </WorkflowPageTemplate>
    );
  }

  if (txMining) {
    return (
      <WorkflowPageTemplate
        title="Summary"
        backgroundColor={rainbowMutedColors[5]}
      >
        <Paper>
          <Box align="center">
            <Text size="large" className="my10">
              Your transactions have started processing
            </Text>
            <Text size="medium" className="my20">
              Please confrim your transaction for each validator key you have
              generated
            </Text>
            <Spinning size="large" />
          </Box>
        </Paper>
      </WorkflowPageTemplate>
    );
  }

  return (
    <WorkflowPageTemplate
      title="Summary"
      backgroundColor={rainbowMutedColors[5]}
    >
      {renderSummarySection()}
      {renderKeyList()}
      {renderAcknowledgements()}
      <div className="flex center p30">
        <Button
          className="mr10"
          width={100}
          label="Back"
          onClick={() => updateProgress(ProgressStep.CONNECT_WALLET)}
        />
        <Button
          width={300}
          rainbow
          disabled={!allChecked}
          label={`Sign ${validatorCount} transaction(s) and deposit ${validatorCount *
            3.2} ETH`}
          onClick={handleDepositClick}
        />
      </div>
    </WorkflowPageTemplate>
  );
};

const mstp = ({ validatorCount, keyFiles, progress }: StoreState) => ({
  validatorCount,
  keyFiles,
  progress,
});

const mdtp = (dispatch: any) => ({
  updateProgress: (step: ProgressStep): void => {
    dispatch(updateProgress(step));
  },
});

export const SummaryPage = connect(mstp, mdtp)(_SummaryPage);
