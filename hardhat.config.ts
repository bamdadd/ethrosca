import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import '@nomiclabs/hardhat-waffle';
import 'hardhat-gas-reporter';

const config: HardhatUserConfig = {
  solidity: "0.8.19",
};

export default config;
