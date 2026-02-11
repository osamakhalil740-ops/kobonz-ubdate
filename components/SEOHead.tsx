import React from 'react';
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Kobonz - Coupon Management System',
  description = 'Advanced coupon management platform for merchants and customers. Find exclusive deals, manage discounts, and grow your business.',
  keywords = 'coupons, discounts, deals, shopping, merchants, kobonz',
  image = '/favicon.svg',
  url = window.location.href,
  type = 'website',
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);

    // Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:type', type);

    // Twitter
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // Canonical URL
    updateLink('canonical', url);
  }, [title, description, keywords, image, url, type]);

  const updateMetaTag = (attr: string, attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const updateLink = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  return null;
};

export default SEOHead;
