import React, { useMemo, useState } from 'react';
import { CheckBox } from 'grommet';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SendOptions } from 'web3-eth-contract';
import { ByteVectorType, ContainerType, NumberUintType } from '@chainsafe/ssz';
import { useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { Alert as AlertIcon } from 'grommet-icons';
import styled from 'styled-components';
import { contractAbi } from '../../../contractAbi';
import { CONTRACT_ADDRESS } from '../../../utils/envVars';
import { BeaconChainValidator, TransactionStatus } from '../types';
import { bufferHex } from '../../../utils/SSZ';
import { buf2hex } from '../../../utils/buf2hex';
import { Text } from '../../../components/Text';
import { Button } from '../../../components/Button';
import { Paper } from '../../../components/Paper';
import { Heading } from '../../../components/Heading';
import { NumberInput } from '../../GenerateKeys/NumberInput';
import shortenAddress from '../../../utils/shortenAddress';
import { Alert } from '../../../components/Alert';
import TopUpTransactionModal from './TopUpTransactionModal';
import {
  fortmaticTxRejected,
  isLedgerTimeoutError,
  ledgerTxRejected,
  metamaskTxRejected,
} from '../../../utils/transactionErrorTypes';

interface Props {
  validator: BeaconChainValidator;
}

const depositDataContainer = new ContainerType({
  fields: {
    pubkey: new ByteVectorType({
      length: 48,
    }),
    withdrawalCredentials: new ByteVectorType({
      length: 32,
    }),
    amount: new NumberUintType({
      byteLength: 8,
    }),
    signature: new ByteVectorType({
      length: 96,
    }),
  },
});

const InputContainer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled(Button)`
  height: 50px;
`;

const TopUpDetailsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
  border: 1px solid lightblue;
  background: #eaf6f9;
  border-radius: 5px;
  padding: 10px 20px;
  flex-wrap: wrap;
  @media screen and (max-width: 724px) {
    flex-direction: column;
    .details-item {
      display: flex;
      justify-content: space-between;
    }
  }
`;

const TopupPage: React.FC<Props> = ({ validator }) => {
  const { connector, account } = useWeb3React();
  const [value, setValue] = React.useState(0);
  const [showTxModal, setShowTxModal] = React.useState(false);
  const [txHash, setTxHash] = React.useState('');

  const balance = useMemo(() => Number(validator.balance) / 10 ** 9, [
    validator,
  ]);

  const newBalance = useMemo(() => +balance + Number(value), [balance, value]);

  const maxTopUpVal = useMemo(() => 32 - Number(balance), [balance]);

  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    'not_started'
  );

  const topUp = async () => {
    console.log('topping up for portis user');
    setTransactionStatus('waiting_user_confirmation');
    setShowTxModal(true);
    const walletProvider: any = await (connector as AbstractConnector).getProvider();
    const web3: any = new Web3(walletProvider);
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    const bnInput = new BigNumber(value);
    const transactionAmount = bnInput.multipliedBy(1e18).toNumber();
    const reconstructedRootAmount = bnInput.multipliedBy(1e9).toNumber();

    const transactionParameters: SendOptions = {
      gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
      from: account as string,
      value: transactionAmount,
    };

    const reconstructedKeyFile = {
      pubkey: bufferHex(validator.pubkey.substring(2)),
      withdrawalCredentials: Buffer.alloc(32),
      amount: reconstructedRootAmount,
      signature: Buffer.alloc(96),
    };

    const byteRoot = depositDataContainer.hashTreeRoot(reconstructedKeyFile);
    const reconstructedDepositDataRoot = `0x${buf2hex(byteRoot)}`;

    console.log('got all the shit we need: ');
    contract.methods
      .deposit(
        reconstructedKeyFile.pubkey,
        reconstructedKeyFile.withdrawalCredentials,
        reconstructedKeyFile.signature,
        reconstructedDepositDataRoot
      )
      .send(transactionParameters)
      .on('transactionHash', (hash: string): void => {
        setTransactionStatus('confirm_on_chain');
        setTxHash(hash);
      })
      .on(
        'confirmation',
        (confirmation: number, receipt: { status: {} }): any => {
          console.log('confirmed');
          if (confirmation === 0) {
            if (receipt.status) {
              setTransactionStatus('success');
            } else {
              setTransactionStatus('error');
            }
          }
        }
      )
      .on('error', (error: any) => {
        if (isLedgerTimeoutError(error)) {
          setShowTxModal(false);
        } else if (
          metamaskTxRejected(error) ||
          ledgerTxRejected(error) ||
          fortmaticTxRejected(error)
        ) {
          setTransactionStatus('user_rejected');
        } else {
          setTransactionStatus('error');
        }
      });
  };

  const [termA, setTermA] = useState(false);

  const showAlert = React.useMemo(() => {
    return newBalance > 32 || balance > 32;
  }, []);

  return (
    <div>
      {showTxModal && (
        <TopUpTransactionModal
          txHash={txHash}
          transactionStatus={transactionStatus}
          onClose={() => setShowTxModal(false)}
        />
      )}

      <Paper className="mt20">
        <Heading level={3} color="blueDark">
          Risks & Acknowledgements:
        </Heading>
        <div className="mt20">
          <CheckBox
            checked={termA}
            onChange={() => setTermA(!termA)}
            label={
              <Text className="checkbox-label ml10">
                I am certain that the validator I am topping up is my validator.
              </Text>
            }
          />
        </div>
      </Paper>
      <Paper className="mt30">
        <Heading level={3} color="blueDark">
          Top Up Details
        </Heading>
        <TopUpDetailsContainer>
          <div className="details-item">
            <Text weight={600} color="blueDark">
              Public Key
            </Text>
            <Text>{shortenAddress(validator.pubkey, 6)}</Text>
          </div>
          <div className="details-item">
            <Text weight={600} color="blueDark">
              Current Balance
            </Text>
            <Text>{balance} ETH</Text>
          </div>
          <div className="details-item">
            <Text weight={600} color="blueDark">
              Balance after topping up
            </Text>
            <Text>{newBalance} ETH</Text>
          </div>
        </TopUpDetailsContainer>

        <div style={{ visibility: showAlert ? 'visible' : 'hidden' }}>
          <Alert variant="warning" className="my10">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AlertIcon color="redLight" />
              <Text className="ml10">
                {balance > 32
                  ? 'Validator balance is already higher than the maximum amount.'
                  : `Submitting a topup for more than ${maxTopUpVal} will result in a balance higher than the maximum balance of 32.`}
              </Text>
            </div>
          </Alert>
        </div>

        <InputContainer>
          <NumberInput value={value} setValue={setValue} allowDecimals />
          <SubmitButton
            className="ml10"
            label="Submit"
            rainbow
            onClick={topUp}
            disabled={value <= 0 || !termA}
          />
        </InputContainer>
      </Paper>
    </div>
  );
};

export default TopupPage;
