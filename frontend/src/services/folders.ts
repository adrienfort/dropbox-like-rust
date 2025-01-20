import servicesURL from ".";
import Folder from "../types/folder";

const getFolder = async (id?: string) =>
  servicesURL.get<Folder[]>("/folders", {
    params: {
      id,
    },
  });

const postFolder = async (name: string, parent_id?: string) => {
  const body = parent_id ? { name, parent_id } : { name };
  return await servicesURL.post<Folder>("/folders", body);
};

const patchFolder = async (id: string, new_name: string) =>
  servicesURL.patch<Folder>(`/folders/${id}`, {
    name: new_name,
  });

const deleteFolder = async (id: string) =>
  servicesURL.delete<Folder>(`/folders/${id}`);

const foldersService = {
  get: getFolder,
  post: postFolder,
  patch: patchFolder,
  delete: deleteFolder,
};

export default foldersService;
