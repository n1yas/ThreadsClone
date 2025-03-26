import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useFollow(){

    const queryClient=useQueryClient()

    const LoggedUser=localStorage.getItem("userId")

     return  useMutation({
        mutationFn:async(userid:string)=>{
            console.log(userid);
            
          const response=await axios.post(`/api/external/users/follow/${LoggedUser}`,
            {userFollowId:userid}
          );
          return response.data
        },
        onSuccess:()=>{
          queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError:(error)=>{
          console.log(error)
        }
      })
}