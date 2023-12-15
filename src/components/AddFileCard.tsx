import React, { ReactElement } from "react";
import {CardHeader, Card, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import { Button } from "./ui/button";
import {FilePlus} from "lucide-react";

export default function AddFileCard({ fileName, uploadAndEmbedFileHandler, selectFileHandler }: any): ReactElement {
    const status = 'live';
    return (
        <Card>
            <CardHeader className='space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                    Import new source
                </CardTitle>
                <CardDescription>
                    Select a file and drag it.
                </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-row justify-between items-center'>
                <input id='file-upload' className='hidden' multiple type='file' onChange={selectFileHandler}/>
                {fileName && <p>{fileName}</p>}
                {
                    fileName
                    ? <Button onClick={uploadAndEmbedFileHandler}>Upload</Button>
                    :
                    <label htmlFor='file-upload'>
                        <FilePlus/>
                    </label>
                }
            </CardContent>
        </Card>
  );
}
