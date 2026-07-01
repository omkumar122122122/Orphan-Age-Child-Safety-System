import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { roleLabels } from "../utils/constants";

export default function DashboardLayout({ navItems, role, title }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar navItems={navItems} roleLabel={roleLabels[role]} />
      {open && (
        <div className="fixed inset-0 z-40 bg-slate-950/55 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-80 max-w-[86vw] bg-white p-5 shadow-2xl dark:bg-slate-950" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex justify-end">
              <Button variant="ghost" icon={FiX} onClick={() => setOpen(false)} aria-label="Close navigation" className="px-3" />
            </div>
            <Sidebar navItems={navItems} roleLabel={roleLabels[role]} mobile />
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <Navbar title={title} onMenuClick={() => setOpen(true)} />
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
