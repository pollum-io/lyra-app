/* eslint-disable no-console */
"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";

import { CardCollection } from "@/components/CardCollection";
import { TooltipContainer } from "@/components/Tooltip";

import { cardData } from "@/utils/utils";
import { Card } from "@/components/Card";
import { Apr } from "@/components/Apr";
import { ProgressBar } from "@/components/ProgressBar";

export default function HomePage() {
  const [updatedCardData, setUpdatedCardData] = useState(cardData);

  const [showTooltip, setShowTooltip] = useState(false);

  const apiUrls = {
    Kubz: "https://api.opensea.io/api/v2/collections/kubz/stats",
    "Keungz Genesis":
      "https://api.opensea.io/api/v2/collections/keungz-genesis/stats",
    Yogapetz: "https://api.opensea.io/api/v2/collections/yogapetz/stats",
    "Ordinal Kubz":
      "https://api.opensea.io/api/v2/collections/ordinal-kubz/stats",
  };

  const apiUrlsBlur = {
    "0xeb2dfc54ebafca8f50efcc1e21a9d100b5aeb349":
      "https://api.reservoir.tools/orders/asks/v5?contracts=0xEb2dFC54EbaFcA8F50eFcc1e21A9D100b5AEb349&sources=blur.io&sortBy=price", //kubz
    "0x76Cc4742f7Eaa89a93576505dec37C2C66a76AB7":
      "https://api.reservoir.tools/orders/asks/v5?contracts=0x76Cc4742f7Eaa89a93576505dec37C2C66a76AB7&sources=blur.io&sortBy=price", // genesis
    "0x142e03367eDE17Cd851477A4287D1F35676E6dC2":
      "https://api.reservoir.tools/orders/asks/v5?contracts=0x142e03367eDE17Cd851477A4287D1F35676E6dC2&sources=blur.io&sortBy=price", // yogapetz
    "0xC589770757cD0d372c54568BF7e5E1d56b958015":
      "https://api.reservoir.tools/orders/asks/v5?contracts=0xC589770757cD0d372c54568BF7e5E1d56b958015&sources=blur.io&sortBy=price", // okubz
  };

  const fetchDataOS = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": "9e79a6f8e78e4d56b2611f5a9c5b25a3",
      },
    };

    const requests = Object.entries(apiUrls).map(([title, url]) =>
      axios
        .get(url, options)
        .then((response) => ({ title, data: response.data }))
    );

    const data = Promise.all(requests)
      .then((responses) => {
        const updatedData = cardData.map((card) => {
          const response = responses.find((r) => r.title === card.title);
          if (response && ethPrice) {
            return {
              ...card,
              priceOsEth: response.data.total.floor_price,
              priceOs: (
                parseFloat(response.data.total.floor_price) * ethPrice
              ).toFixed(2),
            };
          }
          return card;
        });

        return updatedData;
      })
      .catch((err) => {
        console.error(err);
      });

    return data;
  };

  const fetchDataBlur = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "*/*",
        "x-api-key": "de4680c3-9198-54a9-b42d-e8abe7cd3996",
      },
    };

    const requests = Object.entries(apiUrlsBlur).map(([contractAddress, url]) =>
      axios
        .get(url, options)
        .then((response) => ({ contractAddress, data: response.data.orders }))
    );

    const data = Promise.all(requests)
      .then((responses) => {
        const updatedData = updatedCardData.map((card) => {
          const response = responses.find(
            (r) =>
              r.contractAddress.toLowerCase() ===
              card.contractAddress.toLowerCase()
          );

          if (response && ethPrice) {
            const order = response.data.find(
              (obj: any) =>
                obj.contract.toLowerCase() ===
                card.contractAddress.toLowerCase()
            );

            if (order) {
              const apiPriceEth = order.price.amount.decimal;
              const apiPriceUsd = (apiPriceEth * ethPrice).toFixed(2);
              return {
                ...card,
                priceBlurEth: apiPriceEth.toString(),
                priceBlur: apiPriceUsd,
              };
            }
          }
          return card;
        });

        return updatedData;
      })
      .catch((err) => {
        console.error(err);
      });

    return data;
  };

  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=N4YDVQTB8Z74F9H8VQSD2WK2YWFS84Y71W`;
        const response = await axios.get(url);
        setEthPrice(response.data.result.ethusd);
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
      }
    };

    fetchEthPrice();
  }, []);

  useEffect(() => {
    const updateData = async () => {
      if (ethPrice != null) {
        try {
          const dataFromOS = await fetchDataOS();
          const dataFromBlur = await fetchDataBlur();

          // Combinar dados de ambas as fontes
          const combinedData = cardData.map((card) => {
            const dataOS = dataFromOS?.find((c) => c.title === card.title);
            const dataBlur = dataFromBlur?.find(
              (c) =>
                c.contractAddress.toLowerCase() ===
                card.contractAddress.toLowerCase()
            );

            return {
              ...card,
              priceBlur: dataBlur?.priceBlur || "0",
              priceBlurEth: dataBlur?.priceBlurEth || "0",
              priceOs: dataOS?.priceOs || "0",
              priceOsEth: dataOS?.priceOsEth || "0",
            };
          });

          setUpdatedCardData(combinedData);
        } catch (error) {
          console.error("Error updating data:", error);
        }
      }
    };

    updateData();

    const intervalOS = setInterval(fetchDataOS, 3600000);
    const intervalBlur = setInterval(fetchDataBlur, 3600000);

    return () => {
      clearInterval(intervalOS);
      clearInterval(intervalBlur);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethPrice]);

  return (
    <main>
      <section className="bg-whiteAlpha-50">
        <div className="layout relative flex min-h-screen flex-col items-center justify-start gap-20 py-12 text-center">
          <div className="flex h-full w-full items-end justify-between">
            <Card text={"Supply Balance"} value={"16,818.992"} />
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Apr aprPercent={75} />
              <div className="relative mt-6 h-10 w-[482px]">
                <ProgressBar progress={30} />
                <div className="absolute left-[412px] top-[20px] text-sm font-normal leading-tight text-white">
                  $12,614.18
                </div>
                <div className="absolute left-0 top-0 text-sm font-normal leading-tight text-white">
                  Borrow Limit: 19%
                </div>
              </div>
            </div>
            <Card text={"Borrow Balance"} value={"16,818.992"} isLeft />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-7 lg:flex-row"></div>
        </div>
      </section>
    </main>
  );
}
