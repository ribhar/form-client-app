'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Form', path: '/form' },
  { name: 'Data', path: '/data' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md p-4 mb-6">
      <ul className="flex gap-6 justify-center">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`text-lg font-medium ${
                pathname === item.path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
