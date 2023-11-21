import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  image: string;
  priceOs: string;
  priceOsEth: string;
  priceBlur: string;
  priceBlurEth: string;
  linkOs: string;
  linkBlur: string;
};
export const CardCollection = ({
  title,
  image,
  priceOs = '1960.89',
  priceBlur = '1960.89',
  priceOsEth,
  priceBlurEth,
  linkOs,
  linkBlur,
}: Props) => {
  return (
    <div className='bg-primary relative flex h-full w-[320px] flex-col rounded-[15px] border-2 border-black  backdrop-blur-[20px]'>
      <div className='mt-6 w-full justify-center text-3xl font-bold'>
        {title}
      </div>
      <div className='relative mt-6 flex h-[200px] w-full items-center justify-center '>
        <Image
          src={image}
          alt='logo'
          width={200}
          height={150}
          className='rounded-[15px]'
          objectFit='cover'
        />
      </div>
      <div className='relative inline-flex w-full flex-col items-center justify-start p-6'>
        <div className='flex w-full flex-col justify-between gap-[15px]'>
          <Link href={linkOs} target='_blank'>
            <div className='flex w-full flex-col items-start justify-between'>
              <div className='flex items-center justify-start gap-2'>
                <div className='text-base font-normal capitalize tracking-wide text-black'>
                  on sale
                </div>
                <div className='relative h-7 w-7 items-center justify-center'>
                  <Image
                    src='/images/opensea.svg'
                    alt='logo'
                    width={261}
                    height={261}
                    className='rounded-full'
                    style={{ objectFit: 'fill' }}
                  />
                </div>
              </div>
              <div className='flex items-start justify-start'>
                <div className='inline-flex flex-row items-end justify-start gap-3'>
                  <div className='text-base font-semibold capitalize tracking-wide text-black'>
                    {priceOsEth} ETH
                  </div>
                  <div className='text-sm font-normal capitalize tracking-wide text-gray-400'>
                    (${priceOs})
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <Link href={linkBlur} target='_blank'>
            <div className='flex w-full flex-col items-start justify-between'>
              <div className='flex items-center justify-start gap-2'>
                <div className='text-base font-normal capitalize tracking-wide text-black'>
                  on sale
                </div>
                <div className='relative h-7 w-7 items-center justify-center'>
                  <Image
                    src='/images/blur.png'
                    alt='logo'
                    width={261}
                    height={261}
                    className='rounded-full'
                    style={{ objectFit: 'fill' }}
                  />
                </div>
              </div>
              <div className='flex items-start justify-start'>
                <div className='inline-flex flex-row items-end justify-start gap-3'>
                  <div className='text-base font-semibold capitalize tracking-wide text-black'>
                    {priceBlurEth} ETH
                  </div>
                  <div className='text-sm font-normal capitalize tracking-wide text-gray-400'>
                    (${priceBlur})
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
