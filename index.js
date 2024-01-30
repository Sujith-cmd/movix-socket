
// const chatModelPromise = import('../backend/Model/Usermodel.js');




const io=require('socket.io')(8800,{
    cors:{
        origin: "http://localhost:5173"
    }
})

let activeUsers=[]

io.on("connection",(socket)=>{
    socket.on('new-user-add',(newUserId)=>{
        
        if(!activeUsers.some((user)=>user.userId === newUserId)){
            activeUsers.push({
                userId:newUserId,
                socketId:socket.id
            })
        }
      
        io.emit('get-users',activeUsers)
    })


    socket.on("send-message",(data)=>{
       

            const {receiverId,senderId}=data
            const user= activeUsers.find((user)=>user.userId ===receiverId)
            // console.log("sending from socket io ",receiverId);
            // console.log("data socket", data);
            if(user){
                io.to(user.socketId).emit("receive-message", data)
                
            }
            // else{
            //     chatModelPromise.then(module => {
            //         const chatModel = module.default;
            //         const chatChange=async()=>{
            //             // const resp = await chatModel.updateOne(
            //             //     { members: { $all: [receiverId, senderId] } },
            //             //     { $set: { readStatus: "unread" } }
            //             // );
            //             const resp = await chatModel.updateOne(
            //                 { username: "arman" },
            //                 { $set: { account_Bal: 100 } }
            //             );
            //         }
            //         chatChange()
            //     }).catch(err => {
            //         // Handle import error
            //     });
            // }
        
    }
    )

    socket.on("disconnect",()=>{
        activeUsers= activeUsers.filter((user)=>user.socketId !==socket.id)
        // console.log("user disconnected",activeUsers);
        io.emit('get-users',activeUsers)
    })
})