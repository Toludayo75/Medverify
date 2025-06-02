import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EducationCards from "@/components/education/EducationCards";
import DangerSection from "@/components/education/DangerSection";

export default function EducationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section id="education" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-neutral-900">Drug Safety Education</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Learn how to identify counterfeit medications and protect yourself and your loved ones.
              </p>
            </div>
            
            <EducationCards />
            <DangerSection />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
