'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || 'U';

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-sm font-semibold">
            {initials}
          </div>
          <span className="hidden sm:inline-block max-w-[100px] truncate text-sm font-medium">
            {user.name || user.email?.split('@')[0]}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {user.role && (
              <span className="text-xs text-teal-600 dark:text-teal-400 capitalize mt-1">
                {user.role}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help" className="flex items-center cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 dark:text-red-400 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
