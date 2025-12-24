'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Menu, Bookmark, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { UserMenu } from './UserMenu';
import { SavedIndicator } from './SavedIndicator';

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Check if a link is active (exact match for home, startsWith for others)
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    setIsOpen(false);
    signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/knowledge', label: 'Industry Expert' },
    { href: '/insights', label: 'Insights' },
    { href: '/workspace', label: 'Workspace' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            NutraConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive(link.href)
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          {user ? (
            <>
              <SavedIndicator />
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700">
                <Link href="/auth/signup">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive(link.href)
                        ? 'text-teal-600 dark:text-teal-400 font-semibold'
                        : 'text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-4 border-border" />
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-muted/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white font-semibold">
                        {user.name
                          ? user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                          : user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/saved"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <Bookmark className="h-5 w-5" />
                      Saved
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-lg font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-teal-600 to-emerald-600">
                      <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                        Sign Up Free
                      </Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
