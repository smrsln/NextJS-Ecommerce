import { signInService, signUpService } from "@/app/services/user-service";
import { handleError } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

class UserController {
  static async createUser(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    try {
      const user = await signUpService(email, password);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      handleError(res, error);
    }
  }

  static async signIn(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    try {
      const user = await signInService(email, password);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default UserController;
