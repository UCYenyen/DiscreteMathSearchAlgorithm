import React from 'react'
import Link from 'next/link'
import { SlugPageProps } from '@/types/utilities/util.md';
export default async function page({ params }: SlugPageProps) {
  const { slug } = await params;
  return (
    <main className="min-h-screen w-screen flex flex-col justify-center items-center bg-zinc-900 gap-8">
      <h1 className="text-5xl text-white font-bold">{slug.toUpperCase()}</h1>
      <div className="flex flex-col gap-4 justify-center items-center text-white">
       
      </div>
    </main>
  )
}
