"use client";

import { UnifiedNavbar } from "@/components/unified-navbar";
import { Footer } from "@/components/footer";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-theme-primary relative overflow-hidden text-gray-100 font-sans selection:bg-accent/30">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh opacity-40 pointer-events-none"></div>
        <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px] opacity-10 pointer-events-none"
            style={{ animationDelay: "1.5s" }}
        ></div>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.pexels.com/photos/3780104/pexels-photo-3780104.png?auto=compress&cs=tinysrgb&w=1920"
            alt="Gaming Background"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-[#050505]/90"></div>

          {/* Experimental Pulsing Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#60CDF5]/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: "5s" }}
          ></div>
        </div>

      <UnifiedNavbar />

      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Terms & <span className="text-accent">Policies</span>
        </h1>

        <div className="space-y-6">
          {/* Introduction */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <div className="space-y-4 text-theme-secondary">
              <p>
                Welcome to Roesploits. We specialize in selling licensed software
                keys, providing reliable and affordable solutions. We guarantee the
                security and legality of all our products.
              </p>
              <p>
                By accessing or purchasing our products, you agree to comply with
                these Terms of Service. Please read them carefully before using our
                services. These terms govern your use of our software, products,
                and any related services.
              </p>
            </div>
          </section>

          {/* License Termination */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">
              License Termination & Violations
            </h2>
            <p className="text-theme-secondary">
              We reserve the right to terminate any license key if a user is found
              violating these Terms of Service, engaging in fraudulent activity,
              or attempting to exploit our systems. Any attempt to bypass security
              measures, resell, or distribute our software without permission will
              result in an immediate ban without refund or reinstatement.
            </p>
          </section>

          {/* Agreement to Terms */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
            <p className="text-theme-secondary">
              By using our website and purchasing our products, you agree to these
              Terms of Service. We reserve the right to modify these terms at any
              time. Any changes take effect immediately upon publication on our
              website.
            </p>
          </section>

          {/* Software Use & Liability */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">
              Software Use & Liability
            </h2>
            <p className="text-theme-secondary">
              All software is used at your own risk. We are not responsible for
              how the software is used or for any consequences resulting from its
              use, including but not limited to game bans, data loss, or service
              violations. You are solely responsible for complying with the Terms
              of Service of any third-party platforms, games, or services the
              software interacts with.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">
              Limitation of Liability
            </h2>
            <p className="text-theme-secondary">
              To the maximum extent permitted by law, we shall not be held liable
              for any losses, damages, or legal claims arising from the use of our
              software or license keys purchased through our service.
            </p>
          </section>

          {/* Disclaimer of Availability */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">
              Disclaimer of Availability
            </h2>
            <p className="text-theme-secondary">
              We do not guarantee that any software associated with a license key
              will remain operational, supported, or available indefinitely. If
              the original software provider discontinues service, disables
              access, or becomes unavailable for any reason, we are not liable for
              any resulting losses.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
            <p className="text-theme-secondary">
              If you have any questions or concerns, please contact our support
              team before making a purchase. By purchasing our products, you
              acknowledge and agree to all terms listed above.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
            <p className="text-theme-secondary">
              Protecting your personal information is a top priority at
              Roesploits. We use advanced encryption and security measures to
              protect your data. We do not store sensitive payment information
              such as credit card numbers.
            </p>
          </section>

          {/* Refund Policy */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-6">Refund Policy</h2>
            
            <div className="space-y-6 text-theme-secondary">
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Purchases & Refunds</h3>
                    <p>
                    All sales are final. We do not offer refunds or exchanges under any
                    circumstances. By making a purchase, you confirm that you have
                    reviewed the product description and ensured compatibility with your
                    system. You are responsible for verifying that the product meets
                    your needs before purchasing. No refunds or chargebacks will be
                    accepted.
                    </p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Fraudulent Payments & Chargebacks</h3>
                    <p>
                    We maintain a zero-tolerance policy for fraudulent payments and
                    chargebacks. If a payment is flagged as suspicious or a chargeback
                    is initiated, the associated license key will be revoked immediately
                    without notice. We reserve the right to take legal action and report
                    fraudulent activity to the appropriate authorities. Identity verification may be required if fraud is suspected.
                    </p>
                </div>
            </div>
          </section>

          {/* Shipping Policy */}
          <section className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-accent/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4">Shipping Policy</h2>
             <div className="text-theme-secondary space-y-2">
                <h3 className="text-lg font-bold text-white">Digital Delivery</h3>
                <p>
                All products are delivered digitally. License keys are sent
                instantly to your registered email address and are also available in
                your order details after payment confirmation. If you do not receive
                your key, please check your Spam/Junk folder or contact our support
                team. You are responsible for providing accurate information,
                including a valid email address, to ensure successful delivery.
                </p>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}
