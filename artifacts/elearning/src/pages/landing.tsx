import { Link, Redirect } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Smartphone, Star, ArrowRight } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function Landing() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) return <MainLayout><LoadingScreen /></MainLayout>;
  
  if (isAuthenticated) {
    return <Redirect to={isAdmin ? "/admin" : "/courses"} />;
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-pattern pointer-events-none"></div>
        
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
        <div className="absolute top-40 right-60 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/15 text-secondary-foreground font-medium text-sm mb-6 border border-secondary/20 shadow-sm">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span>La 1ère plateforme éducative au Sénégal</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] mb-6">
                Réussissez vos études avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600">EduSenegal</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                Accédez à des cours complets, des exercices corrigés et des ressources pédagogiques de qualité, où que vous soyez.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="h-14 px-8 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <Link href="/register">Commencer maintenant <ArrowRight className="ml-2 w-5 h-5"/></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-base font-semibold border-slate-300 hover:bg-slate-50">
                  <Link href="/login">J'ai déjà un compte</Link>
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Paiement par Wave / OM</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>100% en ligne</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:ml-auto w-full max-w-lg"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border-8 border-white/50 relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* landing page hero scenic modern classroom with students */}
                <img 
                  src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
                  alt="Étudiants apprenant" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-2xl text-white">
                  <p className="font-display font-bold text-2xl mb-1">"Une méthode qui marche"</p>
                  <p className="text-white/80 text-sm">Déjà +5000 étudiants inscrits</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-lg text-slate-600">
              Notre plateforme a été pensée pour être simple, intuitive et efficace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8 text-primary" />,
                title: "Cours Structurés",
                desc: "Des cours détaillés, classés par chapitre et par niveau de difficulté pour une progression logique."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-secondary" />,
                title: "Exercices & Solutions",
                desc: "Pratiquez avec nos exercices ciblés et vérifiez votre compréhension avec nos corrections détaillées."
              },
              {
                icon: <Smartphone className="w-8 h-8 text-emerald-500" />,
                title: "Accès Simple & Rapide",
                desc: "Abonnez-vous facilement via Wave ou Orange Money et accédez à vos contenus sur téléphone ou PC."
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Des tarifs accessibles
            </h2>
            <p className="text-lg text-slate-600">
              Choisissez l'abonnement qui vous convient. Payez en toute simplicité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { duration: "1 mois", price: "1000", popular: false },
              { duration: "3 mois", price: "2000", popular: true, tag: "Économisez 33%" },
              { duration: "9 mois", price: "3000", popular: false, tag: "Meilleur rapport" },
            ].map((plan, i) => (
              <div 
                key={i}
                className={`relative rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 ${
                  plan.popular 
                    ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30 scale-105 border-none z-10" 
                    : "bg-white text-slate-900 border border-slate-200 shadow-lg hover:border-primary/30"
                }`}
              >
                {plan.tag && (
                  <span className={`absolute -top-4 px-4 py-1 rounded-full text-xs font-bold ${plan.popular ? 'bg-secondary text-secondary-foreground shadow-sm' : 'bg-primary/10 text-primary'}`}>
                    {plan.tag}
                  </span>
                )}
                
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-primary-foreground/90' : 'text-slate-500'}`}>
                  Pass {plan.duration}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-8">
                  <span className="text-5xl font-display font-bold">{plan.price}</span>
                  <span className={`text-lg font-medium ${plan.popular ? 'text-primary-foreground/80' : 'text-slate-500'}`}>FCFA</span>
                </div>
                
                <ul className="space-y-4 mb-8 w-full">
                  {['Accès illimité aux cours', 'Tous les exercices corrigés', 'Téléchargement PDF', 'Support prioritaire'].map((feat, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-secondary' : 'text-primary'}`} />
                      <span className={plan.popular ? 'text-primary-foreground/90' : 'text-slate-600'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className={`w-full h-12 rounded-full font-bold mt-auto ${
                    plan.popular 
                      ? 'bg-white text-primary hover:bg-slate-100' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Link href="/register">Choisir ce plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
