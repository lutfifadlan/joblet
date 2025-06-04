import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Common, Email, Launch } from '@/constants';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {Launch.Date}</p>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">            
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p>
            Welcome to {Common.title}. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Account information such as your name, email, and login credentials</li>
            <li>Job posting details if you post a job (e.g., job title, company name, job description, location, job type)</li>
            <li>Usage data including how you interact with our site</li>
            <li>Technical data such as browser type, IP address, and device information</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Allow you to sign up, log in, and manage your account</li>
            <li>Enable you to create, edit, and manage job listings</li>
            <li>Provide job seekers with access to job listings</li>
            <li>Analyze and improve the functionality and performance of our platform</li>
            <li>Send service-related emails and notifications</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">4. Sharing Your Information</h2>
          <p>
            We may share your information with trusted third-party service providers that help us operate our service (e.g., Supabase for authentication). We do not sell your personal data to third parties.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">5. Data Security</h2>
          <p>
            We use industry-standard measures to secure your data, including encrypted storage and secure communication protocols. However, please be aware that no method of electronic transmission or storage is 100% secure.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
          <p>You may have the right to:</p>
          <ul className="list-disc pl-5 mb-4">
            <li>Access the personal data we hold about you</li>
            <li>Update or correct your information</li>
            <li>Request deletion of your account and data</li>
            <li>Object to or restrict how we process your data</li>
          </ul>
          <p>
            To exercise your rights, please contact us using the email address provided below.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">7. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites. Please review their privacy policies before submitting any personal data.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Any changes will be posted on this page, and we may notify you through the app or via email if significant changes are made.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: {' '}
            <Link href={`mailto:${Email.supportEmail}`} className="text-primary hover:underline">
              {Email.supportEmail}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
