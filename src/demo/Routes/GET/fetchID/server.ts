import { useRequest, useResponse } from "../../../../utils/constants";

export default async function(){
    const [req, res] = [useRequest(), useResponse()]
    res
    .status(200)
    .json({ _id: crypto.randomUUID() })
}