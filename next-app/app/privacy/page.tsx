import { generateMetadata } from "@/lib/seo"

export const metadata = generateMetadata({
  title: "Privacy Policy",
  description: "Kobonz Privacy Policy - Learn how we collect, use, and protect your personal data.",
  path: "/privacy",
  noIndex: false,
})

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and email address</li>
            <li>Account credentials</li>
            <li>Profile information</li>
            <li>Payment information (processed securely by third parties)</li>
            <li>Communications with us</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Detect and prevent fraud and abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">3. Data Sharing and Disclosure</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may
            share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">4. Your Rights (GDPR)</h2>
          <p>If you are in the European Economic Area, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> You can request a copy of your personal data</li>
            <li><strong>Rectification:</strong> You can request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> You can request deletion of your data</li>
            <li><strong>Portability:</strong> You can request transfer of your data</li>
            <li><strong>Objection:</strong> You can object to processing of your data</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at privacy@kobonz.com
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">5. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our
            service and hold certain information. You can instruct your browser to refuse
            all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the
            purposes outlined in this Privacy Policy, unless a longer retention period is
            required by law.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">8. Children's Privacy</h2>
          <p>
            Our service is not directed to individuals under the age of 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">9. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page and updating the "Last
            updated" date.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-none space-y-2">
            <li>Email: privacy@kobonz.com</li>
            <li>Address: [Your Company Address]</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
