"use client";

import { Sidebar } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { FaTruckFront } from "react-icons/fa6";
import { LuPackageOpen, LuFolderTree } from "react-icons/lu";
import { MdHistory } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DeleteSession } from "@/components/DeleteSession";

const navClass = (activeItem, path) =>
  `px-4 py-2 rounded-md hover:bg-gray-200 ${activeItem === path ? "bg-gray-200" : ""}`;

export default function SideBar() {
  const [activeItem, setActiveItem] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("activeSidebarItem");
    if (stored) setActiveItem(stored);
  }, []);

  const handleClick = (href) => {
    if (href === "#") return;
    setActiveItem(href);
    localStorage.setItem("activeSidebarItem", href);
  };

  const handleLogout = async () => {
    await DeleteSession();
    localStorage.removeItem("activeSidebarItem");
    router.push("/");
  };

  return (
    <Sidebar className="w-full h-full">
      <Sidebar.Logo href="/" img="/img/logo.svg" imgAlt="logo">
        Admin Panel
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/admin"
            icon={HiHome}
            className={navClass(activeItem, "/admin")}
            onClick={() => handleClick("/admin")}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/products"
            icon={LuFolderTree}
            className={navClass(activeItem, "/admin/products")}
            onClick={() => handleClick("/admin/products")}
          >
            Categories
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/products-list"
            icon={LuPackageOpen}
            className={navClass(activeItem, "/admin/products-list")}
            onClick={() => handleClick("/admin/products-list")}
          >
            Products
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/orders"
            icon={FaTruckFront}
            className={navClass(activeItem, "/admin/orders")}
            onClick={() => handleClick("/admin/orders")}
          >
            Orders
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/box-rates"
            icon={LuPackageOpen}
            className={navClass(activeItem, "/admin/box-rates")}
            onClick={() => handleClick("/admin/box-rates")}
          >
            Box rates
          </Sidebar.Item>
          <Sidebar.Item
            href="/admin/stockHistory"
            icon={MdHistory}
            className={navClass(activeItem, "/admin/stockHistory")}
            onClick={() => handleClick("/admin/stockHistory")}
          >
            Stock
          </Sidebar.Item>
          <Sidebar.Item
            href="#"
            icon={IoLogOut}
            className="px-4 py-2 rounded-md hover:bg-gray-200 text-black"
            onClick={handleLogout}
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
