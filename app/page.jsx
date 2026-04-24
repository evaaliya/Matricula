'use client';

import { useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import AssetGallery from '../components/AssetGallery';
import BalanceWidget from '../components/BalanceWidget';

export default function Page() {
  useEffect(() => {
    // Notify Warpcast that the Mini App has successfully loaded
    const init = async () => {
      await sdk.actions.ready();
    };
    init();
  }, []);
  return (
    <main style={{ padding: '40px', position: 'relative' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ 
            color: '#fff', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            textShadow: '0 0 10px var(--neon-blue)',
            margin: '0 0 10px 0'
          }}>
            [ MATRICULA ] Agent Core
          </h1>
          <p style={{ color: 'var(--neon-pink)', margin: 0, fontSize: '0.9rem' }}>
            STATUS: ONLINE // DESCI CURATION ACTIVE
          </p>
        </div>
        <BalanceWidget />
      </header>

      <AssetGallery />
    </main>
  );
}
