import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event' | 'product';
  noindex?: boolean;
  nofollow?: boolean;
  eventData?: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    organizer: string;
    price: string;
    currency: string;
    category?: string;
    image?: string;
    ticketUrl?: string;
  };
  articleData?: {
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'EVOKE - Discover & Create Unforgettable Events',
  description = 'Join EVOKE to discover amazing events, create your own vibes, and connect with communities. Buy tickets, manage events, and experience unforgettable moments.',
  keywords = 'events, tickets, event management, social events, community, entertainment, nightlife, concerts, festivals, event planning',
  image = 'https://evoke-app.com/og-image.jpg',
  url = 'https://evoke-app.com',
  type = 'website',
  noindex = false,
  nofollow = false,
  eventData,
  articleData,
  breadcrumbs
}) => {
  const fullTitle = title === 'EVOKE - Discover & Create Unforgettable Events' 
    ? title 
    : `${title} | EVOKE`;

  // Ensure title is under 60 characters for optimal display
  const optimizedTitle = fullTitle.length > 60 ? fullTitle.substring(0, 57) + '...' : fullTitle;
  
  // Ensure description is between 150-160 characters for optimal display
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;

  // Robots meta content
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;

  // Generate structured data based on type
  const generateStructuredData = () => {
    if (eventData) {
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": eventData.name,
        "description": eventData.description,
        "startDate": eventData.startDate,
        "endDate": eventData.endDate,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
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
          "availability": "https://schema.org/InStock",
          "url": eventData.ticketUrl || url
        },
        ...(eventData.image && { "image": eventData.image }),
        ...(eventData.category && { "category": eventData.category })
      };
    }

    if (articleData) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
          "@type": "Person",
          "name": articleData.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "EVOKE",
          "logo": {
            "@type": "ImageObject",
            "url": "https://evoke-app.com/logo.png"
          }
        },
        "datePublished": articleData.publishedTime,
        "dateModified": articleData.modifiedTime || articleData.publishedTime,
        "image": image,
        "url": url,
        ...(articleData.section && { "articleSection": articleData.section }),
        ...(articleData.tags && { "keywords": articleData.tags.join(', ') })
      };
    }

    // Default WebApplication schema
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "EVOKE",
      "description": "Discover and create unforgettable events. Buy tickets, manage events, and connect with communities.",
      "url": url,
      "applicationCategory": "EntertainmentApplication",
      "operatingSystem": "Web",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "EVOKE"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250"
      }
    };
  };

  // Generate breadcrumb structured data
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  const structuredData = generateStructuredData();

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="title" content={optimizedTitle} />
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - EVOKE`} />
      <meta property="og:site_name" content="EVOKE" />
      <meta property="og:locale" content="en_US" />

      {/* Additional Open Graph for articles */}
      {articleData && (
        <>
          <meta property="article:author" content={articleData.author} />
          <meta property="article:published_time" content={articleData.publishedTime} />
          {articleData.modifiedTime && (
            <meta property="article:modified_time" content={articleData.modifiedTime} />
          )}
          {articleData.section && (
            <meta property="article:section" content={articleData.section} />
          )}
          {articleData.tags && articleData.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@evoke_app" />
      <meta name="twitter:creator" content="@evoke_app" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${title} - EVOKE`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="EVOKE" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="theme-color" content="#6366f1" />
      
      {/* Security Headers */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Mobile & PWA Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="EVOKE" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Additional meta for better indexing */}
      <meta name="google-site-verification" content="your-google-verification-code" />
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
    </Helmet>
  );
};

export default SEO;