import { Progress } from "@/components/ui/progress";
import { FaFlagCheckered } from "react-icons/fa"; // winning icon

const ProgressSection = ({ count, estimatedDaysToGoal }) => {
  const progress = estimatedDaysToGoal
    ? Math.min((count / estimatedDaysToGoal) * 100, 100)
    : 0;

  return (
    <div className="mt-4 text-center">
      <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
      <div className="flex items-center justify-center gap-2">
        <Progress value={progress} className="w-64 h-4" />
        {count >= estimatedDaysToGoal && (
          <FaFlagCheckered className="text-green-500 text-xl animate-bounce" />
        )}
      </div>
      <p className="text-sm mt-1">
        {count}/{estimatedDaysToGoal} days logged
      </p>
    </div>
  );
};

export default ProgressSection;
