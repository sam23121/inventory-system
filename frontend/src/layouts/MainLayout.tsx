import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  FileText,
  Package,
  ArrowLeftRight,
  Users,
  Settings,
  LogOut,
  Menu,
  Calendar,
  ChevronDown,
  ChevronRight,
  Globe2,
  NotebookPen,
  Skull,
  Baby,
  HeartHandshake,
} from 'lucide-react';
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/config';

const navigation = [
  { 
    name: 'dashboard', 
    href: '/', 
    icon: LayoutDashboard 
  },
  {
    name: 'admin',
    icon: Package,
    children: [
      { name: 'documents', href: '/documents', icon: FileText },
      { name: 'items', href: '/items', icon: Package },
      // { name: 'transactions', href: '/transactions', icon: ArrowLeftRight },
      { name: 'users', href: '/users', icon: Users },
      { name: 'schedule', href: '/schedule', icon: Calendar },
    ]
  },
  {
    name: 'register',
    icon: NotebookPen,
    children: [
      { name: 'member', href: '/members', icon: Users },
      { name: 'baptism', href: '/baptisms', icon: Baby },
      { name: 'burial', href: '/burials', icon: Skull },
      { name: 'marriage', href: '/marriages', icon: HeartHandshake },
    ]
  },
  {
    name:'schedule',
    icon: Calendar,
    children: [
      { name: 'events', href: '/events', icon: Calendar },
      { name: 'appointments', href: '/appointments', icon: Calendar },
    ]
  }
];

const MainLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['Crud']); // Initialize with Crud expanded
  const { t } = useTranslation();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold">{t('main.title')}</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            if (item.children) {
              const isExpanded = expandedSections.includes(item.name);
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={cn(
                      "w-full flex items-center px-4 py-2 text-sm font-medium rounded-md",
                      "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {t("navigation." + item.name)}
                    {isExpanded ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={cn(
                              "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                              location.pathname === child.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <ChildIcon className="mr-3 h-5 w-5" />
                            {t("navigation." + child.name)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  location.pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {t("navigation." + item.name)}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-col min-h-screen",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => i18n.changeLanguage(i18n.language === "en" ? "am" : "en")}
              className="flex items-center gap-2"
            >
              <Globe2 className="h-4 w-4" />
              <span>{i18n.language === "en" ? "አማርኛ" : "English"}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile_picture} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {t('main.title')}
            </p>
            <div className="flex gap-4">
              <Link
                to="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;