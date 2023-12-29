import React, { ReactElement } from "react";
import { CardHeader, Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { FilePlus } from "lucide-react";
import {Box} from "@mui/material";
import Image from "next/image";

export default function AddFileCard({ fileName, uploadAndEmbedFileHandler, selectFileHandler }: any): ReactElement {
  const status = "live";
  return (
    <Card>
      <CardHeader className='space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Add new source</CardTitle>
        <CardDescription>Select a file to add</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-row justify-between items-center'>
        <input id='file-upload' className='hidden' multiple type='file' onChange={selectFileHandler} />
        {fileName && <p>{fileName}</p>}
        {fileName ? (
          <Button onClick={uploadAndEmbedFileHandler} variant={'outline'}>Import</Button>
        ) : (
          <label htmlFor='file-upload'>
            <FilePlus />
          </label>
        )}
      </CardContent>
    </Card>
    // <Box className={'flex'}>
    //   <Box className={'w-1/2 flex justify-center items-center'}>
    //     <label htmlFor='file-upload'>
    //       <Image className={''} src={'/logos/import_file.png'} width={80} height={80} alt='image upload'/>
    //     </label>
    //   </Box>
    //   <Box className={'w-1/2'}>
    //     <h1 className={'mb-1 font-semibold text-foreground'}>Add new source</h1>
    //     <p className={'mb-3 text-foreground-muted'}>Select a file and drag it.</p>
    //     <input id='file-upload' className='hidden' multiple type='file' onChange={selectFileHandler} />
    //     {fileName && <p>{fileName}</p>}
    //     <Button onClick={uploadAndEmbedFileHandler} variant={'outline'}>Import</Button>
    //   </Box>
    // </Box>
  );
}
