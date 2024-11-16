import React from 'react';
import {useDynamicContext, useSwitchNetwork} from "@dynamic-labs/sdk-react-core";
type NetworkSwitcherProps = {
    chainID: number | string;
}
const NetworkSwitcher = ({chainID}: NetworkSwitcherProps) => {
    const switchNetwork = useSwitchNetwork();
    const { primaryWallet } = useDynamicContext();
    React.useEffect(() => {
        if(chainID !== 0){
            console.log('switching network to', chainID);
            switchNetwork({
                wallet: primaryWallet,
                network: chainID
            }).then(response => console.log(response));
        }
    }, [chainID])
    return (
        <div></div>
    );
};

export default NetworkSwitcher;