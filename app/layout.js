import "./globals.css";

export const metadata = {
  title: "Tech News Dashboard",
  description: "Personal technology and cybersecurity news aggregator",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
  themeColor: "#0d9488",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tech News",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Inline script to prevent flash: reads saved preference before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-surface-0 text-text-primary font-body">
        {children}
      </body>
    </html>
  );
}
