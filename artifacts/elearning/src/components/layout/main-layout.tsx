import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  LogOut, 
  User, 
  LayoutDashboard, 
  CreditCard,
  GraduationCap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location.startsWith(path);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-primary">
              EduSenegal
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <Link href="/courses">
                  <span className={`font-medium transition-colors hover:text-primary ${isActive("/courses") ? "text-primary" : "text-muted-foreground"}`}>
                    Nos Cours
                  </span>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <span className={`font-medium transition-colors hover:text-primary ${isActive("/admin") ? "text-primary" : "text-muted-foreground"}`}>
                      Administration
                    </span>
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="hidden sm:flex font-medium">
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md shadow-secondary/20 rounded-full px-6 font-semibold">
                  <Link href="/register">S'inscrire</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {!isAdmin && (
                  <Button variant="outline" asChild className="hidden sm:flex border-primary/20 text-primary hover:bg-primary/5 rounded-full font-medium">
                    <Link href="/subscribe">S'abonner</Link>
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-transparent hover:border-primary/20 transition-all">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user?.nom?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">{user?.nom}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin ? (
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/admin" className="flex items-center w-full">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Tableau de bord</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/courses" className="flex items-center w-full">
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>Mes Cours</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/history" className="flex items-center w-full">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Historique & Paiements</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/profile" className="flex items-center w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>Mon Profil</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 bg-white mt-auto py-8">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-80">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-lg text-primary">EduSenegal</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} EduSenegal. L'excellence pour tous.
          </p>
        </div>
      </footer>
    </div>
  );
}
