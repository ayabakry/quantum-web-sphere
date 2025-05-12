
import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <Logo size="sm" />
        <div className="flex gap-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link to="/videos" className="text-sm text-muted-foreground hover:text-foreground">
            Videos
          </Link>
          <Link to="/tutorials" className="text-sm text-muted-foreground hover:text-foreground">
            Tutorials
          </Link>
          <Link to="/patents" className="text-sm text-muted-foreground hover:text-foreground">
            Patents
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} QRAM. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
