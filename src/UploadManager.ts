

export interface UploadManagerType{
    openUploadFiles?:(event:any)=>null;
    openUploadFolders?:(event:any)=>null;
    canUpload?:boolean;
    uploadFiles?:(props:{
        files:File[],
        path:string,
        UploadComponent:React.ComponentClass,
        onUploadComplete:()=>void
    })=>void;
    uploadFile?:(props:{
        file:File,
        path:string,
        UploadComponent:React.ComponentClass,
        onUploadComplete:()=>void
    })=>void;
}

export const UploadManager:UploadManagerType={};

export default UploadManager;
