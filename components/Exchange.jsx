"use client";
import React, { useState } from "react";

import { QuoteView, PriceView } from ".";

const Exchange = ({ tokens }) => {
  const [finalize, setFinalize] = useState(false);
  const [price, setPrice] = useState();
  const [quote, setQuote] = useState();

  return (
    <div className="flex flex-col w-full items-center">
      {finalize && price ? (
        <QuoteView
          price={price}
          quote={quote}
          setQuote={setQuote}
          tokens={tokens}
        />
      ) : (
        <PriceView
          price={price}
          setPrice={setPrice}
          setFinalize={setFinalize}
          tokens={tokens}
        />
      )}
    </div>
  );
};

export default Exchange;
