import HairAnalyzer from "../components/HairAnalyzer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Encuentra tu extensión perfecta
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnología de IA para analizar tu tono de cabello y recomendarte
              las mejores extensiones
            </p>
          </div>

          <HairAnalyzer />
        </div>
      </div>
    </main>
  );
}
