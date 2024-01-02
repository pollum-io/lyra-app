export const siteConfig = {
  title: 'Lyra Loans',
  description:
    'Lyra Loans é um protocolo de empréstimos descentralizado desenvolvido para o XRP Ledger Brasil Hackathon.',
};

export const metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: `/favicon/site.webmanifest`,
};