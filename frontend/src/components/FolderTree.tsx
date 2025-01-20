import { useState } from "react";
import { YesIcon, NoIcon, AddFolderIcon, EditIcon, BinIcon } from "./Icons";
import Folder from "../types/folder";

const FolderTree = ({
  folders,
  addFolder,
  renameFolder,
  deleteFolder,
}: {
  folders: Folder[];
  addFolder: (name: string, parent_id?: string) => void;
  renameFolder: (id: string, new_name: string) => void;
  deleteFolder: (id: string) => void;
}): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState<{ bool: boolean; key?: string }>({
    bool: false,
    key: undefined,
  });
  const [isCreating, setIsCreating] = useState<{ bool: boolean; key?: string }>(
    {
      bool: false,
      key: undefined,
    }
  );

  return (
    <>
      {folders.map((folder) => (
        <div key={folder.id}>
          {/* <!-- Level Nested Accordion --> */}
          <div
            className="hs-accordion active"
            role="treeitem"
            aria-expanded="true"
          >
            {/* <!-- Level Accordion Heading --> */}
            <div className="hs-accordion-heading py-0.5 flex items-center gap-x-0.5 w-full">
              <button
                className="hs-accordion-toggle size-6 flex justify-center items-center hover:bg-gray-100 rounded-md focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                aria-expanded="true"
                aria-controls="hs-basic-usage-example-tree-sub-collapse-one"
              >
                <svg
                  className="size-4 text-gray-800 dark:text-neutral-200"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path
                    className="hs-accordion-active:hidden block"
                    d="M12 5v14"
                  ></path>
                </svg>
              </button>

              <div className="hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-1.5 rounded-md cursor-pointer">
                <div className="flex items-center gap-x-3">
                  {isEditing.bool && isEditing.key === folder.id ? (
                    <input
                      autoFocus
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                  ) : (
                    <span className="text-sm text-gray-800 dark:text-neutral-500">
                      {folder.name}
                    </span>
                  )}
                </div>
              </div>
              {!isCreating.bool &&
              isEditing.bool &&
              isEditing.key === folder.id ? (
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => {
                      renameFolder(folder.id, inputValue);
                      setInputValue("");
                      setIsEditing({ bool: false, key: undefined });
                    }}
                  >
                    <YesIcon />
                  </button>
                  <button
                    onClick={() => {
                      setInputValue("");
                      setIsEditing({ bool: false, key: undefined });
                    }}
                  >
                    <NoIcon />
                  </button>
                </div>
              ) : (
                !isCreating.bool && (
                  <div className="flex items-center gap-x-3">
                    <button
                      onClick={() => {
                        setInputValue("");
                        setIsEditing({ bool: false, key: undefined });
                        setIsCreating({ bool: true, key: folder.id });
                      }}
                    >
                      <AddFolderIcon />
                    </button>
                    <button
                      onClick={() => {
                        setInputValue(folder.name);
                        setIsCreating({ bool: false, key: undefined });
                        setIsEditing({ bool: true, key: folder.id });
                      }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure ? All sub-folders will also be deleted."
                          )
                        ) {
                          deleteFolder(folder.id);
                        }
                      }}
                    >
                      <BinIcon />
                    </button>
                  </div>
                )
              )}
            </div>
            {/* <!-- End Level Accordion Heading --> */}

            {/* <!-- Level Collapse --> */}
            <div
              className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
              role="group"
              aria-labelledby="hs-basic-usage-example-tree-sub-heading-one"
            >
              {/* <!-- Sub Level Accordion Group --> */}
              <div
                className="hs-accordion-group ps-7 relative before:absolute before:top-0 before:start-3 before:w-0.5 before:-ms-px before:h-full before:bg-gray-100 dark:before:bg-neutral-700"
                role="group"
                data-hs-accordion-always-open=""
              >
                {!isEditing.bool &&
                  isCreating.bool &&
                  isCreating.key === folder.id && (
                    <div className="flex items-center gap-x-3">
                      <input
                        placeholder="new folder"
                        className="my-1"
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <button
                        onClick={() => {
                          addFolder(inputValue, folder.id);
                          setInputValue("");
                          setIsCreating({ bool: false, key: undefined });
                        }}
                      >
                        <YesIcon />
                      </button>
                      <button
                        onClick={() => {
                          setInputValue("");
                          setIsCreating({ bool: false, key: undefined });
                        }}
                      >
                        <NoIcon />
                      </button>
                    </div>
                  )}
                <FolderTree
                  folders={folder.sub_folders}
                  addFolder={addFolder}
                  renameFolder={renameFolder}
                  deleteFolder={deleteFolder}
                />
              </div>
              {/* <!-- End Sub Level Accordion Group --> */}
            </div>
            {/* <!-- End Level Collapse --> */}
          </div>
          {/* <!-- End Level Nested Accordion --> */}
        </div>
      ))}
    </>
  );
};

export default FolderTree;
