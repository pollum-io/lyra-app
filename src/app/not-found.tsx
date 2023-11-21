import { Metadata } from 'next';
import Image from 'next/image';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Soon',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-whiteAlpha-50'>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
          <Image
            src='/images/building.png'
            alt='logo'
            width={261}
            height={261}
            style={{ objectFit: 'fill' }}
          />
          <h1 className='my-8 text-4xl md:text-6xl'>Building page . . .</h1>
          <a href='/'>
            <Image src='/images/prana.png' alt='logo' width={60} height={30} />
          </a>
        </div>
      </section>
    </main>
  );
}
