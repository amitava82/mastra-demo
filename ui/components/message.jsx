import { Typography, Stack, } from '@mui/material';

export const Message = ({ className, from, ...props }) => (
  <Stack direction="row">
    <Typography fontWeight={600}>{from}:&nbsp;</Typography>
    <div
      {...props}
    />
  </Stack>
);

export const MessageContent = ({
   children,
   className,
   variant,
   ...props
 }) => (
  <div
    {...props}
  >
    {children}
  </div>
);
