import { Chip, Box } from "@mui/material";
import { isValidElement } from "react";

export const Tool = ({ className, ...props }) => (
  <Box
    {...props}
  />
);

const getStatusBadge = (status) => {
  const labels = {
    "input-streaming": "Pending",
    "input-available": "Running",
    "output-available": "Completed",
    "output-error": "Error",
  };

  return (
    <Chip label={labels[status]} />
  );
};

export const ToolHeader = ({
                             className,
                             title,
                             type,
                             state,
                             ...props
                           }) => (
  <Box

    {...props}
  >
    <div className="flex items-center gap-2">
      <span className="font-medium text-sm">
        {title ?? type.split("-").slice(1).join("-")}
      </span>
      {getStatusBadge(state)}
    </div>
  </Box>
);

export const ToolContent = ({ className, ...props }) => (
  <Box
    {...props}
  />
);


export const ToolInput = ({ className, input, ...props }) => (
  <div {...props}>
    <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </h4>
    <div className="rounded-md bg-muted/50">
      <code>{JSON.stringify(input, null, 2)}</code>
    </div>
  </div>
);
export const ToolOutput = ({
     className,
     output,
     errorText,
     language = "json",
     ...props
   }) => {
  if (!(output || errorText)) {
    return null;
  }

  let Output = <div>{output}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    Output = (
      <code>{JSON.stringify(output, null, 2)}</code>
    );
  } else if (typeof output === "string") {
    Output = <code>{output}</code>;
  }

  return (
    <div {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? "Error" : "Result"}
      </h4>
      <div
      >
        {errorText && <div>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};