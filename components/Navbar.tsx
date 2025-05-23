'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Form' },
    { href: '/submissions', label: 'Submissions' },
  ];

  return (
    <nav className="bg-white shadow p-4">
      <ul className="flex gap-6 justify-center text-lg font-medium">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`hover:underline ${
                pathname === href ? 'text-blue-600 underline' : 'text-gray-800'
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
