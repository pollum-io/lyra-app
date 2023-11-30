import { useContractWrite, useContractRead, usePrepareContractWrite } from 'wagmi';
import { BigNumberish } from 'ethers';
import { abi as ERC20ABI } from '../contracts/ERC20ABI'; 
import {DREX, TSELIC29 } from '../constant/contracts'

function createERC20Hooks(address: `0x${string}`) {
    // Hook to perform write operations on an ERC20 contract
    function useERC20Write(functionName: string, args?: any[]) {
      const { config } = usePrepareContractWrite({
        address,
        abi: ERC20ABI,
        functionName,
        args,
      });
  
      const { write, data, isLoading, isSuccess, isError } = useContractWrite(config);
      return { write, data, isLoading, isSuccess, isError };
    }
  
    // Hook to perform read operations on an ERC20 contract
    function useERC20Read(functionName: string, args?: any[]) {
      const { data, isError, isLoading } = useContractRead({
        address,
        abi: ERC20ABI,
        functionName,
        args,
      });
  
      return { data, isError, isLoading };
    }
  
    // Function to approve spending of tokens
    function useApprove(spender: string, amount: BigNumberish) {
      return useERC20Write('approve', [spender, amount]);
    }
  
    // Function to get the token balance of a given address
    function useBalanceOf(owner: string) {
      return useERC20Read('balanceOf', [owner]);
    }
  
    return { useERC20Write, useERC20Read, useApprove, useBalanceOf };
  }
  
  export const { 
    useERC20Write: useDREXWrite, 
    useERC20Read: useDREXRead, 
    useApprove: useApproveDREX, 
    useBalanceOf: useBalanceOfDREX 
  } = createERC20Hooks(DREX);
  
  export const { 
    useERC20Write: useTSELICWrite, 
    useERC20Read: useTSELICRead,
    useApprove: useApproveTSELIC, 
    useBalanceOf: useBalanceOfTSELIC 
  } = createERC20Hooks(TSELIC29);
  