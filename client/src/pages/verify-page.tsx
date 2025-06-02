import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerificationForm from "@/components/drug-verify/VerificationForm";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section id="verify" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-neutral-900">Verify Your Medication</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Enter the NAFDAC number and batch number to quickly check if your medication is genuine.
              </p>
            </div>
            
            <VerificationForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
