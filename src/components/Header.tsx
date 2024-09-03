"use client"


import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CreateEventSchemaButton } from './CreateEventSchemaButton';
import { CreateEventAttestationButton } from './CreateEventAttestationButton';

export function Header() {
    return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 12,
          }}
        >
          <CreateEventAttestationButton />
          <CreateEventSchemaButton />
          <ConnectButton />
        </div>
      );
    };