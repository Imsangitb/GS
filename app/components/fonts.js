import localFont from 'next/font/local';

export const biolinum = localFont({
  src: [
    {
      path: '../../public/fonts/LinBiolinum_R.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/LinBiolinum_RB.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/LinBiolinum_RI.ttf',
      weight: '400',
      style: 'italic',
    }
  ],
  variable: '--font-biolinum',
});