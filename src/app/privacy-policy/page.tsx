import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | CookWise',
  description: 'Privacy Policy for CookWise - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy for CookWise</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-center text-muted-foreground mb-8">
          <strong>Effective Date: July 9, 2025</strong>
        </p>

        <p className="mb-6">
          CookWise ("we", "us", or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and disclose information about you when you use our application ("App") and related services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">a. Personal Information</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Name, email address, and contact details</li>
          <li>Age, gender (optional), and dietary goals</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">b. Health & Dietary Information</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Food allergies, dietary preferences, and nutritional goals</li>
          <li>Caloric intake and meal tracking data</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">c. Usage Data</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Device information, log files, and user interactions with the App</li>
          <li>Recipes viewed, searches performed, and supermarket orders</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">d. Location Data</h3>
        <p className="mb-4">
          If enabled, we may collect your location to suggest local supermarket options.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use your data to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Provide personalized recipe and meal recommendations</li>
          <li>Track your caloric and dietary goals</li>
          <li>Suggest meals and ingredients based on your allergies and preferences</li>
          <li>Facilitate grocery ordering through third-party services</li>
          <li>Improve our app functionality and user experience</li>
          <li>Respond to customer support inquiries</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Share Your Information</h2>
        <p className="mb-4">We do not sell your personal information. We may share your data with:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Third-party services for grocery deliveries or nutritional databases</li>
          <li>Cloud hosting and analytics providers</li>
          <li>Law enforcement if required by applicable law</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Privacy Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Access, update, or delete your personal information</li>
          <li>Opt-out of data processing for non-essential services</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
        <p className="mb-4">
          We use encryption, authentication, and secure data storage to protect your information. However, no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Children's Privacy</h2>
        <p className="mb-4">
          CookWise is not intended for users under the age of 13. We do not knowingly collect data from children under 13 without parental consent.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy periodically. We will notify you of any significant changes via the App or email.
        </p>
      </div>
    </div>
  )
}
