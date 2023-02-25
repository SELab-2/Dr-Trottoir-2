import Head from "next/head";
import Layout from "@/components/layout";
import styles from "@/components/layout.module.css";
import {useEffect, useRef, useState} from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function Login(){

    const emailInput = useRef(null);
    const wwInput = useRef(null);

    const router = useRouter();
    function handleSubmit() {
        router.push({
            pathname: '/test',
            query: { email: emailInput.current.value,
                     password: wwInput.current.value
            }
        })
    }


    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>
            <Image
                src="/images/Logo-Dr-Trottoir-GEEL-01.png"
                height={144}
                width={470}
                alt=""
            />
            <h1>Inloggen</h1>
            <br/>
            <label htmlFor="email">E-mailadres:</label>
            <input
                className={styles.input}
                type="text"
                id="email"
                name="email"
                required
                ref={emailInput}
            />
            <label htmlFor="name">Wachtwoord:</label>
            <input className={styles.input} type="password" id="ww" name="ww" ref={wwInput} required/>
            <br/>
            <button className={styles.button} type="submit" onClick={handleSubmit}>Log in</button>
        </Layout>
    )
}