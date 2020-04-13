

# react-drag-drop-upload
Fullscreen drag drop upload component for react

## Usage

### Create Uploader Container

Create upload container
	
```javascript
import  React  from  'react';
import { UploadContainer } from  '@react-drag-drop-upload/core';
import  components from  '@react-drag-drop-upload/fabric-ui';
//import  *  as  components  from  '@react-drag-drop-upload/fabric-ui';
//import  *  as  components  from  '@react-drag-drop-upload/antd';
//import  *  as  components  from  '@react-drag-drop-upload/material-ui';

const  AppPage= () =>
	<UploadContainer  {...components}>
		{...}
	</UploadContainer>;

```

### DragDrop item

``` javascript
import  UploadManager,{DragAndDrop}  from  '@react-drag-drop-upload/core';

const  canUpload= file  => {
	let  name=file.name.split("/").pop();
	return !name.startsWith(".") && !name.startsWith("_");
}

const  Component({UploadItem,refreshFiles})=> {
	return <>
		<DragAndDrop 
			path={path} 
			UploadComponent={UploadItem}
			onUploadComplete={debounce(refreshFiles, 300)}
			uploadFilter={canUpload}
		/>
		<h1>Upload Sample</h1>
		<button onClick={UploadManager.openUploadFiles}>
			Upload Files
		</button>
		<button onClick={UploadManager.openUploadFolders}>
			Upload Folders
		</button>
	</>
};
```

### UploadItem

``` javascript
import  React  from  "react";

class  UploadItem  extends  React.Component {

	constructor(props){
		super(props);
		let {file}=props;
		let  fileName=file.name || file.fileName;
		let  filePath=file.webkitRelativePath;
		if (fileName.startsWith("/"))
			fileName=fileName.substr(1);
		else  if(filePath)
			fileName=filePath;
		filePath="";
		if(fileName.indexOf("/")!=-1){
			filePath=fileName.split("/").slice(0,-1).join("/")+"/";
			fileName=fileName.split("/").pop();
		}
		this.state={
			fileName,
			filePath
		};
	};
	componentDidMount(){
		this.setState({uploadState:"Checking});
		let {path,file}=this.props;
		let {fileName,filePath}=this.state;
		this.putFile({
			path:path+filePath+fileName,
			file:file,
			onSuccess:()=> this.props.onUploadComplete(
				this.props.id,
				file,
				path,
				"Uploaded"
			),
			onFail:(status,statusText)=>{
				console.log("Error on file"+ filePath+fileName, statusText);
				this.props.onUploadComplete(this.props.id,file,path,"Error on upload",'error')
			},
			onProgress:uploadStatus =>this.setState({uploadStatus})
		});
	}
	
	putFile=({path,file,onSuccess,onFail,onProgress,withoutContent})=>
		fetch(path,{
			method:"PUT,
			body:file,
			success:(status,statusText)=>{
				if (status>=200 && status<300){
				onSuccess();
			}else{
				onFail(status,statusText);
			},
			fail:onFail
		});
/*		progressListener:  evt  => {
			if (evt.lengthComputable && onProgress) {
				onProgress(Math.ceil( (evt.loaded / evt.total) * 100));
			}
		}
	});*/

	render(){
		return  <this.props.Renderer 
			fileName={this.state.fileName}
			chunk={this.state.chunk}
			chunkCount={this.state.count}
			uploadState={this.state.uploadStatus}
		/>;
	};
}

```

```

## Projects

| Project |Platforms|Type|Definition|
|-|-|-|-|
|@react-drag-drop-upload/core|react,react-native|Core||
|@react-drag-drop-upload/antd|react|Widget|Ant Design Widget Set|
|@react-drag-drop-upload/bootstrap|react|Widget|Bootstrap Widget Set|
|@react-drag-drop-upload/fabric-ui|react|Widget|Fabric Ui Widget Set|
|@react-drag-drop-upload/material-ui|react|Widget|Material Ui Widget Set|
 

## Live Playground

Not implemented yet.

## License

MIT