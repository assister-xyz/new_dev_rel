import { StatsCardPropsInterface } from "@/types/componentProps";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { ReactElement } from "react";
import {Card, CardContent, CardTitle} from "./ui/card";
import {CardHeader} from "@/components/ui/card";
import arrowRiseImage from "../../public/logos/arrowRise.svg";

export default function StatsCard({ statsName, statsIcon, value, percentChange }: StatsCardPropsInterface): ReactElement {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {statsName}
        </CardTitle>
        <Image src={statsIcon} width={25} height={25} alt='folder icon' />
      </CardHeader>
      <CardContent>
        <Box className='flex items-center justify-between'>
          <h1 className='text-2xl'>{value}</h1>
          {
            percentChange &&
            <Box className='flex items-center'>
              <p className={`mr-1 text-[14px]}`}>{percentChange}</p>
              <Image src={arrowRiseImage} width={16} height={16} alt={"arrowRiseImage"} />
            </Box>
          }
        </Box>
      </CardContent>
    </Card>
  );
}
