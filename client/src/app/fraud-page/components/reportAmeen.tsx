"use client";
import { useState } from "react";
import fraudData from "../fraudData.json"; // Import the fraud data JSON file directly
import { Card, CardContent, CardFooter, CardHeader } from "@/components/card";
import { Button } from "@/components/button";

const ReportAmeen = () => {
  const [expanded, setExpanded] = useState(false);

  // Extract analysis data from the imported JSON
  const { cause, recommendation } = fraudData.analysis;

  // Short and full text based on the analysis data
  const shortText = `${cause}`;
  const fullText = `${cause} <br /> ${recommendation}`; // Add line break between cause and recommendation

  return (
    <div className="flex items-start justify-center flex-wrap ">
      <Card className="w-full max-w-md bg-primary text-white border-none">
        <CardHeader className="text-center">
          <h2 className="text-lg font-semibold">Ameen Report</h2>
        </CardHeader>
        <CardContent>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: expanded ? fullText : shortText,
            }}
          />
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
