import { generateMetadata } from "@/lib/seo"

export const metadata = generateMetadata({
  title: "Cookie Policy",
  description: "Kobonz Cookie Policy - Learn about the cookies we use and how to manage them.",
  path: "/cookies",
  noIndex: false,
})

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Cookie Policy</h1>
      
      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device
            when you visit a website. They are widely used to make websites work more
            efficiently and provide information to website owners.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold">1. Necessary Cookies</h3>
          <p>
            These cookies are essential for the website to function properly. They enable
            core functionality such as security, network management, and accessibility.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authentication cookies (to keep you logged in)</li>
            <li>Security cookies (to prevent fraud and abuse)</li>
            <li>Session cookies (to maintain your session)</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            These cookies cannot be disabled as they are essential for the website to work.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold">2. Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by
            collecting and reporting information anonymously.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Page views and navigation patterns</li>
            <li>Time spent on pages</li>
            <li>Error tracking</li>
            <li>Performance metrics</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            You can opt out of these cookies in our cookie consent banner.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold">3. Marketing Cookies</h3>
          <p>
            These cookies track your online activity to help advertisers deliver more
            relevant advertising or to limit how many times you see an ad.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Targeted advertising</li>
            <li>Social media integration</li>
            <li>Remarketing</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            You can opt out of these cookies in our cookie consent banner.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Managing Cookies</h2>
          <p>You have several options for managing cookies:</p>
          
          <h3 className="mb-3 mt-4 text-lg font-semibold">Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. However,
            if you limit the ability of websites to set cookies, you may worsen your overall
            user experience.
          </p>

          <h3 className="mb-3 mt-4 text-lg font-semibold">Cookie Consent Manager</h3>
          <p>
            You can change your cookie preferences at any time using our cookie consent
            banner. Your preferences will be saved and respected on future visits.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Third-Party Cookies</h2>
          <p>
            Some cookies on our site are set by third-party services that appear on our
            pages. We do not control these cookies. You should check the third-party
            websites for more information about these cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted
            on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at
            privacy@kobonz.com
          </p>
        </section>
      </div>
    </div>
  )
}
