import { Link } from "wouter";
import { Course } from "@workspace/api-client-react";
import { BookOpen, ChevronRight, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CourseCard({ course }: { course: Course }) {
  
  const difficulteColor = {
    'debutant': 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    'intermediaire': 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100',
    'avance': 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100',
  };

  const difficulteLabel = {
    'debutant': 'Débutant',
    'intermediaire': 'Intermédiaire',
    'avance': 'Avancé',
  };

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col group-hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <Badge variant="outline" className={`capitalize font-medium ${difficulteColor[course.difficulte]}`}>
            <BarChart className="w-3 h-3 mr-1" />
            {difficulteLabel[course.difficulte]}
          </Badge>
        </div>
        
        <h3 className="font-display font-bold text-xl text-slate-900 mb-2 line-clamp-2">
          {course.titre}
        </h3>
        
        <p className="text-sm font-medium text-primary mb-3">
          Chapitre: {course.chapitre}
        </p>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
          {course.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-primary group-hover:text-secondary transition-colors">
          Voir le cours <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
