import { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";

import Folder from "./types/folder";
import { services } from "./services";
import FolderTree from "./components/FolderTree";
import { YesIcon, NoIcon, AddFolderIcon } from "./components/Icons";

function App() {
  const [name, setName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [folders, setFolders] = useState<Folder[]>([]);

  const getFolder = async (id?: string) => {
    try {
      const res = await services.folders.get(id);
      console.log(res);
      setFolders(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch folders.");
    }
  };

  const addFolder = async (name: string, parent_id?: string) => {
    try {
      const res = await services.folders.post(name, parent_id);
      console.log(res);
      toast.success(`Folder ${res.data.name} created.`);
      await getFolder();
    } catch (error) {
      console.error(error);
      toast.error("Unable to create folder.");
    }
  };

  const renameFolder = async (id: string, new_name: string) => {
    try {
      const res = await services.folders.patch(id, new_name);
      console.log(res);
      toast.success(`Folder renamed to ${res.data.name}.`);
      await getFolder();
    } catch (error) {
      console.error(error);
      toast.error("Unable to rename folder.");
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const res = await services.folders.delete(id);
      console.log(res);
      toast.success(`Folder ${res.data.name} and its sub-folders deleted.`);
      await getFolder();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete folder.");
    }
  };

  useEffect(() => {
    getFolder();
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="prose lg:prose-xl">
        <h4>Welcome to your Rust Dropbox-like app</h4>
      </div>
      {/* <!-- Tree Root --> */}
      <div className="mt-4 w-full max-w-screen-md">
        <div
          className="hs-accordion-treeview-root"
          role="tree"
          aria-orientation="vertical"
        >
          {isCreating ? (
            <div className="flex items-center gap-x-3">
              <input
                placeholder="new folder"
                className="my-1"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                onClick={() => {
                  addFolder(name);
                  setName("");
                  setIsCreating(false);
                }}
              >
                <YesIcon />
              </button>
              <button
                onClick={() => {
                  setName("");
                  setIsCreating(false);
                }}
              >
                <NoIcon />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsCreating(true)}>
              <AddFolderIcon />
            </button>
          )}
          {/* <!-- Level Accordion Group --> */}
          <div className="hs-accordion-group">
            <FolderTree
              folders={folders}
              addFolder={addFolder}
              renameFolder={renameFolder}
              deleteFolder={deleteFolder}
            />
          </div>
          {/* <!-- End Level Accordion Group --> */}
        </div>
        {/* <!-- End Tree Root --> */}
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
