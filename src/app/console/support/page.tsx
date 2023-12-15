import {Box} from "@mui/material";
import React, { ReactElement } from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TerminalIcon} from "lucide-react";

export default function SupportPage(): ReactElement {
  return (
      <Box className='flex justify-center items-center min-h-[600px] '>
        <Alert className='w-[90%] md:w-[320px]'>
          <TerminalIcon className="h-4 w-4" />
          <AlertTitle>Let us know if anything missed.</AlertTitle>
          <AlertDescription>
            Mail: <a href='mailto:Dima.Dimenko@assisterr.xyz' className='font-semibold hover:text-[#FF6B00]'>Dima.Dimenko@assisterr.xyz</a>
            <br/>
            Telegram: <a href='https://t.me/Dimenko' className='font-semibold hover:text-[#FF6B00]'>@Dimenko</a>
          </AlertDescription>
        </Alert>
      </Box>
  );
}
