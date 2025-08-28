import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
      {/* Animated Icon */}
      <div className="flex flex-col items-center mb-8 animate-bounce">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10">
          <AlertTriangle className="w-10 h-10 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-6 text-center">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
          onClick={() => navigate("/")}
        >
          <Home className="w-5 h-5 mr-2" />
          Go Back Home
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="border-primary/40 hover:bg-primary/10 transition"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>

      {/* Subtle Info */}
      <p className="mt-8 text-sm text-muted-foreground">
        If you believe this is an error, please{" "}
        <a
          href="mailto:support@prism.com"
          className="text-primary hover:underline"
        >
          contact support
        </a>
        .
      </p>
    </div>
  );
};

export default NotFound;
