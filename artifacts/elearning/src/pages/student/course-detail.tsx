import { useParams, Link } from "wouter";
import { useGetCourse, useGetExerciseSolution } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Button } from "@/components/ui/button";
import { Lock, FileText, ArrowLeft, FileQuestion, CheckCircle2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetExerciseSolutionQueryKey } from "@workspace/api-client-react";

function SolutionViewer({ exerciseId }: { exerciseId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: solution, isLoading, isError } = useGetExerciseSolution(exerciseId, {
    query: { enabled: isOpen, retry: false }
  });

  return (
    <div className="mt-4">
      {!isOpen ? (
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="text-primary border-primary/20 hover:bg-primary/5">
          Voir la solution
        </Button>
      ) : (
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 relative mt-2">
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 opacity-10">
            <CheckCircle2 className="w-24 h-24 text-emerald-600" />
          </div>
          <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5" /> Solution
          </h4>
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-emerald-200 rounded"></div>
                <div className="h-2 bg-emerald-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : isError ? (
            <p className="text-sm text-rose-600 font-medium">Erreur lors du chargement de la solution.</p>
          ) : (
            <div className="prose prose-emerald max-w-none text-sm whitespace-pre-wrap text-emerald-900">
              {solution?.contenu}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { data: course, isLoading, isError } = useGetCourse(id);

  if (isLoading) return <MainLayout><LoadingScreen /></MainLayout>;
  
  if (isError || !course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Cours introuvable</h2>
          <Button asChild className="mt-4"><Link href="/courses">Retour aux cours</Link></Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Course Header */}
      <div className="bg-slate-900 text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-slate-900 mix-blend-multiply pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour à la liste
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1">
              Chapitre: {course.chapitre}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-white/80 capitalize px-3 py-1">
              Niveau {course.difficulte}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
            {course.titre}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {course.description}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-5xl -mt-12 relative z-20 pb-24">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
          
          {!course.hasAccess ? (
            /* Locked State */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-[0.03]"></div>
              
              <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative z-10">
                <div className="absolute inset-0 rounded-full border-4 border-amber-100 animate-ping opacity-20"></div>
                <Lock className="w-10 h-10 text-amber-500" />
              </div>
              
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 relative z-10">
                Abonnement requis
              </h2>
              <p className="text-slate-600 max-w-md mb-8 text-lg relative z-10">
                Ce contenu est réservé à nos membres Premium. Abonnez-vous pour débloquer ce cours complet ainsi que tous les exercices corrigés.
              </p>
              
              <Button size="lg" asChild className="h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-primary/30 relative z-10">
                <Link href="/subscribe">S'abonner maintenant</Link>
              </Button>
            </div>
          ) : (
            /* Unlocked State */
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <FileText className="w-7 h-7 text-primary" />
                  Contenu du cours
                </h3>
                {course.pdfUrl && (
                  <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/5" asChild>
                    <a href={course.pdfUrl} target="_blank" rel="noreferrer">
                      <Download className="w-4 h-4 mr-2" /> Télécharger PDF
                    </a>
                  </Button>
                )}
              </div>
              
              <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-a:text-primary mb-16 whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                {course.contenu || "Aucun contenu texte disponible pour ce cours."}
              </div>

              {course.exercises && course.exercises.length > 0 && (
                <div className="mt-16 pt-10 border-t border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <FileQuestion className="w-7 h-7 text-secondary" />
                    Exercices d'application
                  </h3>
                  
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {course.exercises.map((exo, index) => (
                      <AccordionItem key={exo.id} value={`exo-${exo.id}`} className="bg-slate-50 border border-slate-200 rounded-2xl px-6 data-[state=open]:bg-white data-[state=open]:shadow-md transition-all">
                        <AccordionTrigger className="hover:no-underline py-6">
                          <div className="flex items-center text-left gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-bold text-lg text-slate-900">{exo.titre}</div>
                              <div className="text-sm text-slate-500 font-normal mt-1 capitalize">Niveau {exo.difficulte}</div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="pl-14">
                            <div className="text-slate-700 whitespace-pre-wrap text-base mb-6">
                              {exo.contenu}
                            </div>
                            {exo.hasSolution && (
                              <SolutionViewer exerciseId={exo.id} />
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
