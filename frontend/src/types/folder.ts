type Folder = {
  id: string;
  parent_id: string | null;
  name: string;
  sub_folders: Folder[];
};

export default Folder;
