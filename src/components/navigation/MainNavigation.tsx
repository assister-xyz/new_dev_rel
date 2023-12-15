'use client';

import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation';
import { Badge } from '../ui/badge';

export function MainNavigation({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  console.log(pathname);

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/console/dashboard"
        className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/console/dashboard' ? '' : 'text-muted-foreground'}`}
      >
        Dashboard
      </Link>
      <Link
        href="/console/tickets"
        className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/console/tickets' ? '' : 'text-muted-foreground'}`}
      >
        Tickets <Badge variant='primary'>beta</Badge>
      </Link>
      <Link
        href="/console/knowledge-base"
        className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/console/knowledge-base' ? '' : 'text-muted-foreground'}`}
      >
        Knowledge Base
      </Link>
    </nav>
  );
}