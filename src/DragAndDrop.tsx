import React, { ChangeEvent } from 'react'
//@ts-ignore
import { getFilesFromDragEvent } from "html-dir-content";

import { UploadManager } from "./UploadManager";

export interface IDragProps{
  path:string;
  onUploadComplete:()=>void;
  uploadFilter?:(fileName:string)=>boolean;
  UploadComponent:React.ComponentClass;
  dragRootStyle?:React.CSSProperties,
  dragTextStyle?:React.CSSProperties,
  dropText?:string
};

export class DragAndDrop extends React.Component<IDragProps,any> {

  state = {
    drag: false
  }

  private dragCounter:number=0;

  private folder_input:HTMLInputElement|null=null;
  private file_input:HTMLInputElement|null=null;

  
  handleDrag = (e:Event) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragIn = (e:DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e?.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      this.setState({drag: true});
    }
  }

  handleDragOut = (e:Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.setState({drag: false});
    }
  }

  handleDrop = (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({drag: false})
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      getFilesFromDragEvent(e, {recursive:true,withFullPath:true}).then((files:File[]) => {
        if (UploadManager.uploadFiles)
          UploadManager.uploadFiles({
            files:this.processFiles(files),
            path:this.props.path,
            onUploadComplete:this.props.onUploadComplete,
            UploadComponent:this.props.UploadComponent
          });
        e.dataTransfer.clearData();
      this.dragCounter = 0;
      });
    }
  }

  handleInput= (e:ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault();
    e.stopPropagation();
    if (UploadManager.uploadFiles)
      UploadManager.uploadFiles({
        files:this.processFiles((e.target as any).files),
        path:this.props.path,
        onUploadComplete:this.props.onUploadComplete,
        UploadComponent:this.props.UploadComponent
      });
  }

  processFiles=(files:any)=>{
    let _files=[].map.call(files,i=>i) as File[];
    if (this.props.uploadFilter)
      _files=files.filter(this.props.uploadFilter);
    return _files;
  }

  componentDidMount() {
    let div = document.body;
    div.addEventListener('dragenter', this.handleDragIn);
    div.addEventListener('dragleave', this.handleDragOut);
    div.addEventListener('dragover', this.handleDrag);
    div.addEventListener('drop', this.handleDrop); 
    (this.folder_input as any).directory = true;
    (this.folder_input as any).webkitdirectory = true;
    (this.folder_input as any).allowdirs=true;
    UploadManager.openUploadFiles=()=>(this.file_input as any).click();
    UploadManager.openUploadFolders=()=>(this.folder_input as any).click();
    UploadManager.canUpload=true;
  }

  componentWillUnmount() {
    let div = document.body;
    div.removeEventListener('dragenter', this.handleDragIn);
    div.removeEventListener('dragleave', this.handleDragOut);
    div.removeEventListener('dragover', this.handleDrag);
    div.removeEventListener('drop', this.handleDrop);
    UploadManager.openUploadFiles=undefined;
    UploadManager.openUploadFolders=undefined;
    UploadManager.canUpload=false;
  }

  render= () =><>
    <div style={{display:"none"}}>
      <input type='file' ref={ref => this.folder_input = ref} onChange={this.handleInput} multiple />
      <input type='file' ref={ref=> this.file_input =ref} onChange={this.handleInput} multiple />
    </div>
    {this.state.drag &&
      <div style={this.props.dragRootStyle||{
        border: "dashed grey 4px",
        backgroundColor: "rgba(255,255,255,.8)",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999
      }}>
        <div style={this.props.dragTextStyle||{
            position: "absolute",
            top: "50%",
            right: 0,
            left: 0,
            textAlign: "center",
            color: "grey",
            fontSize: 36
        }}>
          {this.props.dropText || "Drop file here"}
        </div>
      </div>
    }
    {this.props.children}
  </>
}