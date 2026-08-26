import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Waves, ShieldCheck, Activity, LayoutDashboard, History, PhoneCall } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { path: "/history", label: "History", icon: <History size={16} /> },
    { path: "/emergency", label: "Emergency", icon: <PhoneCall size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col text-[#F8FAFC] font-sans">
      {/* Header */}
      <header className="pt-4 sm:pt-8 px-4 flex justify-center">
        <div className="bg-[#142238]/90 backdrop-blur-xl border border-[#52647D]/60 h-auto sm:h-[4.5rem] py-3 sm:py-0 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl px-4 sm:px-6 shadow-2xl shadow-black/30 gap-3 sm:gap-0">
          
          <NavLink to="/" className="group flex items-center gap-3" aria-label="Kavach dashboard">
            <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[#F2A65A] text-[#111827] shadow-lg shadow-[#F2A65A]/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <ShieldCheck size={27} strokeWidth={1.8} />
              <Waves className="absolute bottom-1 left-1/2 -translate-x-1/2" size={19} strokeWidth={2.4} />
            </div>
            <div className="leading-none">
              <h1 className="text-xl font-serif tracking-wide text-[#F8FAFC]">Kavach</h1>
              <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.24em] text-[#A9B8CA]">
                Risk Intelligence
              </span>
            </div>
          </NavLink>

            <nav className="relative flex items-center bg-[#0b1422]/70 p-1 rounded-full border border-[#52647D]/50">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-[12px] font-medium flex gap-1.5 sm:gap-2 items-center transition-colors ${
                    active ? "text-[#F2A65A]" : "text-[#B8C4D6] hover:text-[#F8FAFC]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {active && (
                    <div
                      className="absolute inset-0 bg-[#F2A65A]/12 border border-[#F2A65A]/30 rounded-full -z-10"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="text-[#F2A65A] text-[10px] hidden sm:flex gap-2 items-center font-bold tracking-wider">
            <Activity size={12} className="animate-pulse" /> SYSTEM ACTIVE
          </div>
        </div>
      </header>

      {/* Page */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-12 pb-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-[#8FA1B8] text-[10px] tracking-[0.3em] uppercase font-bold">
        © 2026 KAVACH ENTERPRISE ANALYTICS
      </footer>
    </div>
  );
}
