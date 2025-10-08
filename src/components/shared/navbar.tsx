import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 bg-[#121212] border-b border-[#2A2A2A] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            
            {session?.user && (
              <Link 
                href="/predictions/new" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Make a Prediction
              </Link>
            )}
            
            <Link 
              href="/rules" 
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Rules
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <span className="text-sm text-gray-400">
                  {session.user.username}
                </span>
                <form action={logout}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-sm"
                  >
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="text-sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}