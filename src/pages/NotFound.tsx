
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="text-quantum-purple font-bold text-7xl">404</div>
          <h1 className="text-3xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            The page you are looking for doesn't exist or has been moved. Please check the URL or navigate using the links below.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
