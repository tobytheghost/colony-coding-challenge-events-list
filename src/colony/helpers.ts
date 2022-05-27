import { utils } from "ethers"
import { BigNumberish } from "ethers/utils"

export const wei = new utils.BigNumber(10)

export const convertBigNumber = (bigNumber: BigNumberish) => {
  return new utils.BigNumber(bigNumber)
}