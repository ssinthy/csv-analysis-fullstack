import { useState } from "react";
import { FileMetadata } from "../types";
import { ListItem, ListItemText, Button } from "@mui/material";

type Props = {
  myFileList: FileMetadata[];
};

export default function UploadedFileList(props: Props) {
  const { myFileList } = props;

  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

  return (
    <>
      {myFileList.map((element: any) => {
        return (
          <ListItem
            divider
            key={element.filename + element.file_type}
            onClick={() => {
              setSelectedFile(element);
            }}
            component={Button}
            style={{
              backgroundColor:
                element === selectedFile ? "lightgray" : "inherit",
            }}
          >
            <ListItemText
              primary={element.filename}
              secondary={element.file_type}
            />
          </ListItem>
        );
      })}
    </>
  );
}

export { UploadedFileList };
