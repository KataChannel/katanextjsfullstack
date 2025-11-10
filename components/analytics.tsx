"use client";

import Script from "next/script";
import { useEffect } from "react";

interface AnalyticsProps {
  googleAnalytics?: string | null;
  googleTagManager?: string | null;
  facebookPixel?: string | null;
}

export function Analytics({
  googleAnalytics,
  googleTagManager,
  facebookPixel,
}: AnalyticsProps) {
  useEffect(() => {
    // Initialize Facebook Pixel
    if (facebookPixel && typeof window !== "undefined") {
      (window as any).fbq =
        (window as any).fbq ||
        function () {
          ((window as any).fbq.q = (window as any).fbq.q || []).push(arguments);
        };
      (window as any).fbq.loaded = true;
      (window as any).fbq("init", facebookPixel);
      (window as any).fbq("track", "PageView");
    }
  }, [facebookPixel]);

  return (
    <>
      {/* Google Analytics (GA4) */}
      {googleAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalytics}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {googleTagManager && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${googleTagManager}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManager}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* Facebook Pixel */}
      {facebookPixel && (
        <>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${facebookPixel}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
