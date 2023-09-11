import { ExchangeBox } from "@/components";

export default function Home() {
  return (
    <div className="flex-1 flex justify-start items-center flex-col w-full mt-10">
      <h1 className="text-white font-poppins font-black text-5xl tracking-wide">
        KunJon Swap
      </h1>
      <p className="text-white font-poppins font-medium mt-3 text-base">
        Exchange Tokens in Seconds
      </p>
      <div className="mt-10 w-full flex justify-center">
        <ExchangeBox />
      </div>
    </div>
  );
}
