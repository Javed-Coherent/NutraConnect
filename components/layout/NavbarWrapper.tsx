import { auth } from '@/lib/auth';
import { Navbar } from './Navbar';

export async function NavbarWrapper() {
  const session = await auth();

  return (
    <Navbar
      user={
        session?.user
          ? {
              name: session.user.name,
              email: session.user.email,
              role: session.user.role,
            }
          : null
      }
    />
  );
}
