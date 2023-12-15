import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ReactElement } from "react";
import { Typography, Box } from "@mui/material";
import { navigationHandler } from "@/utils/nav";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { capitalizeFirstLetter } from "@/utils/general";

export function UserNavigation({ targetClient }: { targetClient: string }): ReactElement {
  const router: AppRouterInstance = useRouter();

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>
              {targetClient
                .split(" ")
                .map((item) => item[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <Box className='flex flex-col space-y-1'>
            <Typography variant='h6'>{capitalizeFirstLetter(targetClient)}</Typography>
          </Box>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Typography
          paddingLeft={"10px"}
          paddingY={"5px"}
          onClick={() => {
            navigationHandler("/console/support", router);
          }}
          sx={{
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#F1F5F9",
            },
          }}
        >
          Support
        </Typography>
        <DropdownMenuSeparator />
        <Typography
          paddingLeft={"10px"}
          paddingY={"5px"}
          onClick={() => {
            navigationHandler("/", router);
            localStorage.removeItem("client");
          }}
          sx={{
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#F1F5F9",
            },
          }}
        >
          Log out
        </Typography>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
