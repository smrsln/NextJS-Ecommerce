import { Dialog, Transition } from "@headlessui/react";
import { useState } from "react";

export default function SignUp() {
  const [isOpen, setIsOpen] = useState(true);

  // Add your own sign up logic here
  return (
    <Transition.Root show={isOpen} as={Dialog} onClose={setIsOpen}>
      <Dialog.Title>Sign Up</Dialog.Title>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
    </Transition.Root>
  );
}
