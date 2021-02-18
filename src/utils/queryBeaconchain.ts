import axios from 'axios';
import { BEACONCHAIN_ENDPOINT } from '../utils/envVars';

type InfuraResponse = {
  data: {
    status: string;
    data: {
      validatorscount: number;
      totalvalidatorbalance: number;
    };
  };
};

export const queryBeaconchain = async () => {
  try {
    const response: InfuraResponse = await axios.get(BEACONCHAIN_ENDPOINT);
    return {
      statusCode: 200,
      body: {
        totalValidators: response.data.data.validatorscount,
        amountEth: response.data.data.totalvalidatorbalance,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: { totalValidators: 0, msg: error.message },
    };
  }
};
