'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'ui/sonner';

const AuthShell = ({ children }: { children: ReactNode }) => {
  type AuthShellStatus = 'initial' | 'authenticated' | 'unauthenticated';
  interface AuthShellElement extends HTMLElement {
    authStatus: AuthShellStatus;
  }
  const authShellRef = useRef<AuthShellElement | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthShellStatus>('initial');

  useEffect(() => {
    if (!authShellRef.current) return;
    const shell = authShellRef.current;
    const handleStatusChange = () => {
      console.log('MutationObserver:', shell.authStatus, authStatus);
      if (shell.authStatus !== authStatus) {
        setAuthStatus(shell.authStatus);
      }
    };
    const observer = new MutationObserver(handleStatusChange);
    observer.observe(shell, {
      attributes: true,
      attributeFilter: ['auth-status'],
    });
    if (shell.authStatus !== authStatus) {
      setAuthStatus(shell.authStatus);
    }
    return () => observer.disconnect();
  }, [authShellRef]);
  console.log('Render:', authStatus);
  return (
    // @ts-expect-error - auth-shell is a custom web component
    <auth-shell ref={authShellRef}>
      {authStatus === 'initial' && (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {authStatus === 'authenticated' && <>{children}</>}
      {/* @ts-expect-error - auth-shell is a custom web component */}
    </auth-shell>
  );
};

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthShell>
      <div id="root">
        {children}
        <Toaster richColors />
      </div>
    </AuthShell>
  );
}