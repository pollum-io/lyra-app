import { useContractWrite, useContractRead, usePrepareContractWrite } from 'wagmi';
import { BigNumberish, MaxUint256 } from 'ethers';
import { abi as ERC20ABI } from '../contracts/ERC20ABI';
import { DREX, TSELIC29, rBRLLPool } from '../constant/contracts'


export type EthereumAddress = `0x${string}`;
type ERC20FunctionName = 'approve' | 'balanceOf' | 'totalSupply' | 'transfer' | 'transferFrom' | 'allowance' | 'name' | 'symbol' | 'decimals';
type ERC20WriteArgs = [string, BigNumberish] | [string] | [string, string, BigNumberish];
type ERC20ReadArgs = [string] | string[]
interface ContractWriteHookReturn {
  write: () => void;
  data: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface ContractReadHookReturn<T = any> {
  data: T;
  isError: boolean;
  isLoading: boolean;
}


function createERC20Hooks(address: `0x${string}`) {
  // Hook to perform write operations on an ERC20 contract
  function useERC20Write(functionName: ERC20FunctionName, args?: ERC20WriteArgs): ContractWriteHookReturn {
    const { config } = usePrepareContractWrite({
      address,
      abi: ERC20ABI,
      functionName,
      args,
    });

    const { write, data, isLoading, isSuccess, isError } = useContractWrite(config);
    const safeWrite = write ?? (() => { });

    return { write: safeWrite, data, isLoading, isSuccess, isError };
  }

  // Hook to perform read operations on an ERC20 contract
  function useERC20Read<T = any>(functionName: ERC20FunctionName, args?: ERC20ReadArgs): ContractReadHookReturn<T> {
    const { data, isError, isLoading } = useContractRead({
      address,
      abi: ERC20ABI,
      functionName,
      args,
      watch: true
    });

    return { data: data as T, isError, isLoading };
  }

  // Function to approve spending of tokens
  function useApprove(): ContractWriteHookReturn {
    return useERC20Write('approve', [rBRLLPool, MaxUint256]);
  }

  // Function to get the approved token balance of a given address
  function useAllowance(owner: EthereumAddress): ContractReadHookReturn<BigNumberish> {
    const agrs = [owner, rBRLLPool]
    return useERC20Read('allowance', agrs);
  }

  // Function to get the token balance of a given address
  function useBalanceOf(owner: EthereumAddress): ContractReadHookReturn<BigNumberish> {
    return useERC20Read('balanceOf', [owner]);
  }

  return { useERC20Write, useERC20Read, useApprove, useAllowance, useBalanceOf };
}

export const {
  useERC20Write: useDREXWrite,
  useERC20Read: useDREXRead,
  useApprove: useApproveDREX,
  useAllowance: useAllowanceDREX,
  useBalanceOf: useBalanceOfDREX
} = createERC20Hooks(DREX);

export const {
  useERC20Write: useTSELICWrite,
  useERC20Read: useTSELICRead,
  useApprove: useApproveTSELIC,
  useAllowance: useAllowanceTSELIC,
  useBalanceOf: useBalanceOfTSELIC
} = createERC20Hooks(TSELIC29);
