import { useRequest, useResponse } from "../../../../../utils/constants";
import { addUser } from "../../../../constants";

export default async function () {
  const [req, res] = [useRequest(), useResponse()];
  const { userName } = req.params;
  const user = addUser(userName);
  res.status(200).json({ user: user });
}
