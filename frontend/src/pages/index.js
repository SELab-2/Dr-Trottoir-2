import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          <h1>
              René.
          </h1>
        <div className={styles.description}>
          Rene was hier.
        </div>
        <div style={{height: "50%"}}></div>
        <div className={styles.description}>
          En ook hier.
        </div>
      </main>
    </>
  )
}
