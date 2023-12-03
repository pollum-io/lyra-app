"use client";

import {
  useLendingModalBorrowDrex,
  useLendingModalSupplyDrex,
  useLendingModalSupplyTSelic,
} from "@/stores/lendingModal";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import Modal from "../Modal";
import { useAccount } from "wagmi";
import { EthereumAddress } from "../../hooks/useErc20";
import {
  useGetTotalSupplied,
  useGetTotalBorrowed,
} from "../../hooks/useRBLLPoolContract";
import { ContextSupplyDrex } from "./ContextSupplyDrex";
import { ContextBorrowDrex } from "./ContextBorrowDrex";
import { ContextSupplyTSelic } from "./ContextSupplyTSelic ";

export function LendingManage() {
  const { isOpen: isOpenSD, onClose: onCloseSD } = useStore(
    useLendingModalSupplyDrex
  );
  const { isOpen: isOpenST, onClose: onCloseST } = useStore(
    useLendingModalSupplyTSelic
  );
  const { isOpen: isOpenBD, onClose: onCloseBD } = useStore(
    useLendingModalBorrowDrex
  );
  const [isLoading, setLoading] = useState(true);
  const { address } = useAccount();

  const {
    data: dataTotalSupplied,
    isError: isErrorTotalSupplied,
    isLoading: isLoadingTotalSupplied,
  } = useGetTotalSupplied();

  const {
    data: dataTotalBorrowed,
    isError: isErrorTotalBorrowed,
    isLoading: isLoadingTotalBorrowed,
  } = useGetTotalBorrowed();

  useEffect(() => {
    const loading = [isLoadingTotalSupplied, isLoadingTotalBorrowed].every(
      (loading) => loading === false
    );

    setLoading(!loading);
  }, [isLoadingTotalSupplied, isLoadingTotalBorrowed]);

  const renderContent = () => {
    if (isOpenSD) {
      return (
        <ContextSupplyDrex
          address={address as EthereumAddress}
          dataTotalSupplied={dataTotalSupplied}
          dataTotalBorrowed={dataTotalBorrowed}
        />
      );
    } else if (isOpenST) {
      // Renderizar conteúdo para SupplyTSelic
      return <ContextSupplyTSelic address={address as EthereumAddress} />;
    } else if (isOpenBD) {
      // Renderizar conteúdo para BorrowDrex
      return (
        <ContextBorrowDrex
          address={address as EthereumAddress}
          dataTotalSupplied={dataTotalSupplied}
          dataTotalBorrowed={dataTotalBorrowed}
        />
      );
    }
  };

  const isOpen = isOpenSD || isOpenST || isOpenBD;
  const onClose = isOpenSD ? onCloseSD : isOpenST ? onCloseST : onCloseBD;

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-primary h-full w-full rounded-lg px-10 py-6 lg:max-w-[400px] ">
        {renderContent()}
      </div>
    </Modal>
  );
}
