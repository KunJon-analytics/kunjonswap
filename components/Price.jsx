"use client";

import qs from "qs";
import useSWR from "swr";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  erc20ABI,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { MAX_ALLOWANCE, exchangeProxy } from "@/lib/constants";
import { Error } from ".";

export const fetcher = ([endpoint, params]) => {
  const { sellAmount, buyAmount } = params;
  if (!sellAmount && !buyAmount) return;
  const query = qs.stringify(params);

  return fetch(`${endpoint}?${query}`).then((res) => res.json());
};

export default function PriceView({ setPrice, setFinalize, tokens }) {
  // fetch price here
  const { address: takerAddress } = useAccount();
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [sellToken, setSellToken] = useState(tokens[0]);
  const [buyToken, setBuyToken] = useState(tokens[1]);
  const [error, setError] = useState();

  const handleSellTokenChange = (e) => {
    const address = e.target.value;
    const token = tokens.find((token) => token.address === address);
    setSellToken(token);
  };

  function handleBuyTokenChange(e) {
    const address = e.target.value;
    const token = tokens.find((token) => token.address === address);
    setBuyToken(token);
  }

  const sellTokenDecimals = sellToken?.decimals;

  const parsedSellAmount =
    sellAmount && tradeDirection === "sell" && sellTokenDecimals
      ? parseUnits(sellAmount, sellTokenDecimals).toString()
      : undefined;

  const buyTokenDecimals = buyToken?.decimals;

  const parsedBuyAmount =
    buyAmount && tradeDirection === "buy" && buyTokenDecimals
      ? parseUnits(buyAmount, buyTokenDecimals).toString()
      : undefined;

  const { isLoading: isLoadingPrice } = useSWR(
    [
      "/api/price",
      {
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        sellAmount: parsedSellAmount,
        buyAmount: parsedBuyAmount,
        takerAddress,
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setPrice(data);
        if (!!data.validationErrors.length) {
          setError(data.validationErrors[0]);
          return;
        }
        if (tradeDirection === "sell") {
          setBuyAmount(formatUnits(data.buyAmount, buyTokenDecimals));
        } else {
          setSellAmount(formatUnits(data.sellAmount, sellTokenDecimals));
        }
      },
    }
  );

  return (
    <form>
      <div>
        <section className="flex justify-between items-center flex-row w-full min-w-full bg-zinc-900 border-[1px] border-transparent hover:border-zinc-800 min-h-[96px] sm:p-8 p-4 rounded-[20px]">
          <label htmlFor="sell-select" className="sr-only"></label>
          <Image
            src={sellToken.logoURI}
            alt={sellToken.symbol}
            className="h-9 w-9 mr-2 rounded-md"
            height={9}
            width={9}
          />
          <div className="h-9 sm:w-full sm:mr-2">
            <select
              value={sellToken.address}
              name="sell-token-select"
              id="sell-token-select"
              className="mr-2 w-50 sm:w-full bg-transparent text-white h-9 rounded-md"
              onChange={handleSellTokenChange}
            >
              {/* <option value="">--Choose a token--</option> */}
              {tokens.map((token, index) => {
                return (
                  <option
                    key={`${index}${token.address}`}
                    value={token.address}
                    className="bg-zinc-900"
                  >
                    {token.symbol}
                  </option>
                );
              })}
            </select>
          </div>
          <label htmlFor="sell-amount" className="sr-only"></label>
          <input
            id="sell-amount"
            value={sellAmount}
            className="w-full outline-none bg-transparent border-[1px] border-pink-500 font-poppins font-black text-2xl text-white"
            onChange={(e) => {
              setTradeDirection("sell");
              setSellAmount(e.target.value);
            }}
          />
        </section>
        <section className="flex justify-between mt-5 items-center flex-row w-full min-w-full bg-zinc-900 border-[1px] border-transparent hover:border-zinc-800 min-h-[96px] sm:p-8 p-4 rounded-[20px]">
          <label htmlFor="buy-token" className="sr-only"></label>

          <Image
            src={buyToken.logoURI}
            alt={buyToken.symbol}
            className="h-9 w-9 mr-2 rounded-md"
            height={9}
            width={9}
          />
          <select
            name="buy-token-select"
            id="buy-token-select"
            value={buyToken.address}
            className="mr-2 w-50 sm:w-full bg-transparent text-white h-9 rounded-md"
            onChange={(e) => handleBuyTokenChange(e)}
          >
            {/* <option value="">--Choose a token--</option> */}
            {tokens.map((token, index) => {
              return (
                <option
                  key={`${index}${token.address}`}
                  value={token.address}
                  className="bg-zinc-900"
                >
                  {token.symbol}
                </option>
              );
            })}
          </select>
          <label htmlFor="buy-amount" className="sr-only"></label>
          <input
            id="buy-amount"
            value={buyAmount}
            className="w-full bg-transparent outline-none border-[1px] border-blue-500 font-poppins font-black text-2xl text-white"
            disabled
            onChange={(e) => {
              setTradeDirection("buy");
              setBuyAmount(e.target.value);
            }}
          />
        </section>
      </div>

      {takerAddress ? (
        <ApproveOrReviewButton
          sellTokenAddress={sellToken.address}
          takerAddress={takerAddress}
          onClick={() => {
            setFinalize(true);
          }}
        />
      ) : (
        <ConnectButton />
      )}

      {isLoadingPrice && (
        <div className="text-center mt-2">Fetching the best price...</div>
      )}
      {error && <Error error={error} />}
    </form>
  );
}

function ApproveOrReviewButton({ takerAddress, onClick, sellTokenAddress }) {
  // 1. Read from erc20, does spender (0x Exchange Proxy) have allowance?
  const { data: allowance, refetch } = useContractRead({
    address: sellTokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [takerAddress, exchangeProxy],
  });

  // 2. (only if no allowance): write to erc20, approve 0x Exchange Proxy to spend max integer
  const { config } = usePrepareContractWrite({
    address: sellTokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [exchangeProxy, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error,
  } = useContractWrite(config);

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: writeContractResult ? writeContractResult.hash : undefined,
    onSuccess(data) {
      refetch();
    },
  });

  if (error) {
    return (
      <div className="w-full text-left mt-2 ml-2">
        <p className="font-poppins font-normal text-red-600">
          <>{error.message}</>
        </p>
      </div>
    );
  }

  if (allowance === 0n && approveAsync) {
    return (
      <>
        <button
          type="button"
          className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={async () => {
            const writtenValue = await approveAsync();
          }}
        >
          {isApproving ? "Approving..." : "Approve"}
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
    >
      Review Trade
    </button>
  );
}
