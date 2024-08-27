// "use client";
// import React from "react";
// import { useAccount, useBalance, useConnect, useDisconnect, useEnsName } from "wagmi";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// function formatAddress(address:string) {
//   return address.slice(0, 6) + "..." + address.slice(-4);
// }

// function DisconnectWallet({ balance, connector, ensName, address, disconnect }:any) {
//   return (
//     <DropdownMenu>
//       <div className="flex items-center justify-center">
//         <DropdownMenuTrigger asChild>
//             <Button className="bg-white text-red-500">
//             {ensName ? ensName : formatAddress(address)}
//             </Button>
//         </DropdownMenuTrigger>
//         <p>{connector?.name || ""}</p>
//         <p>OPT: {balance?.data ? balance.data.formatted : "Sem balanço"}</p>
//       </div>
//       <DropdownMenuContent>
//         <DropdownMenuItem onClick={() => disconnect()}>
//           Disconnect
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export function Header() {
//   const { address, isConnected, connector, chain } = useAccount();
//   const { data: ensName } = useEnsName({address,});
//   const { connect, connectors } = useConnect();
//   const { disconnect } = useDisconnect();
//   const balance = useBalance({address,chainId:10})

//   function ConnectWallet({ connectors }:any) {
//     return (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button className="bg-white text-red-500">Connect Wallet</Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           {connectors.map((connector:any) => (
//             <DropdownMenuItem
//               key={connector.id}
//               onClick={() => connect({ connector })}
//             >
//               {connector.name}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     );
//   }

//   console.log(balance);

//   return (
//     <header className="bg-red-500 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Bacchus: Events and Invitations</h1>
//         {isConnected ? (
//           <DisconnectWallet
//             balance={balance}
//             connector={connector}
//             ensName={ensName}
//             address={address}
//             disconnect={disconnect}
//           />
//         ) : (
//           <ConnectWallet connectors={connectors} />
//         )}
//       </div>
//     </header>
//   );
// }
"use client"


import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
    return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 12,
          }}
        >
          <ConnectButton />
        </div>
      );
    };