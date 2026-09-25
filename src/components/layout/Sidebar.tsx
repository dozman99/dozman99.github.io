/** @format */

import { NavLink } from 'react-router-dom';
import { FileText, Mail } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from '@/components/BrandIcons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Headshot } from '@/components/Headshot';
import { navItems } from '@/data/nav';
import { site } from '@/data/site';
import { cn } from '@/lib/utils';

// Desktop-only: the persistent left column (Brittany Chiang-style layout).
// Sticky, so it stays put while page content scrolls in the right column.
// Mobile nav lives separately in MobileHeader.
export function Sidebar() {
  return (
    <aside className='hidden shrink-0 lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-80 lg:flex-col lg:justify-between lg:py-16'>
      <div>
        <NavLink to='/' className='inline-block'>
          <Headshot width={144} height={144} className='mb-5 size-36 rounded-full' />
          {/* Each page owns its <h1>; the name is identity, not a page heading. */}
          <p className='text-3xl font-semibold tracking-tight'>{site.name}</p>
        </NavLink>
        <p className='mt-1 text-base font-medium text-foreground/80'>
          {site.role}
        </p>
        <p className='mt-4 max-w-xs text-sm text-muted-foreground text-pretty'>
          {site.tagline}
        </p>

        <nav className='mt-12 flex flex-col gap-1'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }>
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      // Animate transform, not width: no layout work on hover.
                      'h-px w-10 origin-left transition-transform duration-200',
                      isActive
                        ? 'scale-x-100 bg-primary'
                        : 'scale-x-50 bg-muted-foreground group-hover:scale-x-100',
                    )}
                  />
                  <span className={cn(isActive && 'text-primary')}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className='flex flex-col gap-5'>
      <div className='flex items-center gap-5 text-sm font-medium'>
        <a
          href={site.resume}
          target='_blank'
          rel='noreferrer'
          className='inline-flex items-center gap-1.5 text-primary transition-colors hover:text-foreground'>
          <FileText className='size-4' />
          Résumé
        </a>
        <a
          href={`mailto:${site.email}`}
          className='inline-flex items-center gap-1.5 text-primary transition-colors hover:text-foreground'>
          <Mail className='size-4' />
          Email me
        </a>
      </div>
      <div className='flex items-center gap-4 text-muted-foreground'>
        {site.linkedin && (
          <a
            href={site.linkedin}
            target='_blank'
            rel='noreferrer'
            aria-label='LinkedIn'
            className='transition-colors hover:text-foreground'>
            <LinkedInIcon className='size-4' />
          </a>
        )}
        {site.github && (
          <a
            href={site.github}
            target='_blank'
            rel='noreferrer'
            aria-label='GitHub'
            className='transition-colors hover:text-foreground'>
            <GitHubIcon className='size-4' />
          </a>
        )}
        <ThemeToggle className='ml-auto' />
      </div>
      </div>
    </aside>
  );
}
