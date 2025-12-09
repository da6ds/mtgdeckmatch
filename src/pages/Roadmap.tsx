import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Phase {
  id: string;
  name: string;
  status: "complete" | "in-progress" | "planned";
  description: string;
}

interface RoadmapData {
  lastUpdated: string;
  phases: Phase[];
}

const statusConfig = {
  complete: {
    icon: CheckCircle2,
    label: "Complete",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
  },
  "in-progress": {
    icon: Loader2,
    label: "In Progress",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    animate: true,
  },
  planned: {
    icon: Circle,
    label: "Planned",
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    border: "border-gray-400/30",
  },
};

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  useEffect(() => {
    fetch("/roadmap.json")
      .then((res) => res.json())
      .then(setRoadmap)
      .catch(console.error);
  }, []);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Roadmap</h1>
          <p className="text-gray-400">
            What we're building to help you discover Magic
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-700" />

          {/* Phases */}
          <div className="space-y-6">
            {roadmap.phases.map((phase) => {
              const config = statusConfig[phase.status];
              const Icon = config.icon;

              return (
                <div key={phase.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${config.bg} border ${config.border}`}
                  >
                    <Icon
                      className={`w-5 h-5 ${config.color} ${
                        config.animate ? "animate-spin" : ""
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">
                        {phase.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{phase.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          Last updated:{" "}
          {new Date(roadmap.lastUpdated).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}