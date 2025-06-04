import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';
import { Email, Launch } from '@/constants';

const TermsOfService: React.FC = () => {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By using our job board platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the service."
    },
    {
      title: "2. Description of Service",
      content: "Our platform allows users to browse and post job listings. We provide tools for job seekers to discover opportunities and for employers to post jobs, manage listings, and connect with potential candidates."
    },
    {
      title: "3. User Accounts and Responsibilities",
      content: "To post a job, you must create an account using Supabase Auth. You are responsible for keeping your login credentials secure and for all activity under your account. You agree not to impersonate others or use false information."
    },
    {
      title: "4. Job Posting Guidelines",
      content: "You agree to post only legitimate job opportunities. We reserve the right to remove content we deem misleading, inappropriate, or harmful to users. Spam, duplicate postings, and non-job content are prohibited."
    },
    {
      title: "5. Intellectual Property",
      content: "All content you submit (e.g., job listings, company details) remains your property. However, by posting it, you grant us a license to display and distribute it as needed to operate and promote the platform."
    },
    {
      title: "6. Prohibited Activities",
      content: "You may not use the platform for any unlawful activities. This includes harassment, data scraping, distributing malware, or violating any applicable laws or third-party rights."
    },
    {
      title: "7. Modifications to the Service",
      content: "We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice. We are not liable for any impact such changes may have."
    },
    {
      title: "8. Limitation of Liability",
      content: "We do our best to provide a reliable service, but we are not liable for any losses, damages, or issues arising from your use of the platform or reliance on job listings posted by third parties."
    },
    {
      title: "9. Privacy and Data Protection",
      content: (
        <>
          Your use of the platform is also governed by our {' '}
          <Link href='/privacy-policy' className="hover:underline text-primary">Privacy Policy</Link>, 
          which explains how we handle your data.
        </>
      )
    },
    {
      title: "10. Termination",
      content: "We may suspend or terminate your account if we believe you have violated these terms or engaged in suspicious or harmful activity. You may also close your account at any time by contacting support."
    },
    {
      title: "11. Changes to Terms",
      content: "These terms may be updated from time to time. We will notify users of major changes via email or app notification. Continued use after changes means you accept the revised terms."
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {Launch.Date}</p>
        </CardHeader>
        <CardContent>
          {terms.map((term, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{term.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{term.content}</p>
            </div>
          ))}
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about these Terms of Service, feel free to contact us:
            </p>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              <Link href={`mailto:${Email.supportEmail}`}>
                {Email.supportEmail}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
