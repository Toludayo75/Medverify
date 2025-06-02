import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Bell, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Define navigation items based on user role
  const regularNavItems = [
    { name: "Home", href: "/" },
    { name: "Verify Drug", href: "/verify" },
    { name: "Report Suspicious", href: "/report" },
    { name: "Education", href: "/education" },
  ];

  // Admin only sees the dashboard in the main nav
  const adminNavItems = [
    { name: "Admin Dashboard", href: "/admin" }
  ];

  // Determine which nav items to show based on user role
  const navItemsToShow = user?.role === "admin" ? adminNavItems : regularNavItems;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {user && user.role === 'admin' ? (
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <span className="ml-2 text-lg font-display font-bold text-primary">MedVerify</span>
                </div>
              ) : (
                <Link href="/" className="flex items-center">
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <span className="ml-2 text-lg font-display font-bold text-primary">MedVerify</span>
                </Link>
              )}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItemsToShow.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    location === item.href
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center">
              {user && user.role === 'admin' ? (
                <>
                  <Link href="/notifications">
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Bell className="h-5 w-5 text-neutral-400" />
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="rounded-full bg-amber-100">
                        <User className="h-4 w-4 mr-2" />
                        Admin: {user.firstName}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/notifications">Notifications</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : null}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          {navItemsToShow.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                location === item.href
                  ? "bg-neutral-50 border-primary text-primary"
                  : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {user?.role === "admin" && (
          <div className="pt-4 pb-3 border-t border-neutral-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <span className="font-semibold">A</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-800">
                  Admin: {user.firstName} {user.lastName}
                </div>
                <div className="text-sm font-medium text-neutral-500">
                  {user.email}
                </div>
              </div>
              <Link href="/notifications" className="ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Bell className="h-6 w-6 text-neutral-400" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-3 space-y-1">
              <Link
                href="/admin"
                className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
              <Link
                href="/notifications"
                className="block px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                Notifications
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}