export const siteConfig = {
  title: 'Lyra Loans',
  description:
    'Lyra Loans is a decentralized lending protocol developed for the NEW HORIZON XRP Hackathon.',
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
