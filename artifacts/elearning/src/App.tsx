import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";

// Pages
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import StudentDashboard from "@/pages/student/dashboard";
import CourseDetail from "@/pages/student/course-detail";
import Subscribe from "@/pages/student/subscribe";
import History from "@/pages/student/history";
import Profile from "@/pages/student/profile";
import AdminDashboard from "@/pages/admin/dashboard";

const queryClient = new QueryClient();

// Route guards
function ProtectedRoute({ component: Component, requireAdmin = false, ...rest }: any) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  
  if (isLoading) return null; // Handled by inner page or blank while auth resolves
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (requireAdmin && !isAdmin) return <Redirect to="/courses" />;
  
  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/courses">
        {() => <ProtectedRoute component={StudentDashboard} />}
      </Route>
      <Route path="/courses/:id">
        {() => <ProtectedRoute component={CourseDetail} />}
      </Route>
      <Route path="/subscribe">
        {() => <ProtectedRoute component={Subscribe} />}
      </Route>
      <Route path="/history">
        {() => <ProtectedRoute component={History} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} requireAdmin={true} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
