import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Return a placeholder element for ProtectedRoute to handle redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>You need to be logged in to view this page</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
            <p className="text-neutral-600 mt-2">
              View and manage your personal information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center">
                      <UserIcon className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center space-x-2 mb-4">
                    <Badge className="capitalize bg-primary hover:bg-primary-dark">
                      {user.role}
                    </Badge>
                    <Badge variant="outline">
                      Member since {formatDate(String(user.createdAt))}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">Edit Profile</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-neutral-700">Full Name</h3>
                    <p className="text-neutral-600">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-700">Email Address</h3>
                    <p className="text-neutral-600">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-700">Phone Number</h3>
                    <p className="text-neutral-600">{user.phoneNumber || '-'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-700">User Role</h3>
                    <p className="text-neutral-600 capitalize">{user.role}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>
                    Overview of your activities on NAFDAC DrugVerify
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-primary-light bg-opacity-10 p-4 rounded-lg">
                    <h3 className="font-medium text-primary">Drug Verifications</h3>
                    <p className="text-3xl font-bold mt-2 text-neutral-900">0</p>
                    <p className="text-neutral-600 text-sm mt-1">Total verifications performed</p>
                  </div>
                  <div className="bg-warning-light bg-opacity-10 p-4 rounded-lg">
                    <h3 className="font-medium text-warning-dark">Reports Submitted</h3>
                    <p className="text-3xl font-bold mt-2 text-neutral-900">0</p>
                    <p className="text-neutral-600 text-sm mt-1">Suspicious drugs reported</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}