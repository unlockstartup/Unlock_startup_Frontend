import publisherApi from "../publisherapi";

export async function uploadFiles(files) {
  const fd = new FormData();
  for (const f of files) fd.append("files", f);
  return publisherApi.post("/api/uploads", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

