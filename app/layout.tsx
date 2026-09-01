import type { Metadata } from 'next';
import { Barlow_Condensed, DM_Mono, Manrope } from 'next/font/google';
import './globals.css';

const display = Barlow_Condensed({ variable: '--font-display', subsets: ['latin'], weight: ['600', '700', '800', '900'] });
const sans = Manrope({ variable: '--font-sans', subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });
const mono = DM_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Povik | Futur QA Tester',
  description: 'Le portfolio de Jonathan “Povik” Ragot, futur testeur logiciel, vibecoder et chasseur de bugs curieux.',
  openGraph: {
    title: 'Povik | Futur QA Tester',
    description: 'Je trouve les bugs avant qu’ils ne vous trouvent.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Povik | Futur QA Tester',
    description: 'Je trouve les bugs avant qu’ils ne vous trouvent.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${display.variable} ${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
