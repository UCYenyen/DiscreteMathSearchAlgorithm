"use client";

import { useRef } from "react";
import Link from "next/link";
import { useStackingAnimation } from "@/hooks/useStackingAnimation";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useStackingAnimation(mainRef);

  return (
    <main ref={mainRef} className="w-full bg-black">
      <section className="h-screen w-full flex flex-col justify-center items-center bg-zinc-900 text-white relative z-10">
        <h1 className="reveal text-5xl font-bold">
          Welcome to the Search Algorithm Research
        </h1>
      </section>

      <section className="h-screen w-full flex flex-col justify-center items-center bg-white text-black relative z-30">
        <div className="reveal flex flex-col gap-8 items-center justify-center">
          <h1 className="reveal text-5xl font-bold">
            Explore Various Search Algorithms
          </h1>
          <Link
            href="/algorithm"
            className="text-2xl underline font-bold"
          >
            Click Here to Start
          </Link>
        </div>
      </section>
    </main>
  );
}