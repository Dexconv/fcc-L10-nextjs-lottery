import {useMoralis} from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader(){

    const {enableWeb3, deactivateWeb3, account, isWeb3Enabled, Moralis, isWeb3EnableLoading} = useMoralis()

    useEffect(()=>{
        if (isWeb3Enabled){
            return
        }
        if (typeof window != "undefined"){
            if (window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
    },[isWeb3Enabled])
    // no array, run on every render
    // empty array, run once
    // dependency array, run when the stuff in it changesan


    useEffect(()=>{},[Moralis.onAccountChanged((account)=>{
        console.log(`account changed to ${account}`)
        if ( account == null){
            window.localStorage.removeItem("connected")
            deactivateWeb3()
            console.log("Null account found")
        }
    })])

    return(
    <div>
        {account ? 
        (<div>Connected to {account.slice(0,6)}...{account.slice(account.length-4)}</div>)
         : 
        (<button onClick={async ()=>{
            await enableWeb3()

            if (typeof window != "undefined"){
                window.localStorage.setItem("connected","injected")
            }
        }} 
        disabled={isWeb3EnableLoading}
        >Connect</button>)
        }
    </div>
    )
}