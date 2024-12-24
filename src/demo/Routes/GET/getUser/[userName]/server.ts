import { useRequest, useResponse } from "../../../../../utils/constants";
import { getUser } from "../../../../constants";

export default async function(){
   const [req, res] = [useRequest(), useResponse()]
   const { userName } = req.params;
   const user = getUser(userName)
   res
   .status(200)
   .json({ user: user ?? "Unable to locate any user" })
}