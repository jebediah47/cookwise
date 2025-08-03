import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | CookWise',
  description: 'Terms of Use for CookWise - Learn about your rights and responsibilities when using our app.',
}

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Terms of Use for CookWise</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-center text-muted-foreground mb-8">
          <strong>Effective Date: July 9, 2025</strong>
        </p>

        <p className="mb-6">
          By using CookWise ("App"), you agree to the following terms. If you do not agree, please do not use the App.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of the App</h2>
        <p className="mb-4">You may use CookWise for personal, non-commercial purposes to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Discover AI-generated cooking ideas and meal plans</li>
          <li>Track calories and dietary progress</li>
          <li>Input preferences, allergies, and dietary goals</li>
          <li>Order groceries via integrated services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Community Guidelines</h2>
        <p className="mb-4">To ensure a positive experience for all users:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Do not use offensive, abusive, or foul language.</li>
          <li>Be respectful to others, including in any community features, comments, or recipe-sharing areas.</li>
          <li>Do not post content that is illegal, hateful, discriminatory, or harmful.</li>
        </ul>
        <p className="mb-4">
          We reserve the right to suspend or terminate accounts that violate these rules.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Responsibility</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your login information. You agree to notify us immediately of any unauthorized use of your account.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Content Ownership</h2>
        <p className="mb-4">
          You retain ownership of any personal content (e.g., custom recipes) you upload. By posting content, you grant us a non-exclusive, royalty-free license to use it for app functionality and improvements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Health Disclaimer</h2>
        <p className="mb-4">
          CookWise is not a substitute for professional medical advice. Always consult with a qualified healthcare provider before making changes to your diet or exercise routine. We do not guarantee the accuracy of calorie estimates or nutritional suggestions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Services</h2>
        <p className="mb-4">
          The App may link to or integrate with third-party services (e.g., grocery delivery). We are not responsible for their content, availability, or privacy practices.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your access to the App at any time if you violate these Terms or use the App in a harmful or unlawful manner.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to the Terms</h2>
        <p className="mb-4">
          We may update these Terms occasionally. Continued use of the App after changes constitutes acceptance of the new Terms.
        </p>
      </div>
    </div>
  )
}
