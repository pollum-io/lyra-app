import { useContractWrite, useContractRead, usePrepareContractWrite } from 'wagmi';
import { BigNumberish } from 'ethers';
import { abi as rBRLLABI } from '../contracts/rBRLLABI';
import { abi as InterestRateModelABI } from '../contracts/InterestRateModelABI';
import { rBRLLPool, InterestRateModel } from '../constant/contracts'

type RBRLLPoolFunctionName = 'supplyDREX' | 'withdrawDREX' | 'withdrawAllDREX' | 'repayDREX' | 'repayAll' | 'flashLiquidateBorrow' | 'supplyTSELIC' | 'withdrawTSELIC' | 'withdrawAllTSELIC' | 'borrowDREX';
type RBRLLPoolWriteArgs = BigNumberish[] | ['MAX'] | [string, BigNumberish, BigNumberish];

interface ContractWriteHookReturn {
  write: () => void;
  data: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface ContractReadHookReturn<T> {
  data: T;
  isError: boolean;
  isLoading: boolean;
}

export function useRBRLLPoolWrite(functionName: RBRLLPoolFunctionName, args?: RBRLLPoolWriteArgs): ContractWriteHookReturn {
  const { config } = usePrepareContractWrite({
    address: rBRLLPool,
    abi: rBRLLABI,
    functionName,
    args
  });

  const { write, data, isLoading, isSuccess, isError } = useContractWrite(config);
  const safeWrite = write ?? (() => { });

  return { write: safeWrite, data, isLoading, isSuccess, isError };
}

export function useRBRLLPoolRead<T = any>(functionName: string, args?: any[]): ContractReadHookReturn<T> {
  const { data, isError, isLoading } = useContractRead({
    address: rBRLLPool,
    abi: rBRLLABI,
    functionName,
    args,
    watch:true
  });

  return { data: data as T, isError, isLoading };
}

// Function to call supplyDREX
export function useSupplyDREX(amount: BigNumberish) {
  const formattedAmount = amount; // Add conversion logic here
  return useRBRLLPoolWrite('supplyDREX', [formattedAmount]);
}

// Function to call withdrawDREX or withdrawAllDREX
export function useWithdrawDREX(amount: BigNumberish | 'MAX') {
  const isMax = amount === 'MAX';
  const functionName = isMax ? 'withdrawAllDREX' : 'withdrawDREX';
  const args = isMax ? [] : [amount]; // Convert to 6 decimal places if not 'MAX'
  return useRBRLLPoolWrite(functionName, args);
}

// Function to call repayDREX  or repayAll
export function useRepayDREX(amount: BigNumberish | 'MAX') {
  const isRepayAll = amount === 'MAX';
  const functionName = isRepayAll ? 'repayAll' : 'repayDREX';
  const args = isRepayAll ? [] : [amount];
  return useRBRLLPoolWrite(functionName, args);
}

// Function to get total supplied
export function useGetTotalSupplied() {
  return useRBRLLPoolRead('totalSupplyrBRLL');
}

// Function to get total borrowed
export function useGetTotalBorrowed() {
  return useRBRLLPoolRead('totalBorrowrBRLL');
}

// Function to get total borrowed
export function useGetTotalDepositedTSELIC() {
  return useRBRLLPoolRead('totalDepositedTSELIC');
}


// Function to call flashLiquidateBorrow
export function useFlashLiquidateBorrow(borrower: string, repayAmount: BigNumberish, tselicInMaximum: BigNumberish) {
  return useRBRLLPoolWrite('flashLiquidateBorrow', [borrower, repayAmount, tselicInMaximum]);
}

// Function to call supplyTSELIC
export function useSupplyTSELIC(amount: BigNumberish) {
  return useRBRLLPoolWrite('supplyTSELIC', [amount]);
}

// Function to call withdrawTSELIC or withdrawAllTSELIC
export function useWithdrawTSELIC(amount: BigNumberish | 'MAX') {
  const isMax = amount === 'MAX';
  const functionName = isMax ? 'withdrawAllTSELIC' : 'withdrawTSELIC';
  const args = isMax ? [] : [amount];
  return useRBRLLPoolWrite(functionName, args);
}

// Function to get borrowed amount
export function useGetBorrowedAmount(userAddress: string) {
  return useRBRLLPoolRead('getBorrowedAmount', [userAddress]);
}

// Function to get deposited TSELIC
export function useGetDepositedTSELIC(userAddress: string) {
  return useRBRLLPoolRead('depositedTSELIC', [userAddress]);
}

// Function to get supplied DREX
export function useGetSuppliedDREX(userAddress: string) {
  return useRBRLLPoolRead('balanceOf', [userAddress]);
}

// Function to call borrowDREX
export function useBorrowDREX(amount: BigNumberish) {
  return useRBRLLPoolWrite('borrowDREX', [amount]);
}

export function hasRole(role: string, userAddress: string) {
  return useRBRLLPoolRead('hasRole', [role, userAddress]);
}
// Function to get the market price of TSELIC via Chainlink
export function useGetUnitValue<T = any>(): ContractReadHookReturn<T> {
  const { data, isError, isLoading } = useContractRead({
    address: InterestRateModel,
    abi: InterestRateModelABI,
    functionName: 'getUnitValue'
  });

  return { data: data as T , isError, isLoading };
}

// Function to get Supply Secondly Rate
export function getSupplyInterestRate(totalSupply: BigNumberish, totalBorrow: BigNumberish) {
  const { data, isError, isLoading } = useContractRead({
    address: InterestRateModel,
    abi: InterestRateModelABI,
    functionName: 'getSupplyInterestRate',
    args: [totalSupply, totalBorrow]
  });

  return { data, isError, isLoading };
}

// Function to get the Interest Rate of TSELIC via Chainlink
export function useGetInterestRate() {
  const { data, isError, isLoading } = useContractRead({
    address: InterestRateModel,
    abi: InterestRateModelABI,
    functionName: 'getInterestRate'
  });

  return { data, isError, isLoading };
}