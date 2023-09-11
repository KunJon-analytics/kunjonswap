"use client";

import useSWR from "swr";
import Image from "next/image";
import { formatUnits } from "viem";
import {
  useAccount,
  useSendTransaction,
  usePrepareSendTransaction,
} from "wagmi";
import { useState } from "react";

import { fetcher } from "./Price";

export default function QuoteView({ price, quote, setQuote, tokens }) {
  // fetch quote here

  const { address: takerAddress } = useAccount();
  const [error, setError] = useState();

  const { isLoading: isLoadingPrice } = useSWR(
    [
      "/api/quote",
      {
        sellToken: price.sellTokenAddress,
        buyToken: price.buyTokenAddress,
        sellAmount: price.sellAmount,
        // buyAmount: TODO if we want to support buys,
        takerAddress,
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setQuote(data);
        console.log("quote", data);
      },
    }
  );

  const { config } = usePrepareSendTransaction({
    to: quote?.to, // The address of the contract to send call data to, in this case 0x Exchange Proxy
    data: quote?.data, // The call data required to be sent to the to contract address.
  });

  const { sendTransaction } = useSendTransaction(config);

  if (!quote) {
    return <div>Getting best quote...</div>;
  }

  const sellTokenInfo = tokens.find(
    (token) => token.address === price.sellTokenAddress
  );
  const buyTokenInfo = tokens.find(
    (token) => token.address === price.buyTokenAddress
  );

  return (
    <div>
      <form>
        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
          <div className="text-xl mb-2 text-white">You pay</div>
          <div className="flex items-center text-lg sm:text-3xl text-white">
            <Image
              alt={sellTokenInfo.symbol}
              height={9}
              width={9}
              className="h-9 w-9 mr-2 rounded-md"
              src={sellTokenInfo.logoURI}
            />
            <span>{formatUnits(quote.sellAmount, sellTokenInfo.decimals)}</span>
            <div className="ml-2">{sellTokenInfo.symbol}</div>
          </div>
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
          <div className="text-xl mb-2 text-white">You receive</div>
          <div className="flex items-center text-lg sm:text-3xl text-white">
            <Image
              alt={buyTokenInfo.symbol}
              height={9}
              width={9}
              className="h-9 w-9 mr-2 rounded-md"
              src={buyTokenInfo.logoURI}
            />
            <span>{formatUnits(quote.buyAmount, buyTokenInfo.decimals)}</span>
            <div className="ml-2">{buyTokenInfo.symbol}</div>
          </div>
        </div>
      </form>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={() => {
          console.log("submitting quote to blockchain");
          sendTransaction && sendTransaction();
        }}
      >
        Place Order
      </button>
    </div>
  );
}
