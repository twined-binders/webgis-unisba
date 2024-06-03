import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Link } from "@nextui-org/react";
import { MailIcon } from "../icons/MailIcon";
import { LockIcon } from "../icons/LockIcon";

export default function SignModalComponent({ isOpen, onClose, Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full">
      <ModalContent className="w-full">
        <>
          <ModalHeader className="flex flex-col gap-1">{Mode === "login" ? "Login" : "Register"}</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {Mode === "register" && <Input type="password" label="Confirm Password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />}
            <div className="flex py-2 px-1 justify-between">
              <Checkbox
                classNames={{
                  label: "text-small",
                }}
              >
                Remember me
              </Checkbox>
              <Link color="primary" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <div>
              <p>{notice}</p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" variant="flat" onClick={(e) => signInWithEmailAndPassword(e)}>
              {Mode === "login" ? "Login" : "Register"}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
