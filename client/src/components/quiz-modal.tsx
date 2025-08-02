import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, ArrowLeft, ArrowRight, X } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz?: {
    title: string;
    questions: QuizQuestion[];
  };
}

export function QuizModal({ isOpen, onClose, quiz }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === index.toString()) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-500 rounded-xl flex items-center justify-center">
                <HelpCircle className="text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg">{quiz.title}</DialogTitle>
                {!showResults && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Question {currentQuestion + 1} of {totalQuestions}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {showResults ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Quiz Complete!
              </h3>
              <div className="text-4xl font-bold text-primary mb-4">
                {calculateScore()}%
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You got {Object.values(selectedAnswers).filter((answer, index) => 
                  answer === index.toString()
                ).length} out of {totalQuestions} questions correct.
              </p>
              <div className="flex space-x-3 justify-center">
                <Button onClick={resetQuiz} variant="outline">
                  Retake Quiz
                </Button>
                <Button onClick={onClose}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {question.question}
              </h4>
              
              <RadioGroup 
                value={selectedAnswers[currentQuestion] || ""} 
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`}
                      className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="ghost">
                  Skip
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQuestion]}
                  className="flex items-center space-x-2"
                >
                  <span>{currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
                  {currentQuestion < totalQuestions - 1 && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
