/*
  eslint-disable camelcase
*/

import { Action, ActionTypes } from '../actions';
import { TransactionStatus } from '../actions/depositFileActions';

export enum DepositStatus {
  VERIFYING,
  ALREADY_DEPOSITED,
  READY_FOR_DEPOSIT,
}

export interface DepositKeyInterface {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
  deposit_cli_version: string;
  transactionStatus: TransactionStatus;
  txHash?: string;
  depositStatus: DepositStatus;
}

export interface DepositFileInterface {
  name: string;
  keys: DepositKeyInterface[];
}

const initialState: DepositFileInterface = {
  name: '',
  keys: [],
};

export const depositFileReducer = (
  state: DepositFileInterface = initialState,
  action: Action
) => {
  if (action.type === ActionTypes.updateDepositFileName) {
    return {
      ...state,
      name: action.payload,
    };
  }

  if (action.type === ActionTypes.updateDepositFileKeys) {
    return {
      ...state,
      keys: action.payload,
    };
  }

  if (action.type === ActionTypes.updateTransactionStatus) {
    const { keys } = state;
    const clonedKeys = [...keys];
    const indexOfFileToUpdate = keys.findIndex(
      ({ pubkey }) => pubkey === action.payload.pubkey
    );
    clonedKeys[indexOfFileToUpdate].transactionStatus = action.payload.status;

    if (action.payload.txHash) {
      clonedKeys[indexOfFileToUpdate].txHash = action.payload.txHash;
    }

    return { ...state, keys: clonedKeys };
  }

  if (action.type === ActionTypes.updateDepositStatus) {
    const { keys } = state;
    const clonedKeys = [...keys];
    const indexOfFileToUpdate = keys.findIndex(
      ({ pubkey }) => pubkey === action.payload.pubkey
    );
    clonedKeys[indexOfFileToUpdate].depositStatus =
      action.payload.depositStatus;

    return { ...state, keys: clonedKeys };
  }
  return state;
};
