import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event';
  eventData?: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    organizer: string;
    price: string;
    currency: string;
  };
}

const SEO: React.FC<SEOProps> = ({
  title = 'EVOKE - Discover & Create Unforgettable Events',
  description = 'Join EVOKE to discover amazing events, create your own vibes, and connect with communities. Buy tickets, manage events, and experience unforgettable moments.',
  keywords = 'events, tickets, event management, social events, community, entertainment, nightlife, concerts, festivals, event planning',
  image = 'https://evoke-app.com/og-image.jpg',
  url = 'https://evoke-app.com',
  type = 'website',
  eventData
}) => {
  const fullTitle = title === 'EVOKE - Discover & Create Unforgettable Events' 
    ? title 
    : `${title} | EVOKE`;

  const structuredData = eventData ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": eventData.name,
    "description": eventData.description,
    "startDate": eventData.startDate,
    "endDate": eventData.endDate,
    "location": {
      "@type": "Place",
      "name": eventData.location
    },
    "organizer": {
      "@type": "Organization",
      "name": eventData.organizer
    },
    "offers": {
      "@type": "Offer",
      "price": eventData.price,
      "priceCurrency": eventData.currency,
      "availability": "https://schema.org/InStock"
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EVOKE",
    "description": "Discover and create unforgettable events. Buy tickets, manage events, and connect with communities.",
    "url": url,
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "EVOKE"
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="EVOKE" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="EVOKE" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Mobile Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="EVOKE" />
    </Helmet>
  );
};

export default SEO; 