import { greenLightColor, redLightColor } from "@/themes/colors";
import { Box } from "@mui/material";
import React, { ReactElement } from "react";
import { FileCardPropsInterface } from "@/types/componentProps";
import { CardHeader, Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

export default function FileCard({ client, fileName, id, createdDate, deleteTargetFileHandler }: FileCardPropsInterface): ReactElement {
  const status = "live";
  return (
    <Card>
      <CardHeader className='space-y-0 pb-2'>
        <CardTitle className='flex justify-between text-sm font-medium'>
          {fileName}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Settings className='h-4 w-4 cursor-pointer' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  deleteTargetFileHandler(id, client);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>By {client}</CardDescription>
      </CardHeader>
      <CardContent>
        <Box className='flex items-center justify-between'>
          {/*FILE TYPE ICON*/}
          <Box className='rounded-full bg-[#D9D9D9] p-1'>{/*<Image src={dataSourceIcons[icon]} alt={icon} width={32} height={32} />*/}</Box>
          {/*---------------------*/}
          <Box className='flex-1 px-3'>
            <p>Description</p>
            <p className='text-muted-foreground'>32 MB</p>
          </Box>
          <li
            style={{
              color: status === "live" ? greenLightColor : redLightColor,
            }}
          >
            {status}
          </li>
        </Box>
      </CardContent>
    </Card>
  );
}
