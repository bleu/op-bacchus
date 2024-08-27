"use client"


import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CreateEventSchemaButton } from './CreateEventSchemaButton';

export function Header() {
    return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 12,
          }}
        >
          <CreateEventSchemaButton />
          <ConnectButton />
        </div>
      );
    };