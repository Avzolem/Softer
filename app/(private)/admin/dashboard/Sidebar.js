"use client";

import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  ShoppingBagIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

// Admin sidebar navigation options
const sidebarOptions = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: HomeIcon,
  },
  {
    href: "/admin/dashboard/products",
    label: "Productos",
    icon: ShoppingBagIcon,
  },
  {
    href: "/admin/dashboard/orders",
    label: "Pedidos",
    icon: CubeIcon,
  },
  {
    href: "/admin/dashboard/users",
    label: "Usuarios",
    icon: UsersIcon,
  },
  {
    href: "/admin/dashboard/timer",
    label: "Timer",
    icon: CubeIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
    toast.success("Sesión cerrada");
  };

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <div className="w-64 h-screen bg-base-200 text-base-content flex flex-col">
        {/* Main menu items */}
        <ul className="menu p-4 flex-1">
          {sidebarOptions.map((option) => {
            const isActive = pathname === option.href;
            return (
              <li key={option.href}>
                <Link href={option.href} className={isActive ? "active" : ""}>
                  <option.icon className="w-5 h-5" />
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout button - only visible on desktop */}
        <ul className="menu p-4 pt-0 hidden lg:block">
          <li>
            <button
              onClick={handleLogout}
              className="text-error hover:bg-error/20"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
