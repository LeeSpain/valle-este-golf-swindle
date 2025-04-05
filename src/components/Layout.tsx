
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flag, Users, Calendar, Award, List, LayoutDashboard, Image, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isAdmin?: boolean;
}

const NavItem = ({ to, icon, label, isActive, isAdmin = false }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-2 mb-1.5 transition-all duration-200',
          isActive ? 'bg-golf-green text-white hover:bg-golf-green-dark' : 'hover:bg-golf-green/10',
          isAdmin ? 'border-l-4 border-sand-beige' : ''
        )}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </Button>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  console.log("Layout rendering with user:", user);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-golf-green text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Flag className="h-6 w-6" />
            <h1 className="text-xl font-bold">Karen's Bar Golf Swindle</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Link to="/admin/settings">
                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-golf-green hidden md:flex">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </Link>
            ) : null}
            {isAdmin ? (
              <span className="bg-sand-beige text-golf-green px-2 py-1 rounded-full text-sm font-semibold shadow-sm hidden md:inline-block">
                Admin
              </span>
            ) : (
              <Link to="/admin" className="hidden md:block">
                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-golf-green">
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </Link>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full hover:bg-white/20" size="sm">
                    <Avatar className="h-8 w-8 border-2 border-white/30">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random`} />
                      <AvatarFallback className="bg-golf-green-dark text-white">{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-1" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-golf-green">
                  Login
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:bg-white/20"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 container mx-auto mt-4 px-4 md:px-0">
        <aside className={`${mobileMenuOpen ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm' : 'hidden'} md:block md:static md:bg-transparent md:w-64 md:mr-8`}>
          <nav className={`${mobileMenuOpen ? 'h-full w-3/4 max-w-xs bg-white dark:bg-gray-800 p-4 shadow-2xl animate-slide-in' : 'space-y-1'} md:h-auto md:w-auto md:bg-transparent md:shadow-none md:p-0`}>
            <div className="md:hidden flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-golf-green">Menu</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <NavItem 
              to="/" 
              icon={<Calendar className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={location.pathname === '/'} 
            />
            <NavItem 
              to="/leaderboard" 
              icon={<Award className="h-5 w-5" />} 
              label="Leaderboard" 
              isActive={location.pathname === '/leaderboard'} 
            />
            <NavItem 
              to="/photos" 
              icon={<Image className="h-5 w-5" />} 
              label="Photo Wall" 
              isActive={location.pathname === '/photos'} 
            />
            <NavItem 
              to="/help" 
              icon={<HelpCircle className="h-5 w-5" />} 
              label="Help & FAQ" 
              isActive={location.pathname === '/help'} 
            />
            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin Area
                  </p>
                </div>
                <NavItem 
                  to="/admin" 
                  icon={<LayoutDashboard className="h-5 w-5" />} 
                  label="Admin Dashboard" 
                  isActive={location.pathname === '/admin'} 
                  isAdmin
                />
                <NavItem 
                  to="/admin/players" 
                  icon={<Users className="h-5 w-5" />} 
                  label="Players" 
                  isActive={location.pathname === '/admin/players'} 
                  isAdmin
                />
                <NavItem 
                  to="/admin/games" 
                  icon={<Calendar className="h-5 w-5" />} 
                  label="Games" 
                  isActive={location.pathname === '/admin/games'} 
                  isAdmin
                />
                <NavItem 
                  to="/admin/scores" 
                  icon={<List className="h-5 w-5" />} 
                  label="Scores" 
                  isActive={location.pathname === '/admin/scores'} 
                  isAdmin
                />
                <NavItem 
                  to="/admin/settings" 
                  icon={<Settings className="h-5 w-5" />} 
                  label="Settings" 
                  isActive={location.pathname === '/admin/settings'} 
                  isAdmin
                />
              </>
            )}
          </nav>
        </aside>
        
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      
      <footer className="bg-golf-green-dark text-white py-6 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Flag className="h-5 w-5" />
            <span className="font-semibold">Karen's Bar Golf Swindle</span>
          </div>
          <p className="text-sm opacity-80">&copy; 2025 Karen's Bar Golf Swindle. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-30">
        <div className="flex justify-around p-2">
          <Link to="/" className="flex flex-col items-center p-2">
            <Calendar className={`h-6 w-6 ${location.pathname === '/' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center p-2">
            <Award className={`h-6 w-6 ${location.pathname === '/leaderboard' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">Leaderboard</span>
          </Link>
          <Link to="/photos" className="flex flex-col items-center p-2">
            <Image className={`h-6 w-6 ${location.pathname === '/photos' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">Photos</span>
          </Link>
          <Link to="/help" className="flex flex-col items-center p-2">
            <HelpCircle className={`h-6 w-6 ${location.pathname === '/help' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs mt-1">Help</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex flex-col items-center p-2">
              <LayoutDashboard className={`h-6 w-6 ${location.pathname.startsWith('/admin') ? 'text-golf-green' : 'text-gray-500'}`} />
              <span className="text-xs mt-1">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
