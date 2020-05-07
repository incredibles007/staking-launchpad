import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { connect } from 'react-redux';
import { AbstractConnector } from '@web3-react/abstract-connector';
import _every from 'lodash/every';
import { DepositKeyInterface, StoreState } from '../../store/reducers';
import { Heading } from '../../components/Heading';
import { Paper } from '../../components/Paper';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { KeyList } from './Keylist';
import { handleTransaction } from './transactionUtils';
import { NetworkChainId } from '../ConnectWallet/web3Utils';
import { web3ReactInterface } from '../ConnectWallet';
import { WalletDisconnected } from '../ConnectWallet/WalletDisconnected';
import { WrongNetwork } from '../ConnectWallet/WrongNetwork';
import { WorkflowPageTemplate } from '../../components/WorkflowPage/WorkflowPageTemplate';
import { routeToCorrectWorkflowStep } from '../../utils/RouteToCorrectWorkflowStep';
import {
  DispatchTransactionStatusUpdateType,
  TransactionStatus,
  updateTransactionStatus,
} from '../../store/actions/depositFileActions';
import {
  DispatchWorkflowUpdateType,
  updateWorkflow,
  WorkflowStep,
} from '../../store/actions/workflowActions';
import { IS_MAINNET } from '../../utils/envVars';

const NETWORK_ID = IS_MAINNET
  ? NetworkChainId.Mainnet
  : NetworkChainId['Göerli'];

// Prop definitions
interface OwnProps {}
interface StateProps {
  depositKeys: DepositKeyInterface[];
  workflow: WorkflowStep;
}
interface DispatchProps {
  dispatchTransactionStatusUpdate: DispatchTransactionStatusUpdateType;
  dispatchWorkflowUpdate: DispatchWorkflowUpdateType;
}
type Props = StateProps & DispatchProps & OwnProps;

const _TransactionsPage = ({
  depositKeys,
  workflow,
  dispatchTransactionStatusUpdate,
  dispatchWorkflowUpdate,
}: Props): JSX.Element => {
  const { account, chainId, connector }: web3ReactInterface = useWeb3React<
    Web3Provider
  >();

  const [routeToCongratulationsPage, setRouteToCongratulationsPage] = useState(
    false
  );
  const totalTxCount = depositKeys.length;
  const remainingTxCount = depositKeys.filter(
    file => file.transactionStatus === TransactionStatus.READY
  ).length;
  const allTxConfirmed = _every(
    depositKeys.map(
      file => file.transactionStatus === TransactionStatus.SUCCEEDED
    )
  );

  const createButtonText = (): string => {
    if (totalTxCount === remainingTxCount)
      return `Initiate all ${totalTxCount} transactions`;
    if (remainingTxCount > 1)
      return `Initiate remaining ${remainingTxCount} transactions`;
    if (remainingTxCount === 1) return `Initiate last transaction`;
    return 'No pending transactions';
  };

  const handleAllTransactionsClick = () =>
    depositKeys.forEach(async validator => {
      if (validator.transactionStatus === TransactionStatus.READY) {
        await handleTransaction(
          validator,
          connector as AbstractConnector,
          account,
          dispatchTransactionStatusUpdate
        );
      }
    });

  if (workflow < WorkflowStep.TRANSACTION_SIGNING)
    return routeToCorrectWorkflowStep(workflow);

  if (!account || !connector) return <WalletDisconnected />;

  if (chainId !== NETWORK_ID) return <WrongNetwork />;

  if (allTxConfirmed) {
    setTimeout(() => {
      dispatchWorkflowUpdate(WorkflowStep.CONGRATULATIONS);
      setRouteToCongratulationsPage(true);
    }, 3000);
  }
  if (routeToCongratulationsPage)
    return routeToCorrectWorkflowStep(WorkflowStep.CONGRATULATIONS);

  return (
    <WorkflowPageTemplate title="Transactions">
      <Paper className="mt20">
        <Heading level={3} size="small" color="blueMedium">
          Transactions for {depositKeys.length} validators
        </Heading>
        <Text className="mt20">
          You must sign an individual transaction for each key you created.
        </Text>
        <Text className="mt10">
          You can initiate these all at once, or sign them individually from the
          keylist below
        </Text>
        <div className="flex center mt30">
          <Button
            width={300}
            rainbow
            label={createButtonText()}
            onClick={handleAllTransactionsClick}
            disabled={remainingTxCount === 0}
          />
        </div>
      </Paper>
      <KeyList />
    </WorkflowPageTemplate>
  );
};

const mapStateToProps = ({
  depositFile,
  workflow,
}: StoreState): StateProps => ({
  depositKeys: depositFile.keys,
  workflow,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  dispatchWorkflowUpdate: step => dispatch(updateWorkflow(step)),
  dispatchTransactionStatusUpdate: (pubkey, status, txHash) =>
    dispatch(updateTransactionStatus(pubkey, status, txHash)),
});

export const TransactionsPage = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  mapStateToProps,
  mapDispatchToProps
)(_TransactionsPage);