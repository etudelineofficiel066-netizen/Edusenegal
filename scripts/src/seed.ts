import { db } from "@workspace/db";
import { usersTable, coursesTable, exercisesTable, solutionsTable } from "@workspace/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash("etudiant123", 10);

  const existingAdmin = await db.select().from(usersTable).limit(1);
  if (existingAdmin.length > 0) {
    console.log("Database already seeded, skipping.");
    process.exit(0);
  }

  const [admin] = await db.insert(usersTable).values({
    nom: "Administrateur",
    email: "maodok59@gmail.com",
    motDePasseHash: adminHash,
    role: "admin",
  }).returning();

  await db.insert(usersTable).values({
    nom: "Amadou Diallo",
    email: "etudiant@edusenegal.sn",
    motDePasseHash: studentHash,
    role: "etudiant",
  });

  console.log(`Admin created: ${admin.email}`);

  const [math1] = await db.insert(coursesTable).values({
    titre: "Introduction aux Équations du Premier Degré",
    description: "Apprenez à résoudre des équations simples à une inconnue",
    contenu: `# Équations du Premier Degré

Une équation du premier degré est de la forme ax + b = 0.

## Méthode de résolution

1. Isoler l'inconnue x d'un côté de l'équation
2. Effectuer les opérations inverses des deux côtés

### Exemple 1
Résoudre : 2x + 4 = 10
- 2x = 10 - 4
- 2x = 6
- x = 3

### Exemple 2
Résoudre : 3x - 9 = 0
- 3x = 9
- x = 3`,
    chapitre: "Chapitre 1 - Algèbre",
    difficulte: "debutant",
  }).returning();

  const [math2] = await db.insert(coursesTable).values({
    titre: "Fonctions Linéaires et Affines",
    description: "Étude des fonctions f(x) = ax + b et leurs représentations graphiques",
    contenu: `# Fonctions Linéaires et Affines

## Fonction Linéaire
f(x) = ax (passe par l'origine)

## Fonction Affine
f(x) = ax + b (droite quelconque)

## Tracer une droite
1. Calculer f(0) = b (ordonnée à l'origine)
2. Calculer f(1) = a + b
3. Tracer la droite passant par ces deux points`,
    chapitre: "Chapitre 2 - Fonctions",
    difficulte: "intermediaire",
  }).returning();

  const [phys1] = await db.insert(coursesTable).values({
    titre: "Les Forces et le Mouvement",
    description: "Comprendre les lois de Newton et l'étude des forces",
    contenu: `# Les Forces et le Mouvement

## Les 3 Lois de Newton

### Première Loi (Inertie)
Un objet au repos reste au repos et un objet en mouvement reste en mouvement uniforme sauf si une force extérieure agit sur lui.

### Deuxième Loi (Fondamentale)
F = m × a
La force est égale à la masse multipliée par l'accélération.

### Troisième Loi (Action-Réaction)
Pour chaque action, il y a une réaction égale et opposée.`,
    chapitre: "Chapitre 1 - Mécanique",
    difficulte: "debutant",
  }).returning();

  console.log("Courses created");

  const [ex1] = await db.insert(exercisesTable).values({
    coursId: math1.id,
    titre: "Exercice 1 : Résolution simple",
    contenu: "Résolvez l'équation suivante : 5x + 10 = 30",
    difficulte: "debutant",
  }).returning();

  const [ex2] = await db.insert(exercisesTable).values({
    coursId: math1.id,
    titre: "Exercice 2 : Équation avec fractions",
    contenu: "Résolvez : x/2 + 3 = 7",
    difficulte: "intermediaire",
  }).returning();

  const [ex3] = await db.insert(exercisesTable).values({
    coursId: math2.id,
    titre: "Exercice 1 : Tracer une droite",
    contenu: "Tracez la droite d'équation f(x) = 2x + 1. Donnez les coordonnées de deux points.",
    difficulte: "debutant",
  }).returning();

  const [ex4] = await db.insert(exercisesTable).values({
    coursId: phys1.id,
    titre: "Exercice 1 : Calcul de force",
    contenu: "Une voiture de masse 1200 kg accélère de 0 à 100 km/h en 10 secondes. Calculez la force exercée.",
    difficulte: "intermediaire",
  }).returning();

  console.log("Exercises created");

  await db.insert(solutionsTable).values({
    exerciseId: ex1.id,
    contenu: `**Solution :**
5x + 10 = 30
5x = 30 - 10
5x = 20
x = 20/5
**x = 4**

Vérification : 5(4) + 10 = 20 + 10 = 30 ✓`,
  });

  await db.insert(solutionsTable).values({
    exerciseId: ex2.id,
    contenu: `**Solution :**
x/2 + 3 = 7
x/2 = 7 - 3
x/2 = 4
x = 4 × 2
**x = 8**

Vérification : 8/2 + 3 = 4 + 3 = 7 ✓`,
  });

  await db.insert(solutionsTable).values({
    exerciseId: ex3.id,
    contenu: `**Solution :**
Pour f(x) = 2x + 1 :

Point 1 : x = 0 → f(0) = 2(0) + 1 = **1** → Coordonnées : (0, 1)
Point 2 : x = 1 → f(1) = 2(1) + 1 = **3** → Coordonnées : (1, 3)

Tracer la droite passant par (0, 1) et (1, 3).`,
  });

  await db.insert(solutionsTable).values({
    exerciseId: ex4.id,
    contenu: `**Solution :**
Données : m = 1200 kg, v₀ = 0, v = 100 km/h = 27.78 m/s, t = 10 s

Accélération : a = (v - v₀) / t = 27.78 / 10 = **2.78 m/s²**

Deuxième loi de Newton : F = m × a
F = 1200 × 2.78
**F = 3336 N ≈ 3.34 kN**`,
  });

  console.log("Solutions created");
  console.log("✅ Database seeded successfully!");
  console.log("Admin login: maodok59@gmail.com / admin123");
  console.log("Student login: etudiant@edusenegal.sn / etudiant123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
