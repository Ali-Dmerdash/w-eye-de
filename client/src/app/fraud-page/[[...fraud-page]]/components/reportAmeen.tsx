import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ReportAmeen = () => {
  const [expanded, setExpanded] = useState(false);

  const shortText = "This is the beginning of the content.";
  const fullText =
    "This is the beginning of the content. Here is the rest of the text that appears when the card is expanded. It can contain more details, explanations, or even additional links.";

  return (
    <div className="flex items-start justify-center flex-wrap">
      <Card className="w-full max-w-md bg-primary text-white">
        <CardHeader className="text-center">
          <h2 className="text-lg font-semibold">Ameen Report</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{expanded ? fullText : shortText}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => setExpanded(!expanded)}
            className="bg-accent hover:bg-blue-700 text-white"
          >
            {expanded ? "Read Less" : "Generate more"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default ReportAmeen;
