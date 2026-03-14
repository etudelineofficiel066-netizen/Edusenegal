import { useState } from "react";
import { useListCourses } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { CourseCard } from "@/components/ui/course-card";
import { Input } from "@/components/ui/input";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Search, SlidersHorizontal, BookX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentDashboard() {
  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState("tous");

  // Using a debounced search value would be better, but standard state is fine for now
  const { data: courses, isLoading } = useListCourses({
    search: search || undefined,
    chapter: chapter !== "tous" ? chapter : undefined
  });

  const uniqueChapters = Array.from(new Set(courses?.map(c => c.chapitre) || []));

  return (
    <MainLayout>
      <div className="bg-slate-50 border-b border-slate-200 pt-10 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Catalogue de formations
          </h1>
          <p className="text-slate-600 max-w-2xl text-lg mb-8">
            Explorez notre bibliothèque de cours conçus par des experts pour vous aider à atteindre vos objectifs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Rechercher un cours..." 
                className="pl-12 h-14 rounded-xl text-base bg-white border-slate-200 shadow-sm focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="sm:w-64">
              <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger className="h-14 rounded-xl text-base bg-white border-slate-200 shadow-sm">
                  <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Tous les chapitres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les chapitres</SelectItem>
                  {uniqueChapters.map(chap => (
                    <SelectItem key={chap} value={chap}>{chap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-10 mb-20 relative z-10">
        {isLoading ? (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <LoadingScreen />
          </div>
        ) : courses?.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <BookX className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun cours trouvé</h3>
            <p className="text-slate-500 max-w-sm">
              Essayez de modifier vos filtres de recherche pour trouver ce que vous cherchez.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses?.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
