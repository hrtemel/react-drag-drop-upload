import React from 'react';

import { UploadManager } from "./UploadManager";

let queueId=0;
const MAX_UPLOAD_COUNT=1;

export interface UploadContainerProps{
    UploaderUi:React.ComponentClass<IUploaderUiProps>;
    UploadItemRenderer:React.ComponentClass;
    title?:string
    waitingCountText?:string;
}

export  interface IUploaderUiProps{
    inProgress:IQueueItem[],
    completed:{
        id:number,
        name:string,
        result:any,
        resultType:any

    }[],
    queue:IQueueItem[];
    title?:string;
    waitingCountText?:string;
}

export interface IQueueItem{
    file:File,
    path:string,
    onUploadComplete:()=>void,
    key:number,
    id:number,
    UploadComponent:React.ComponentClass<any>
}

interface UpdateContainerState{
    inProgress:IQueueItem[],
    completed:{
        id:number,
        name:string,
        result:any,
        resultType:any

    }[],
}
export class UploadContainer extends React.Component<UploadContainerProps,UpdateContainerState> {

    constructor(props:any){
        super(props);
        this.state = {
            inProgress:[],
            completed:[]
        };
    }

    private  queue:IQueueItem[]=[];
    private _timer?:number=undefined;

    onUploadComplete= (onUploadComplete:(id:number,file:File,path:string)=>void)=>(id:number,file:any,path:string,result:any,resultType:any)=>{    
        this.setState({
            inProgress:this.state.inProgress.filter( i=> i.id==id),
            completed:[
                ...this.state.completed,{
                    id:id,
                    name:file.name ||file.fileName,
                    result:result,
                    resultType:resultType
                }
            ]},()=>onUploadComplete(id,file,path)
        );
        setTimeout(()=>(this as any)["_id"+id]=true,resultType=="error"?10000:3000);
    }

    uploadFiles=({files,path,onUploadComplete,UploadComponent}:{files:File[],path:string,UploadComponent:React.ComponentClass,onUploadComplete:()=>void})=>{
        files.forEach(file =>(this as any).uploadFile({file,path,onUploadComplete,UploadComponent}));
    }

    uploadFile=({file,path,onUploadComplete,UploadComponent}:{file:File,path:string,UploadComponent:React.ComponentClass,onUploadComplete:()=>void})=>{
        const key=queueId++;
        this.queue=[...this.queue,{
            file,
            path,
            onUploadComplete,
            key:key,
            id:key,
            UploadComponent
        }];
    }

    checkQueue=()=> {
        let stateChanged=false;
        let state={};
        if (this.queue.length && this.state.inProgress.length<MAX_UPLOAD_COUNT){
            const item=this.queue[0];
            this.queue=this.queue.slice(1,this.queue.length);
            state={
                inProgress:[
                    ...this.state.inProgress,
                    <item.UploadComponent {...item} Renderer={this.props.UploadItemRenderer} onUploadComplete={this.onUploadComplete(item.onUploadComplete)}/>
                ]
            };
            stateChanged=true;
        }
        if (this.state.completed.filter(i => (this as any)["_id"+i.id]).length){
            state={
                ...state,
                completed:this.state.completed.filter(i=>!(this as any)["_id"+i.id])
            };
            stateChanged=true;
        }
        if (stateChanged)
            this.setState(state);
    }

    componentDidMount(){
        this._timer=setInterval(this.checkQueue,200);
    }

    componentWillUnmount(){
        clearInterval(this._timer);
    }
    
    render() {
        UploadManager.uploadFiles=this.uploadFiles;
        UploadManager.uploadFile=this.uploadFile;
        return <>
            <this.props.UploaderUi
                inProgress={this.state.inProgress}
                queue={this.queue}
                completed={this.state.completed}
                title={this.props.title}
                waitingCountText={this.props.waitingCountText}
            />
            {this.props.children}
        </>;
    }
}

