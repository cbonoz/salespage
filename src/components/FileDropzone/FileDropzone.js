import { Input, Empty} from "antd";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { bytesToSize, isEmpty } from "../../util";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  borderRadius: '5px',
  width: 400,
  textAlign: "left",
  height: 230,
  overflow: "hidden",
  padding: 4,
  paddingTop: 8,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

export function FileDropzone({ files, setFiles, updateInfo, info }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      console.log("files", acceptedFiles);
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  const thumbs = files.map(file => {
    const fileInfo = info[file.name] || {};
    const updateFileInfo = (key, value) => {
      updateInfo(file.name, {...fileInfo, [key]: value });
    };
    return (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <p>
            <img src={file.preview} className="preview-image" />
            <b>{file.name}</b>
            <br />
            {file.size && (
              <span>
                Size: {bytesToSize(file.size)}
                <br />
              </span>
            )}
            {file.type && <span>Type: {file.type}</span>}

            <Input
              addonBefore={"Name: "}
              placeholder="Enter item name"
              value={fileInfo['name']}
              onChange={e => updateFileInfo('name', e.target.value)}
            />
            <Input
              addonBefore={"Description: "}
              placeholder="Enter description"
              value={fileInfo['description']}
              onChange={e => updateFileInfo('description', e.target.value)}
            />
            <Input
              addonBefore={"Price (USD): "}
              placeholder="Enter decimal price in USD"
              value={fileInfo['usd']}
              onChange={e => updateFileInfo('usd', e.target.value)}
            />
          </p>
        </div>
      </div>
    );
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  const noFiles = isEmpty(files)

  return (
    <section>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <br/>
      {!noFiles && <h3>Items</h3>}
      {noFiles && <div>
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={<span><h4>No items!</h4>Get started by uploading an image of your first item.</span>}
      /></div>}
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}