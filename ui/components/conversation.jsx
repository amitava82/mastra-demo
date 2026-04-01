import { Card, Box } from "@mui/material";
import { useCallback } from "react";


export const Conversation = ({ children, ...rest}) => {
    return (
        <Card variant="outlined" sx={{ mb: 2 }} {...rest}>
            {children}
        </Card>
    );
}