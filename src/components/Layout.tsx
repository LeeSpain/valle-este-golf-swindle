
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flag, Users, Calendar, Award, List, LayoutDashboard, Image, Settings, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isAdmin?: boolean;
}

const NavItem = ({ to, icon, label, isActive, isAdmin = false }: NavItemProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-2 mb-1',
          isActive ? 'bg-golf-green text-white hover:bg-golf-green-dark' : '',
          isAdmin ? 'border-l-4 border-sand-beige' : ''
        )}
      >
        {icon}
        <span>{label}</span>
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
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-golf-green text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Flag className="h-6 w-6" />
            <h1 className="text-xl font-bold">Karen's Bar Golf Swindle</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/settings">
              <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-golf-green">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </Link>
            {isAdmin ? (
              <span className="bg-sand-beige text-golf-green px-2 py-1 rounded-full text-sm font-semibold">
                Admin
              </span>
            ) : (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-golf-green">
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 container mx-auto mt-4 px-4 md:px-0">
        <aside className="hidden md:block w-64 mr-8">
          <nav className="space-y-1">
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
              to="/settings" 
              icon={<Settings className="h-5 w-5" />} 
              label="Settings" 
              isActive={location.pathname === '/settings'} 
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
              </>
            )}
          </nav>
        </aside>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      <footer className="bg-golf-green-dark text-white p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 Karen's Bar Golf Swindle. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around p-2">
          <Link to="/" className="flex flex-col items-center p-2">
            <Calendar className={`h-6 w-6 ${location.pathname === '/' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center p-2">
            <Award className={`h-6 w-6 ${location.pathname === '/leaderboard' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs">Leaderboard</span>
          </Link>
          <Link to="/photos" className="flex flex-col items-center p-2">
            <Image className={`h-6 w-6 ${location.pathname === '/photos' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs">Photos</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center p-2">
            <Settings className={`h-6 w-6 ${location.pathname === '/settings' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs">Settings</span>
          </Link>
          <Link to="/help" className="flex flex-col items-center p-2">
            <HelpCircle className={`h-6 w-6 ${location.pathname === '/help' ? 'text-golf-green' : 'text-gray-500'}`} />
            <span className="text-xs">Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layout;
