import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

const setCookie = (req: NextApiRequest, res: NextApiResponse) => {
  // Set a cookie directly using the Set-Cookie header
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(req.body.key, req.body.value, {
      httpOnly: true,
      path: "/",
      maxAge: req.body.maxAge, // 6 months
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
  );

  res.status(200).json({ message: "Cookie set successfully" });
};

export default setCookie;
