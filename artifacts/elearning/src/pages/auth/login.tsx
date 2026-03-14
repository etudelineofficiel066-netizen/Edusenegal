import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginUser } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { refetchUser } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", motDePasse: "" }
  });

  const loginMutation = useLoginUser();

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate({ data }, {
      onSuccess: async (res) => {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${res.user.nom} !`,
        });
        await refetchUser(); // Ensure context gets the new user
        setLocation(res.user.role === "admin" ? "/admin" : "/courses");
      },
      onError: (err: any) => {
        toast({
          title: "Erreur de connexion",
          description: err.response?.data?.error || "Identifiants incorrects.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-[0.03] pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </Link>
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <GraduationCap className="text-white w-10 h-10" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-display font-bold tracking-tight text-slate-900">
          Bon retour parmi nous
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Connectez-vous pour accéder à vos cours
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Adresse email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="vous@exemple.com"
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive font-medium">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motDePasse" className="text-slate-700">Mot de passe</Label>
              <Input 
                id="motDePasse" 
                type="password" 
                placeholder="••••••••"
                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/20"
                {...form.register("motDePasse")}
              />
              {form.formState.errors.motDePasse && (
                <p className="text-sm text-destructive font-medium">{form.formState.errors.motDePasse.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connexion en cours...</>
              ) : "Se connecter"}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">Pas encore de compte ?</span>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" asChild className="w-full h-12 text-base font-medium rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
              <Link href="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
