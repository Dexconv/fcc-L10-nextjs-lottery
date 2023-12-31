import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Raffle</title>
                <meta name="description" content="Smart Contract Raffle" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* header / connect button / navbar */}
            <Header />
            <LotteryEntrance />
        </div>
    )
}
