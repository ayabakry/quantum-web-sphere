
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';

const navigationLinks = [
  { name: 'Home', path: '/' },
  { name: 'Videos', path: '/videos' },
  { name: 'Tutorials', path: '/tutorials' },
  { name: 'Patents', path: '/patents' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = React.useState(false);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    toast({
      title: "Admin mode activated",
      description: "You can now access the admin dashboard",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            {navigationLinks.map((link) => (
              <NavigationMenuItem key={link.path}>
                <Link to={link.path}>
                  <NavigationMenuLink 
                    className={cn(
                      "inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    )}
                  >
                    {link.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button variant="outline" asChild>
              <Link to="/admin">Admin Dashboard</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={handleAdminLogin}>
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
