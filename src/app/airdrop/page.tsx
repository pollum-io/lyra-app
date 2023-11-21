'use client';

import { useState } from 'react';

import { TooltipContainer } from '@/components/Tooltip';

export default function Airdrop() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <main>
      <section className='bg-whiteAlpha-50'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-start gap-20 pb-12 text-center'>
          <div className='flex'>
            <div
              className='pt-7 text-7xl font-bold'
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Airdrop Estimated
            </div>
            {showTooltip && (
              <div className='h-[50px]'>
                <TooltipContainer>
                  The data is automatically updated every 1 hour or when the
                  page is reloaded.
                </TooltipContainer>
              </div>
            )}
          </div>
          <div className='flex w-full flex-col items-center justify-center gap-7 lg:flex-row'></div>
        </div>
      </section>
    </main>
  );
}
