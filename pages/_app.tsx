import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { NextSeo } from 'next-seo';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wang Store",
  description: "Generated by create next app",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
        <NextSeo
          title="Wang Store"
          description="Store Wang"
        />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
