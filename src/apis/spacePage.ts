import { DOMAIN } from "@/constants/domains";

export async function embeddAndStoreFileApi({ client, selectedFile, fileType }: { selectedFile: File; client: string; fileType: string }): Promise<Response> {
  console.log("embeddAndStoreFileApir runs");
  const fileFormData = new FormData();
  fileFormData.append("file", selectedFile);

  const response = await fetch(`${DOMAIN}/api/file/?client-name=${client}&file-type=${fileType}`, {
    method: "POST",
    body: fileFormData,
  });

  return response;
}

// ------------------------------------------------------------------------------------------------------------

export async function getEmbeddedFilesApi(client: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/file/?client-name=${client}`, {
    method: "GET",
  });
  return response;
}

// ------------------------------------------------------------------------------------------------------------

export async function deleteEmbeddedFileApi(id: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/file/?file-id=${id}`, {
    method: "DELETE",
  });
  return response;
}
