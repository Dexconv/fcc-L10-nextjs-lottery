import { useWeb3Contract } from "react-moralis"
import {abi, contractAddresses} from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import {ethers} from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance (){
    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setrecentWinner] = useState("0")

    const dispatch = useNotification()

    const {runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params : {},
        msgValue : entranceFee
    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params : {},
    })

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params : {},
    })
    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params : {},
    })

    async function updateUI(){
        if (isWeb3Enabled){
            const entranceFeeFromCall =( await getEntranceFee()).toString()
            const numPlayersFromCall = (await getNumberOfPlayers()).toString()
            const recentWinnerFromCall = (await getRecentWinner()).toString()
            setEntranceFee(entranceFeeFromCall)
            setNumPlayers(numPlayersFromCall)
            setrecentWinner(recentWinnerFromCall)
        }
    }

    useEffect(()=>{
        updateUI()
    },[isWeb3Enabled])

    const handleSuccess = async function (tx){
        try{
            await tx.wait(1)
            handleNewNotification(tx)
            updateUI()
        } catch (error){
            console.log(error)
        }
    }
    const handleNewNotification = function (){
        dispatch({
            type:"info",
            message: "transaction complete",
            title : "tx notification",
            position: "topR",
            icon:"bell"
        })
    }

    return (
        <div className="p-5">
                {raffleAddress ? 
                (<div >
                    <button 
                    className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded ml-auto" 
                    onClick={async()=>{
                        await enterRaffle({
                            //onComplete
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isFetching || isLoading}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ):( 
                            <div className="">Enter raffle</div>
                        )}
                    </button>
                    <div>
                    Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                    <div>
                    Number Of Players: {numPlayers}
                    </div>
                    <div>
                    Recent Winner: {recentWinner}
                    </div>
                </div>)
                :
                (<div>No Raffle Address Detected</div>)
                }
        </div>
    )
}