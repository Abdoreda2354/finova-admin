import { LayoutDashboard, Users, ShieldCheck } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useEffect, useRef } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Admins", url: "/admins", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state, setOpen, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on outside click — mobile only
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, setOpen]);

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} ref={sidebarRef}>
      <SidebarContent>
        {/* Logo — hidden when desktop-collapsed */}
        <div className="px-4 py-5">
          {!collapsed && (
            <h1 className="text-lg font-bold text-sidebar-primary-foreground">
              Finova
            </h1>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground"
onMouseDown={() => {
  if (isMobile) {
    console.log("helllllllllo");
    
    setOpen(false)};
}}                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}