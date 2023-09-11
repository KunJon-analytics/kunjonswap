"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

import { Loader, Exchange } from "./";

const ExchangeBox = () => {
  const { isConnected } = useAccount();
  const [tokensLoading, setTokensLoading] = useState(true);
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    const getTokens = async () => {
      try {
        const response = await axios.get(
          "https://tokens.coingecko.com/uniswap/all.json"
        );
        setTokens(response.data.tokens);
        setTokensLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getTokens();
  }, []);

  return (
    <div className="relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full gradient-border p-[2px] rounded-3xl">
      <div className="pink_gradient" />
      <div className="w-full min-h-[400px] bg-neutral-950 backdrop-blur-[4px] rounded-3xl shadow-card flex p-10">
        {isConnected ? (
          tokensLoading ? (
            <Loader title={"Loading tokens, please wait!"} />
          ) : (
            <Exchange tokens={tokens} />
          )
        ) : (
          <Loader title={"Please connect your Wallet"} />
        )}
      </div>
      <div className="blue_gradient" />
    </div>
  );
};

export default ExchangeBox;
