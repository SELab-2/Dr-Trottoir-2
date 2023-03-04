import Head from "next/head";
import Layout from "@/components/layout";
import styles from "@/components/layout.module.css";
import {useEffect, useRef, useState} from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {baseUrl} from "@/utils/baseUrl";
import axios from 'axios'

axios


export default function Login(){

    const emailInput = useRef(null);
    const wwInput = useRef(null);

    const router = useRouter();
    async function handleSubmit() {
        // router.push({
        //     pathname: '/test',
        //     query: { email: emailInput.current.value,
        //              password: wwInput.current.value
        //     }
        // })
        console.log(emailInput.current.value)
        console.log(wwInput.current.value)
        const jsonData = JSON.stringify({
            email: emailInput.current.value,
            password: wwInput.current.value
        })
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8',
                      'Access-Control-Allow-Origin' : 'http://127.0.0.1:8000/api/'},
            body: jsonData
        }
        const { data } = (await axios
        .post(baseUrl + 'auth/', jsonData
        ).then(response => {
            console.log(response)
        }).catch((error) => {
          console.log(error.response)
        }))

        // try {
        //     console.log(requestOptions)
        //     let response = await fetch(baseUrl + "auth/", requestOptions);
        //     console.log(response)
        //     let data = await response.json();
        //     console.log("psssss")
        //     if (data.hasOwnProperty("message")) {
        //         //setError(data.message);
        //     } else {
        //         //navigate(`/audiobook?url=${data.url}`);
        //     }
        // } catch (e) {
        //     console.log(e);
        //     //setError(e);
        // }
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