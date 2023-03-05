import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>DrTrottoir</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"m-20 h-4/5"}>
        <div className={"flex"}>
      	  <div className={"basis-1/2 mr-5"}>
            <p>Rene was hier.</p>
            <p>Elias was hier ook!</p>
      	  </div>
          <h1 className="basis-1/2 text-3xl font-bold text-red-500">
            If this is red, tailwind works.
          </h1>
        </div>
        <div className="mt-20">
            En ook hier. <Link className="underline" href="/login">Go Fish</Link>
        </div>
      </main>
    </>
  )
}
