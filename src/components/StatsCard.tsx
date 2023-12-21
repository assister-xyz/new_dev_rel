import { StatsCardPropsInterface } from "@/types/componentProps";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactElement } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { CardHeader } from "@/components/ui/card";
import arrowRiseImage from "../../public/logos/arrowRise.svg";

export default function StatsCard({ statsName, statsIconPath, value, percentChange }: StatsCardPropsInterface): ReactElement {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Typography variant='h6'>{statsName}</Typography>
        <Image src={statsIconPath} width={24} height={24} alt='folder icon' quality={100} />
      </CardHeader>
      <CardContent>
        <Box className='flex items-center justify-between' paddingY={"10px"}>
          <Typography variant='h3'>{value}</Typography>
          {percentChange !== "none" ? (
            <Box className='flex items-center'>
              <p className={`mr-1 text-[14px]}`}>{percentChange}</p>
              <Image src={arrowRiseImage} width={16} height={16} alt={"arrowRiseImage"} />
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
