import { signIn } from "next-auth/react";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      username,
      password,
      callbackUrl: `${window.location.origin}/protected`,
    });
  };

  return (
    <Transition.Root show={true} as={Dialog} onClose={() => {}}>
      <Dialog.Title>Sign In</Dialog.Title>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
    </Transition.Root>
  );
}
