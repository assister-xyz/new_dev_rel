import { DOMAIN } from "@/constants/domains";

export async function embeddAndStoreFileApi({ client, selectedFile, fileType }: { selectedFile: File; client: string; fileType: string }): Promise<Response> {
  const fileFormData = new FormData();
  fileFormData.append("file", selectedFile);

  const response = await fetch(`${DOMAIN}/api/file/?client-name=${client}&file-type=${fileType}`, {
    method: "POST",
    body: fileFormData,
  });

  return response;
}

// ------------------------------------------------------------------------------------------------------------

export async function getEmbeddedFileRefsApi(client: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/file/?client-name=${client}`, {
    method: "GET",
  });
  return response;
}

// ------------------------------------------------------------------------------------------------------------

export async function deleteEmbeddedFileApi(fileId: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/file/?file-id=${fileId}`, {
    method: "DELETE",
  });
  return response;
}
