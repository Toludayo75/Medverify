import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/admin/AdminPanel";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdminPanel />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
